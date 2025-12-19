import { MeteorShowerProps } from "@/interfaces/auth.interface";
import { MeteorConfig, MeteorState } from "@/interfaces/theme.interface";
import {
  MeteorElement,
  MeteorRoot,
  MeteorItem,
  MeteorSprite,
} from "@/theme/components/meteor";
import { StyleComponent } from "@/types/classKey";
import { useThemeProps } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const PREFIX = "RazethMeteor";

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
