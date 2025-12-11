import {
  MeteorShowerProps,
  MeteorElementProps,
} from "@/interfaces/auth.interface";
import { MeteorConfig, MeteorState } from "@/interfaces/theme.interface";
import { meteorStrike } from "@/theme/keyframes";
import { StyleComponent } from "@/types/classKey";
import { parseUnit } from "@/utils/themeUtils";
import { Box, styled, useThemeProps } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const PREFIX = "RazethMeteor";

// Styled root container
const MeteorRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(() => ({}));

// Meteor item container
const MeteorItem = styled(Box, {
  name: PREFIX,
  slot: "Item",
  overridesResolver: (_props, styles) => styles.item,
})(() => ({}));

const MeteorSprite = styled(Box, {
  name: PREFIX,
  slot: "Content",
  shouldForwardProp: (prop: string) => prop !== "size",
  overridesResolver: (_props, styles) => styles.content,
})<{ size: string | number }>(({ size }) => ({
  // width: `${size}px`,
  // height: `${size}px`,
  // Ensure size handles both string (100px) and number (100)
  width: typeof size === "number" ? `${size}px` : size,
  height: typeof size === "number" ? `${size}px` : size,
  backgroundImage: "url(static/images/meteors-sprite.png)",
  // backgroundSize: "auto 100%",
  backgroundSize: "4800% 100%",
  animation: `${meteorStrike} 1.5s steps(47) infinite`,
  transform: "rotate(45deg)",
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
    `translate(${sizePx}px, -${sizePx}px)`
  );

  // State for dynamic duration
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    // 3. Calculate Travel Distance
    // The meteor travels from its random start point down to the bottom of the container.
    // distanceToTravel = Height of Container - Start Position + Offset
    const startY = meteor.startFromTop ? meteor.initialTop : 0;
    const distanceY = containerHeight - startY + sizePx; // Add size to ensure it clears the bottom

    // 4. Calculate Duration based on Distance and Base Speed (Velocity)
    // meteor.speed now acts as "Velocity Factor" (Lower = Faster, Higher = Slower)
    // Formula: Time = Distance * (Slowness Factor)
    // We divide by 1000 to keep numbers manageable.
    // Example: 800px distance * 0.005 factor = 4s duration.
    const baseVelocity = meteor.speed * 0.00125;

    // "The longer the distance, the faster the speed"
    // We can reduce the duration slightly for very long distances to simulate acceleration
    const accelerationFactor = distanceY > 1500 ? 0.85 : 1;

    const calculatedDuration = distanceY * baseVelocity * accelerationFactor;

    setDuration(calculatedDuration);

    // 5. Trigger Animation
    // Trigger animation after mount
    const timer = setTimeout(() => {
      const distance =
        containerHeight - (meteor.startFromTop ? meteor.initialTop : 0);
      setTransform(`translate(-${distance}px, ${distance}px)`);
    }, 100);

    return () => clearTimeout(timer);
  }, [meteor, containerHeight, sizePx]);

  return (
    <MeteorItem
      sx={{
        left: meteor.left, // This handles '100%' or numbers automatically via MUI
        top: meteor.top,
        zIndex: meteor.zIndex,
        transform: transform,
        // transition: `transform ${meteor.speed}s linear`,
        // Apply the calculated duration
        transition: `transform ${duration}s linear`,
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
  const {
    configs = [
      { size: "600px", speed: 5, maxCount: 2, count: 0, zIndex: 10 },
      { size: "300px", speed: 10, maxCount: 3, count: 0, zIndex: 4 },
      { size: "150px", speed: 15, maxCount: 5, count: 0, zIndex: 0 },
    ],
    interval = 500,
    enabled = true,
    className,
    sprite,
    sx,
    ...rest
  } = props;

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

    const interval = setInterval(createMeteor, 1000);

    return () => clearInterval(interval);
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
