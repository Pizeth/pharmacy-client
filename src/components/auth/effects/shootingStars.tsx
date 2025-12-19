// components/ui/shootingStar.tsx
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import {
  ShootingStarData,
  ShootingStarsProps,
} from "@/interfaces/component-props.interface";
import { generateStar } from "@/utils/themeUtils";
import ShootingStar from "@/theme/components/shootingStar";

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
  // count = 20,
  // interval = 5,
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

  // useEffect(() => {
  //   if (!enabled) return;

  //   // Generate initial stars
  //   const initialStars = Array.from({ length: count }, (_, i) =>
  //     generateStar(
  //       curveFactor,
  //       trajectoryMix,
  //       colors,
  //       glowIntensity,
  //       baseSpeed,
  //       baseSize
  //     )
  //   );
  //   setStars(initialStars);

  //   // Handle window resize
  //   const handleResize = () => {
  //     setStars(
  //       Array.from({ length: count }, (_, i) =>
  //         generateStar(
  //           curveFactor,
  //           trajectoryMix,
  //           colors,
  //           glowIntensity,
  //           baseSpeed,
  //           baseSize
  //         )
  //       )
  //     );
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [
  //   enabled,
  //   count,
  //   interval,
  //   curveFactor,
  //   trajectoryMix,
  //   colors,
  //   glowIntensity,
  //   baseSpeed,
  //   baseSize,
  // ]);

  useEffect(() => {
    if (!enabled) return;

    const spawnStar = () => {
      if (activeCountRef.current >= maxCount) return;

      activeCountRef.current++;
      const newStar = generateStar(
        curveFactor,
        trajectoryMix,
        colors,
        glowIntensity,
        baseSpeed,
        baseSize
      );
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
    <Box ref={containerRef} className={className} sx={sx}>
      {stars.map((star) => (
        <ShootingStar key={star.id} star={star} />
      ))}
    </Box>
  );
};

export default ShootingStars;
