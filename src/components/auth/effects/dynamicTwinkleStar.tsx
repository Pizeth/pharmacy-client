// components/ui/twinkleStar.tsx - DYNAMIC SPAWNING VERSION
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { keyframes } from "@mui/system";

const PREFIX = "RazethTwinkleStar";

// Keyframes
const twinkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0);
  }
`;

const twinkling = (baseSize: number) => keyframes`
  0% {
    width: ${baseSize * 0.5}vh;
  }
  50% {
    width: ${baseSize * 1.5}vh;
  }
  100% {
    width: ${baseSize * 0.5}vh;
  }
`;

// Styled component - OPTIMIZED with pseudo-elements
const TwinkleStarRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{
  top: string;
  left: string;
  size: string;
  glow: string;
  delay: string;
  centerPoint: string;
  color: string;
  baseSize: number;
  isFadingOut: boolean;
}>(
  ({
    top,
    left,
    size,
    glow,
    delay,
    centerPoint,
    color,
    baseSize,
    isFadingOut,
  }) => ({
    position: "absolute",
    left,
    top,
    width: size,
    height: size,
    borderRadius: "50%",
    boxShadow: glow,
    animation: isFadingOut
      ? `${fadeOut} 0.8s ease-out forwards`
      : `${fadeIn} 0.5s ease-out, ${twinkle} ${delay} linear alternate infinite 0.5s`,
    pointerEvents: "none",
    background: "#FFF",
    zIndex: 3,
    willChange: "transform, opacity",

    // Ray 1: Using ::before pseudo-element (45° rotation)
    "::before": {
      content: '""',
      position: "absolute",
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      borderRadius: "100%",
      transform: "translateX(50%) rotateZ(45deg)",
      animation: `${twinkling(baseSize)} ${delay} ease-in-out infinite`,
      willChange: "width, transform",
    },

    // Ray 2: Using ::after pseudo-element (-45° rotation)
    "::after": {
      content: '""',
      position: "absolute",
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      borderRadius: "100%",
      transform: "translateX(50%) rotateZ(-45deg)",
      animation: `${twinkling(baseSize)} ${delay} ease-in-out infinite`,
      willChange: "width, transform",
    },
  })
);

interface TwinkleStarData {
  id: string;
  top: string;
  left: string;
  size: string;
  centerPoint: string;
  baseSize: number;
  delay: string;
  color: string;
  glow: string;
  lifetime: number;
  isFadingOut: boolean;
}

interface TwinkleStarProps {
  star: TwinkleStarData;
}

const TwinkleStar: React.FC<TwinkleStarProps> = ({ star }) => {
  return (
    <TwinkleStarRoot
      top={star.top}
      left={star.left}
      size={star.size}
      glow={star.glow}
      delay={star.delay}
      centerPoint={star.centerPoint}
      color={star.color}
      baseSize={star.baseSize}
      isFadingOut={star.isFadingOut}
    />
  );
};

// Main container component
export interface TwinkleStarsProps {
  maxCount?: number;
  spawnInterval?: number;
  minLifetime?: number;
  maxLifetime?: number;
  colors?: string[];
  baseSize?: number;
  enabled?: boolean;
  className?: string;
  sx?: any;
}

export const TwinkleStars: React.FC<TwinkleStarsProps> = ({
  maxCount = 8,
  spawnInterval = 3000,
  minLifetime = 8000,
  maxLifetime = 15000,
  colors = ["#fff", "#9b40fc", "#00f", "#ff3300ff"],
  baseSize = 1,
  enabled = true,
  className,
  sx,
}) => {
  const [stars, setStars] = useState<TwinkleStarData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCountRef = useRef(0);

  const generateStar = (): TwinkleStarData => {
    const x = (Math.random() * 100).toFixed(2);
    const y = (Math.random() * 100).toFixed(2);
    const size = Math.max(Math.random() * baseSize, 0.125).toFixed(2);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = `${(Math.random() * 2 + 1.5).toFixed(2)}s`;
    const centerPoint = Number(size) / 2;
    const blurRay = Number(size) * 3.5;
    const lifetime = Math.random() * (maxLifetime - minLifetime) + minLifetime;

    const glow = `
      0 0 0 var(--core) ${color}25,
      0 calc(var(--ray) * -1) ${blurRay}vh 0 ${color},
      0 var(--ray) ${blurRay}vh 0 ${color},
      calc(var(--ray) * -1) 0 ${blurRay}vh 0 ${color},
      var(--ray) 0 ${blurRay}vh 0 ${color},
      calc(var(--ray) * -0.707) calc(var(--ray) * -0.707) ${blurRay}vh 0 ${color},
      calc(var(--ray) * 0.707) calc(var(--ray) * -0.707) ${blurRay}vh 0 ${color},
      calc(var(--ray) * -0.707) calc(var(--ray) * 0.707) ${blurRay}vh 0 ${color},
      calc(var(--ray) * 0.707) calc(var(--ray) * 0.707) ${blurRay}vh 0 ${color},
      0 0 var(--halo) 0 ${color}
    `;

    return {
      id: `twinkle-star-${Date.now()}-${Math.random()}`,
      top: `${y}vh`,
      left: `${x}vw`,
      size: `${size}vh`,
      centerPoint: `${centerPoint}vh`,
      baseSize: Number(size) * 0.85,
      delay,
      color,
      glow,
      lifetime,
      isFadingOut: false,
    };
  };

  useEffect(() => {
    if (!enabled) return;

    const spawnStar = () => {
      if (activeCountRef.current >= maxCount) return;

      activeCountRef.current++;
      const newStar = generateStar();
      setStars((prev) => [...prev, newStar]);

      // Start fade out before removing
      const fadeOutTimer = setTimeout(() => {
        setStars((prev) =>
          prev.map((s) =>
            s.id === newStar.id ? { ...s, isFadingOut: true } : s
          )
        );
      }, newStar.lifetime);

      // Remove star after fade out animation (800ms)
      const removeTimer = setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
        activeCountRef.current--;
      }, newStar.lifetime + 800);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(removeTimer);
      };
    };

    // Spawn stars at intervals
    const intervalId = setInterval(spawnStar, spawnInterval);

    // Spawn first star immediately
    spawnStar();

    return () => {
      clearInterval(intervalId);
      activeCountRef.current = 0;
    };
  }, [
    enabled,
    maxCount,
    spawnInterval,
    minLifetime,
    maxLifetime,
    colors,
    baseSize,
  ]);

  // Handle window resize
  useEffect(() => {
    if (!enabled) return;

    const handleResize = () => {
      // Clear existing stars and reset on resize
      setStars([]);
      activeCountRef.current = 0;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 3,
        willChange: "contents",
        ...sx,
      }}
    >
      {stars.map((star) => (
        <TwinkleStar key={star.id} star={star} />
      ))}
    </Box>
  );
};

export default TwinkleStars;
