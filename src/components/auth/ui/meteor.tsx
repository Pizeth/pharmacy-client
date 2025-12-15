import {
  MeteorShowerProps,
  MeteorElementProps,
  MeteorVariables,
} from "@/interfaces/auth.interface";
import { MeteorConfig, MeteorState } from "@/interfaces/theme.interface";
import { meteorStrike } from "@/theme/keyframes";
import { StyleComponent } from "@/types/classKey";
import { parseUnit } from "@/utils/themeUtils";
import { Box, styled, useThemeProps } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const PREFIX = "RazethMeteor";

// 1. Root Container
const MeteorRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(() => ({}));

// 2. Meteor Item (The moving wrapper)
const MeteorItem = styled(Box, {
  name: PREFIX,
  slot: "Item",
  overridesResolver: (_props, styles) => styles.item,
})(() => ({}));

// 3. Meteor Sprite (The visual content)
const MeteorSprite = styled(Box, {
  name: PREFIX,
  slot: "Content",
  // Prevent 'size' from being passed to the DOM element
  shouldForwardProp: (prop: string) => prop !== "size",
  overridesResolver: (_props, styles) => styles.content,
})<{ size: string | number }>(({ size }) => ({
  // We handle the dynamic size here because it changes per-meteor
  // but relies on the CSS-in-JS engine.
  width: size,
  height: size,
  // backgroundImage: "url(static/images/meteors-sprite.png)",
  // backgroundSize: "4800% 100%",
  // animation: `${meteorStrike} 1.5s steps(47) infinite`,
  // transform: "rotate(45deg)",
}));

const MeteorElement: React.FC<MeteorElementProps> = ({
  meteor,
  containerHeight,
}) => {
  // 1. Convert size to raw pixels for calculation
  const sizePx = parseUnit(meteor.size, containerHeight);

  // 2. Initial state: hidden slightly off-screen (top-right relative to spawn)
  // We use sizePx directly, no need to append 'px' manually if we assume pixels in transform
  const [transform, setTransform] = useState<string>(
    `translate3d(${sizePx}px, -${sizePx}px, 0)` // Use 3d for GPU acceleration
  );

  // State for dynamic duration
  const [duration, setDuration] = useState<string>("0s");

  useEffect(() => {
    // 3. Calculate Travel Distance
    // The meteor travels from its random start point down to the bottom of the container.
    // distanceToTravel = Height of Container - Start Position + Offset
    const startY = meteor.startFromTop ? meteor.initialTop : 0;

    // Total vertical distance to travel (Container + buffer to clear edge)
    const distanceY = containerHeight - startY + sizePx; // Add size to ensure it clears the bottom

    // 4. Calculate Duration based on Distance and Base Speed (Velocity)
    // meteor.speed now acts as "Velocity Factor" (Lower = Faster, Higher = Slower)
    // Formula: Time = Distance * (Slowness Factor)
    // We divide by 1000 to keep numbers manageable.
    // Example: 800px distance * 0.005 factor = 4s duration.

    // Velocity = Pixels per Second.
    // We increase base velocity for longer distances to add "energy".
    // Base speed comes from config (e.g., 5).
    const baseVelocity = meteor.speed * 0.0025;

    // "The longer the distance, the faster the speed"
    // We can reduce the duration slightly for very long distances to simulate acceleration
    // const accelerationFactor = distanceY > 1500 ? 0.85 : 1;

    // If distance is huge (>1000px), we boost velocity by 20%
    // This makes long meteors zip across faster.
    const accelerationFactor = distanceY > 1500 ? 1.2 : 1;

    // const calculatedDuration = distanceY * baseVelocity * accelerationFactor;

    // Time = (Distance * Velocity) / Acceleration
    const calculatedDuration = (distanceY * baseVelocity) / accelerationFactor;

    // setDuration(calculatedDuration);

    setDuration(`${calculatedDuration.toFixed(2)}s`);

    // 5. Trigger Animation
    // Trigger animation after mount
    const timer = setTimeout(() => {
      // const distance =
      //   containerHeight - (meteor.startFromTop ? meteor.initialTop : 0);
      setTransform(`translate3d(-${distanceY}px, ${distanceY}px, 0)`);
    }, 50);

    return () => clearTimeout(timer);
  }, [meteor, containerHeight, sizePx]);

  return (
    <MeteorItem
      // sx={{
      //   left: meteor.left, // This handles '100%' or numbers automatically via MUI
      //   top: meteor.top,
      //   // zIndex: meteor.zIndex,
      //   transform: transform,
      //   // transition: `transform ${meteor.speed}s linear`,
      //   // Apply the calculated duration
      //   transition: `transform ${duration} linear`,
      // }}
      // We pass DATA via CSS Variables.
      // This is efficient and allows the Theme to decide how to use them.
      // style={
      //   {
      //     "--m-left": meteor.left,
      //     "--m-top": meteor.top,
      //     // "--m-z": meteor.zIndex,
      //     "--m-transform": transform,
      //     "--m-duration": duration,
      //   } as MeteorVariables
      // }
      style={{
        left: meteor.left,
        top: meteor.top,
        // zIndex: meteor.zIndex,
        transform: transform,
        // We only set the duration here. The Property and Easing are in the Theme.
        transitionDuration: duration,
      }}
    >
      {/* <MeteorItem.content size={meteor.size} /> */}
      <MeteorSprite size={sizePx} />
    </MeteorItem>
  );
};

