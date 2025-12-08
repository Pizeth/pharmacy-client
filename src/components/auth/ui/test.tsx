import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// MUI Theme
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0a0a",
    },
  },
});

// Styled Components
const MeteorContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  height: "100%",
  width: "100%",
  backgroundImage:
    "url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/meteors-right/images/bg.jpg)",
  backgroundPosition: "100% 0",
  backgroundSize: "cover",
  pointerEvents: "none",
  overflow: "hidden",
  top: 0,
  left: 0,
}));

const MeteorItem = styled(Box)(({ theme }) => ({
  position: "absolute",
  willChange: "transform",
}));

const MeteorSprite = styled(Box, {
  shouldForwardProp: (prop: string) => prop !== "size",
})<{ size: number }>(({ size }) => ({
  width: `${size}px`,
  height: `${size}px`,
  backgroundImage:
    "url(https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/meteors-right/images/meteors-sprite.png)",
  backgroundSize: "auto 100%",
  animation: "frameAnimation 3s steps(48) infinite",
  transform: "rotate(45deg)",
  "@keyframes frameAnimation": {
    "0%": {
      backgroundPosition: "0 0",
    },
    "100%": {
      backgroundPosition: "-28800px 0",
    },
  },
}));

// Meteor configuration type
interface MeteorConfig {
  size: number;
  speed: number;
  maxCount: number;
  count: number;
  zIndex: number;
}

interface MeteorState {
  id: string;
  top: number;
  left: number | string;
  size: number;
  speed: number;
  zIndex: number;
  startFromTop: boolean;
  initialTop: number;
  initialLeft: number;
}

// Slot Components
const MeteorBackground = ({ children, ...props }) => (
  <MeteorContainer {...props}>{children}</MeteorContainer>
);

const MeteorElement = ({ meteor, containerHeight }) => {
  const [transform, setTransform] = useState(
    `translate(${meteor.size}px, -${meteor.size}px)`
  );

  useEffect(() => {
    // Trigger animation after mount
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

// Main Component
const MeteorShower = () => {
  const [meteors, setMeteors] = useState<MeteorState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const meteorConfigsRef = useRef<MeteorConfig[]>([
    { size: 600, speed: 5, maxCount: 2, count: 0, zIndex: 10 },
    { size: 300, speed: 10, maxCount: 3, count: 0, zIndex: 4 },
    { size: 150, speed: 15, maxCount: 5, count: 0, zIndex: 0 },
  ]);

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  useEffect(() => {
    const createMeteor = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      const configs = meteorConfigsRef.current;
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

    const interval = setInterval(createMeteor, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <MeteorBackground>
        {meteors.map((meteor) => (
          <MeteorElement
            key={meteor.id}
            meteor={meteor}
            containerHeight={containerRef.current?.offsetHeight || 0}
          />
        ))}
      </MeteorBackground>
    </Box>
  );
};

// App Component with Theme Provider
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <MeteorShower />
      </Box>
    </ThemeProvider>
  );
}
