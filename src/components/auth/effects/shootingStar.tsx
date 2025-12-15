// components/ui/shootingStar.tsx
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  infiniteRotate,
  shootingStar,
  tail,
  twinkle,
  twinkling,
} from "@/theme/keyframes";
import {
  ShootingStarData,
  ShootingStarProps,
  ShootingStarsProps,
} from "@/interfaces/component-props.interface";
import { generateStar } from "@/utils/themeUtils";

const PREFIX = "RazethShootingStar";

// Styled components
const ShootingStarRoot = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{
  path: string;
  duration: string;
  delay: string;
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
    delay,
    color,
    size,
    glow,
    centerPoint,
    halfHead,
    head,
    baseSize,
    twinkleDuration,
  }) => ({
    filter: `drop-shadow(0 0 7px ${color})`,
    animation: `${shootingStar} ${duration} linear infinite, ${tail} ${duration} linear infinite`,
    animationDelay: delay,
    offsetPath: path,
    height: size,
    background: `linear-gradient(-45deg, ${color}, rgba(0, 0, 255, 0))`,
    "--head-color": color,
    //   "--trail-path": path,
    //   "--glow-duration": duration,
    "& > span": {
      boxShadow: glow,
      right: `calc(${centerPoint} - ${halfHead})`,
      top: `calc(50% - ${halfHead})`,
      transform: `translateY(calc(-50% + ${halfHead}))`,
      height: head,
      width: head,
      /* Apply the animation directly to this element */
      animation: `${twinkle} ${twinkleDuration} linear alternate infinite, ${infiniteRotate} calc(${twinkleDuration} + 0.123s) linear infinite`,
    },
    // ✅ TAIL 1: Using ::before pseudo-element
    "::before": {
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      animation: `${twinkling(
        baseSize
      )} ${twinkleDuration} ease-in-out infinite`,
      // boxShadow: glow,
    },
    // ✅ TAIL 2: Using ::after pseudo-element
    "::after": {
      top: `calc(50% - ${centerPoint})`,
      right: `calc(0% + ${centerPoint})`,
      height: size,
      background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
      animation: `${twinkling(
        baseSize
      )} ${twinkleDuration} ease-in-out infinite`,
      // boxShadow: glow,
    },
  })
);

/**
 * A React component that renders a shooting star animation.
 * It takes a `ShootingStarProps` object as a prop, which contains
 * the following properties:
 * - `path`: The SVG path for the star.
 * - `duration`: The duration of the animation in seconds.
 * - `delay`: The delay of the animation in seconds.
 * - `color`: The color of the star.
 * - `size`: The size of the star.
 * - `glow`: The glow effect of the star.
 * - `centerPoint`: The center point of the star.
 * - `halfHead`: The half of the head of the star.
 * - `head`: The head of the star.
 * - `baseSize`: The base size of the star.
 * - `twinkleDuration`: The duration of the twinkling effect in seconds.
 * @param {ShootingStarProps} star - The props for the shooting star.
 * @returns {React.ReactElement} - The rendered shooting star animation.
 */
const ShootingStar: React.FC<ShootingStarProps> = ({ star }) => {
  return (
    <ShootingStarRoot
      path={star.path}
      duration={star.duration}
      delay={star.delay}
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
/**
 * A React component that renders a shooting star animation.
 * It takes a `ShootingStarsProps` object as a prop, which contains
 * the following properties:
 * - `count`: The number of shooting stars.
 * - `interval`: The interval between each shooting star in seconds.
 * - `curveFactor`: The curve factor of the shooting star path.
 * - `trajectoryMix`: An object containing the proportions of each type of trajectory.
 * - `colors`: An array of colors for the shooting stars.
 * - `glowIntensity`: The intensity of the glow effect of the shooting stars.
 * - `baseSpeed`: The base speed of the shooting stars in % per second.
 * - `baseSize`: The base size of the shooting stars.
 * - `enabled`: A boolean indicating whether the shooting stars are enabled or not.
 * - `className`: The class name for the container element.
 * - `sx`: The styles for the container element.
 * @param {ShootingStarsProps} props - The props for the shooting stars.
 * @returns {React.ReactElement} - The rendered shooting star animation.
 */
export const ShootingStars: React.FC<ShootingStarsProps> = ({
  count = 20,
  interval = 5,
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

  useEffect(() => {
    if (!enabled) return;

    // Generate initial stars
    const initialStars = Array.from({ length: count }, (_, i) =>
      generateStar(
        i,
        interval,
        curveFactor,
        trajectoryMix,
        colors,
        glowIntensity,
        baseSpeed,
        baseSize
      )
    );
    setStars(initialStars);

    // Handle window resize
    const handleResize = () => {
      setStars(
        Array.from({ length: count }, (_, i) =>
          generateStar(
            i,
            interval,
            curveFactor,
            trajectoryMix,
            colors,
            glowIntensity,
            baseSpeed,
            baseSize
          )
        )
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    enabled,
    count,
    interval,
    curveFactor,
    trajectoryMix,
    colors,
    glowIntensity,
    baseSpeed,
    baseSize,
  ]);

  if (!enabled) return null;

  return (
    <Box ref={containerRef} className={className} sx={sx}>
      {stars.map((star) => (
        <ShootingStar key={star.id} star={star} />
      ))}
    </Box>
  );
};

export default ShootingStars;
