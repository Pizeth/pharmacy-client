// components/ui/shootingStar.tsx - DYNAMIC SPAWNING VERSION
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { keyframes } from "@mui/system";

const PREFIX = "RazethShootingStar";

// Keyframes for shooting star animation
const shootingStar = keyframes`
  0% {
    offset-distance: 0%;
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 0;
  }
`;

const tail = keyframes`
  0% {
    width: 0;
  }
  30% {
    width: 100px;
  }
  100% {
    width: 0;
  }
`;

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

const infiniteRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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

// Styled components - OPTIMIZED with pseudo-elements
const ShootingStarRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{
  path: string;
  duration: string;
  color: string;
  size: string;
  glow: string;
  centerPoint: string;
  halfHead: string;
  head: string;
  baseSize: number;
  twinkleDuration: string;
}>(
  ({
    path,
    duration,
    color,
    size,
    glow,
    centerPoint,
    halfHead,
    head,
    baseSize,
    twinkleDuration,
  }) => ({
    position: "absolute",
    filter: `drop-shadow(0 0 7px ${color})`,
    animation: `${shootingStar} ${duration} linear forwards, ${tail} ${duration} linear forwards`,
    animationFillMode: "forwards",
    willChange: "transform, opacity",
    offsetRotate: "auto",
    offsetAnchor: "right center",
    offsetDistance: "0%",
    offsetPath: path,
    height: size,
    borderRadius: "500% 100% 100% 500%",
    background: `linear-gradient(-45deg, ${color}, rgba(0, 0, 255, 0))`,
    "--head-color": color,
    "--trail-path": path,
    "--glow-duration": duration,

    // Head element (nested span)
    "& > span": {
      position: "absolute",
      zIndex: 3,
      boxShadow: glow,
      right: `calc(${centerPoint} - ${halfHead})`,
      top: `calc(50% - ${halfHead})`,
      transform: `translateY(calc(-50% + ${halfHead}))`,
      height: head,
      width: head,
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        'url("/static/images/moon_in_comic_style.svg") no-repeat center center',
      backgroundSize: "cover",
      animation: `${twinkle} ${twinkleDuration} linear alternate infinite, ${infiniteRotate} calc(${twinkleDuration} + 0.123s) linear infinite`,
      willChange: "transform, opacity",
    },

    // Tail 1: Using ::before pseudo-element
    "::before": {
      content: '""',
      position: "absolute",
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      borderRadius: "100%",
      transform: "translateX(50%) rotateZ(45deg)",
      animation: `${twinkling(
        baseSize
      )} ${twinkleDuration} ease-in-out infinite`,
      animationFillMode: "backwards",
      willChange: "width, transform",
    },

    // Tail 2: Using ::after pseudo-element
    "::after": {
      content: '""',
      position: "absolute",
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      borderRadius: "100%",
      transform: "translateX(50%) rotateZ(-45deg)",
      animation: `${twinkling(
        baseSize
      )} ${twinkleDuration} ease-in-out infinite`,
      animationFillMode: "backwards",
      willChange: "width, transform",
    },
  })
);

interface ShootingStarData {
  id: string;
  size: string;
  centerPoint: string;
  head: string;
  halfHead: string;
  baseSize: number;
  duration: string;
  twinkleDuration: string;
  path: string;
  color: string;
  glow: string;
}

interface ShootingStarProps {
  star: ShootingStarData;
}

const ShootingStar: React.FC<ShootingStarProps> = ({ star }) => {
  return (
    <ShootingStarRoot
      path={star.path}
      duration={star.duration}
      color={star.color}
      size={star.size}
      glow={star.glow}
      centerPoint={star.centerPoint}
      halfHead={star.halfHead}
      head={star.head}
      baseSize={star.baseSize}
      twinkleDuration={star.twinkleDuration}
    >
      <span />
    </ShootingStarRoot>
  );
};

// Main container component
export interface ShootingStarsProps {
  maxCount?: number;
  spawnInterval?: number;
  curveFactor?: number;
  trajectoryMix?: { straight: number; shallow: number; deep: number };
  colors?: string[];
  glowIntensity?: number;
  baseSpeed?: number;
  baseSize?: number;
  enabled?: boolean;
  className?: string;
  sx?: any;
}

