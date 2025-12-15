// components/ui/twinkleStar.tsx
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { twinkle, twinkling } from "@/theme/keyframes";
import {
  TwinkleStarData,
  TwinkleStarProps,
  TwinkleStarsProps,
} from "@/interfaces/component-props.interface";
import { generatTwinkleStar } from "@/utils/themeUtils";

const PREFIX = "RazethTwinkleStar";

// Styled components
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
}>(({ top, left, size, glow, delay, centerPoint, color, baseSize }) => ({
  position: "absolute",
  left,
  top,
  width: size,
  height: size,
  boxShadow: glow,
  animation: `${twinkle} ${delay} linear alternate infinite`,

  // ✅ RAY 1: Using ::before pseudo-element (45° rotation)
  "::before": {
    top: `calc(50% - ${centerPoint})`,
    right: `calc(0% + ${centerPoint})`,
    height: size,
    background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
    animation: `${twinkling(baseSize)} ${delay} ease-in-out infinite`,
  },

  // ✅ RAY 2: Using ::after pseudo-element (-45° rotation)
  "::after": {
    top: `calc(50% - ${centerPoint})`,
    right: `calc(0% + ${centerPoint})`,
    height: size,
    background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
    animation: `${twinkling(baseSize)} ${delay} ease-in-out infinite`,
  },
}));

// const TwinkleStarRay = styled(Box)<{
//   centerPoint: string;
//   size: string;
//   color: string;
//   baseSize: number;
//   delay: string;
//   rotation: number;
// }>(({ centerPoint, size, color, baseSize, delay, rotation }) => ({
//   content: '""',
//   position: "absolute",
//   top: `calc(50% - ${centerPoint})`,
//   right: `calc(0% + ${centerPoint})`,
//   height: size,
//   background: `linear-gradient(-45deg, rgba(0, 0, 255, 0), ${color}, rgba(0, 0, 255, 0))`,
//   borderRadius: "100%",
//   transform: `translateX(50%) rotateZ(${rotation}deg)`,
//   animation: `${twinkling(baseSize)} ${delay} ease-in-out infinite`,
// }));

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
    />
  );
};

// Main container component

export const TwinkleStars: React.FC<TwinkleStarsProps> = ({
  count = 15,
  colors = ["#fff", "#9b40fc", "#00f", "#ff3300ff"],
  baseSize = 1,
  enabled = true,
  className,
  sx,
}) => {
  const [stars, setStars] = useState<TwinkleStarData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    // Generate initial stars
    const initialStars = Array.from({ length: count }, (_, i) =>
      generatTwinkleStar(i, colors, baseSize)
    );
    setStars(initialStars);

    // Handle window resize
    const handleResize = () => {
      setStars(
        Array.from({ length: count }, (_, i) =>
          generatTwinkleStar(i, colors, baseSize)
        )
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [enabled, count, colors, baseSize]);

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
