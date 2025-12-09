// components/ui/meteor.tsx
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = "RazethMeteor";

// Meteor configuration interface
interface MeteorConfig {
  size: number;
  speed: number;
  maxCount: number;
  count: number;
  zIndex: number;
}

interface MeteorState {
  id: string;
  top: string | number;
  left: string | number;
  size: number;
  speed: number;
  zIndex: number;
  startFromTop: boolean;
  initialTop: number;
  initialLeft: number;
}

// Styled root container
const MeteorRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  overflow: "hidden",
  zIndex: 1,
}));

// Meteor item container
const MeteorItem = styled(Box, {
  name: PREFIX,
  slot: "Item",
  overridesResolver: (_props, styles) => styles.item,
})(({ theme }) => ({
  position: "absolute",
  willChange: "transform",
  pointerEvents: "none",
}));

// Meteor sprite with animation
const MeteorSprite = styled(Box, {
  name: PREFIX,
  slot: "Sprite",
  overridesResolver: (_props, styles) => styles.sprite,
})<{ size: number }>(({ theme, size }) => ({
  width: size,
  height: size,
  backgroundImage:
    "url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/meteors-right/images/meteors-sprite.png)",
  backgroundSize: "auto 100%",
  animation: "meteorFrameAnimation 3s steps(48) infinite",
  transform: "rotate(45deg)",

  "@keyframes meteorFrameAnimation": {
    "0%": {
      backgroundPosition: "0 0",
    },
    "100%": {
      backgroundPosition: "-28800px 0",
    },
  },
}));

// Individual meteor element component
interface MeteorElementProps {
  meteor: MeteorState;
  containerHeight: number;
}

const MeteorElement: React.FC<MeteorElementProps> = ({
  meteor,
  containerHeight,
}) => {
  const [transform, setTransform] = useState(
    `translate(${meteor.size}px, -${meteor.size}px)`
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const distance =
        containerHeight - (meteor.startFromTop ? meteor.initialTop : 0);
      setTransform(`translate(-${distance}px, ${distance}px)`);
    }, 100);

    return () => clearTimeout(timer);
  }, [meteor, containerHeight]);

  return (
    <MeteorItem
      sx={{
        left: meteor.left,
        top: meteor.top,
        zIndex: meteor.zIndex,
        transform: transform,
        transition: `transform ${meteor.speed}s linear`,
      }}
    >
      <MeteorSprite size={meteor.size} />
    </MeteorItem>
  );
};

// Main MeteorShower component with props interface
export interface MeteorShowerProps {
  configs?: MeteorConfig[];
  interval?: number;
  enabled?: boolean;
  className?: string;
  sx?: any;
}

export const MeteorShower: React.FC<MeteorShowerProps> = ({
  configs = [
    { size: 600, speed: 5, maxCount: 2, count: 0, zIndex: 10 },
    { size: 300, speed: 10, maxCount: 3, count: 0, zIndex: 4 },
    { size: 150, speed: 15, maxCount: 5, count: 0, zIndex: 0 },
  ],
  interval = 500,
  enabled = true,
  className,
  sx,
}) => {
  const [meteors, setMeteors] = useState<MeteorState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const configsRef = useRef<MeteorConfig[]>(configs);

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  useEffect(() => {
    configsRef.current = configs;
  }, [configs]);

  useEffect(() => {
    if (!enabled) return;

    const createMeteor = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      const currentConfigs = configsRef.current;
      const index = getRandomInt(0, currentConfigs.length - 1);
      const config = currentConfigs[index];

      if (config.count < config.maxCount) {
        config.count++;

        const startFromTop = getRandomInt(0, 1) === 0;
        const top = getRandomInt(0, containerHeight);
        const left = getRandomInt(0, containerWidth);

        const newMeteor: MeteorState = {
          id: `meteor_${Date.now()}_${Math.random()}`,
          top: startFromTop ? top + 1000 : 0,
          left: startFromTop ? "100%" : `${left}px`,
          size: config.size,
          speed: config.speed,
          zIndex: config.zIndex * 10,
          startFromTop,
          initialTop: top,
          initialLeft: left,
        };

        setMeteors((prev) => [...prev, newMeteor]);

        setTimeout(() => {
          setMeteors((prev) => prev.filter((m) => m.id !== newMeteor.id));
          config.count--;
        }, config.speed * 1000);
      }
    };

    const intervalId = setInterval(createMeteor, interval);
    return () => clearInterval(intervalId);
  }, [enabled, interval]);

  if (!enabled) return null;

  return (
    <MeteorRoot ref={containerRef} className={className} sx={sx}>
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
// MeteorShower.Item = MeteorItem;
// MeteorShower.Sprite = MeteorSprite;

export default MeteorShower;