function pickStyle(mix: { straight: number; shallow: number; deep: number }) {
  const r = Math.random();
  if (r < mix.straight) return "straight";
  if (r < mix.straight + mix.shallow) return "shallow";
  return "deep";
}

function pathLength(
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
) {
  const steps = 20;
  let length = 0;
  let prevX = x1,
    prevY = y1;
  for (let t = 1; t <= steps; t++) {
    const u = t / steps;
    const x = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx + u * u * x2;
    const y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy + u * u * y2;
    length += Math.hypot(x - prevX, y - prevY);
    prevX = x;
    prevY = y;
  }
  return length;
}

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  maxCount = 3,
  spawnInterval = 2000,
  curveFactor = 50,
  trajectoryMix = { straight: 0.2, shallow: 0.3, deep: 0.5 },
  colors = ["#fff", "#9b40fc", "#00f", "#ff3300ff"],
  glowIntensity = 1,
  baseSpeed = 20,
  baseSize = 1,
  enabled = true,
  className,
  sx,
}) => {
  const [stars, setStars] = useState<ShootingStarData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCountRef = useRef(0);

  const generateStar = (): ShootingStarData => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const starDirection = Math.random() < 0.5 ? "left" : "right";
    const startX =
      starDirection === "left"
        ? width / 2 + (Math.random() * width) / 2
        : width / 2 - (Math.random() * width) / 2;
    const startY = Math.random() * height;
    const endX = starDirection === "left" ? -100 : width + 100;
    const endY = Math.random() * height;

    const style = pickStyle(trajectoryMix);
    let len: number;
    let path: string;

    if (style === "straight") {
      path = `path("M ${startX} ${startY} L ${endX} ${endY}")`;
      len = Math.hypot(endX - startX, endY - startY);
    } else {
      const controlX = Math.random() * (curveFactor / 100) * width;
      const controlY =
        style === "shallow"
          ? Math.random() * (curveFactor / 200) * height
          : Math.random() * (curveFactor / 50) * height;
      path = `path("M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}")`;
      len = pathLength(startX, startY, controlX, controlY, endX, endY);
    }

    const duration = `${(len / (len * baseSpeed)).toFixed(2)}s`;
    const size = Math.max(Math.random() * baseSize, 0.125).toFixed(2);
    const centerPoint = Number(size) / 2;
    const head = Number(size) * 1.5;
    const blurRay = Number(size) * 3.5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    const glow = `
      0 0 0 calc(var(--core) * 1.25) ${color}80,
      0 calc(var(--ray) * -1) ${blurRay}vh 0 ${color}40,
      0 var(--ray) ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * -1) 0 ${blurRay}vh 0 ${color}40,
      var(--ray) 0 ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * -0.707) calc(var(--ray) * -0.707) ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * 0.707) calc(var(--ray) * -0.707) ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * -0.707) calc(var(--ray) * 0.707) ${blurRay}vh 0 ${color}40,
      calc(var(--ray) * 0.707) calc(var(--ray) * 0.707) ${blurRay}vh 0 ${color}40,
      0 0 var(--halo) 0 ${color}
    `;

    return {
      id: `shooting-star-${Date.now()}-${Math.random()}`,
      size: `${size}vh`,
      centerPoint: `${centerPoint}vh`,
      head: `${head}vh`,
      halfHead: `${head / 2}vh`,
      baseSize: Number(size) * 0.85,
      duration,
      twinkleDuration: `${(len / (len * baseSpeed) / 5).toFixed(2)}s`,
      path,
      color,
      glow,
    };
  };

  useEffect(() => {
    if (!enabled) return;

    const spawnStar = () => {
      if (activeCountRef.current >= maxCount) return;

      activeCountRef.current++;
      const newStar = generateStar();
      setStars((prev) => [...prev, newStar]);

      // Remove star after animation completes
      const durationMs = parseFloat(newStar.duration) * 1000;
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
        activeCountRef.current--;
      }, durationMs);
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
    curveFactor,
    trajectoryMix,
    colors,
    glowIntensity,
    baseSpeed,
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
        zIndex: 0,
        willChange: "contents",
        ...sx,
      }}
    >
      {stars.map((star) => (
        <ShootingStar key={star.id} star={star} />
      ))}
    </Box>
  );
};

export default ShootingStars;