/**
 * A React component that renders a shower of meteors.
 * The shower of meteors will be rendered inside a container with a relative position.
 * The meteors will be animated from top to bottom, with a random size, speed, and z-index.
 * The animation will be triggered every 500ms, and will be removed after the animation completes.
 * @returns {React.ReactElement} A React element that renders a shower of meteors.
 */
// Main Component
export const MeteorShower = (
  inProps: MeteorShowerProps & {
    content?: StyleComponent;
    sprite?: StyleComponent;
  }
) => {
  const props = useThemeProps({ name: PREFIX, props: inProps });
  const { configs, interval, enabled, className, sprite, sx, ...rest } = props;

  // console.log("configs", configs);

  const [meteors, setMeteors] = useState<MeteorState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const configsRef = useRef<MeteorConfig[]>(configs);

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * @param {number} min The minimum value (inclusive)
   * @param {number} max The maximum value (inclusive)
   * @returns {number} A random integer between min and max (inclusive)
   */
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  useEffect(() => {
    configsRef.current = configs;
  }, [configs]);

  useEffect(() => {
    if (!enabled) return;

    /**
     * Creates a new meteor and adds it to the state.
     * If the meteor's count is less than its max count, a new meteor is created.
     * The new meteor's position, size, speed, and z-index are randomly generated.
     * After the animation completes, the meteor is removed from the state.
     */
    const createMeteor = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      const configs = configsRef.current;
      const index = getRandomInt(0, configs.length - 1);
      const config = configs[index];

      if (config.count < config.maxCount) {
        config.count++;

        const startFromTop = getRandomInt(0, 1) === 0;
        const top = getRandomInt(0, containerHeight);
        const left = getRandomInt(0, containerWidth);

        const newMeteor: MeteorState = {
          id: `meteor_${Date.now()}_${Math.random()}`,
          top: startFromTop ? top + 1000 : 0,
          left: startFromTop ? "100%" : left,
          size: config.size,
          speed: config.speed,
          zIndex: config.zIndex * 10,
          startFromTop,
          initialTop: top,
          initialLeft: left,
        };

        setMeteors((prev) => [...prev, newMeteor]);

        // Remove meteor after animation completes
        setTimeout(() => {
          setMeteors((prev) => prev.filter((m) => m.id !== newMeteor.id));
          config.count--;
        }, config.speed * 1000);
      }
    };

    const intervalId = setInterval(createMeteor, 3000);

    return () => clearInterval(intervalId);
  }, [enabled, interval]);

  if (!enabled) return null;

  return (
    <MeteorRoot ref={containerRef} className={className} sx={sx} {...rest}>
      {meteors.map((meteor) => (
        <MeteorElement
          key={meteor.id}
          meteor={meteor}
          containerHeight={containerRef.current?.offsetHeight || 0}
        />
      ))}
    </MeteorRoot>
  );
};

// Slot components for advanced customization
MeteorShower.item = MeteorItem;
MeteorShower.sprite = MeteorSprite;

export default MeteorShower;
