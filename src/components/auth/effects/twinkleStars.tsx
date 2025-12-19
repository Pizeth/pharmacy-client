// components/ui/twinkleStar.tsx
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import {
  TwinkleStarData,
  TwinkleStarsProps,
} from "@/interfaces/component-props.interface";
import { generatTwinkleStar } from "@/utils/themeUtils";
import TwinkleStar from "@/theme/components/twinkleStar";

// Main container component
export const TwinkleStars: React.FC<TwinkleStarsProps> = ({
  // count = 15,
  maxCount = 10,
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

  // useEffect(() => {
  //   if (!enabled) return;

  //   // Generate initial stars
  //   const initialStars = Array.from({ length: count }, (_, i) =>
  //     generatTwinkleStar(i, colors, baseSize)
  //   );
  //   setStars(initialStars);

  //   // Handle window resize
  //   const handleResize = () => {
  //     setStars(
  //       Array.from({ length: count }, (_, i) =>
  //         generatTwinkleStar(i, colors, baseSize)
  //       )
  //     );
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, [enabled, count, colors, baseSize]);

  useEffect(() => {
    if (!enabled) return;

    const spawnStar = () => {
      if (activeCountRef.current >= maxCount) return;

      activeCountRef.current++;
      const newStar = generatTwinkleStar(
        colors,
        baseSize,
        minLifetime,
        maxLifetime
      );
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
    <Box ref={containerRef} className={className} sx={sx}>
      {stars.map((star) => (
        <TwinkleStar key={star.id} star={star} />
      ))}
    </Box>
  );
};

export default TwinkleStars;
