import { SxProps, Theme } from "@mui/material";
import { Property } from "csstype";

export interface ShootingStarData {
  id: string;
  size: string;
  centerPoint: string;
  head: string;
  halfHead: string;
  baseSize: number;
  // delay: string;
  duration: string;
  twinkleDuration: string;
  path: string;
  color: string;
  glow: string;
}

export interface ShootingStarProps {
  star: ShootingStarData;
}

export interface ShootingStarsProps {
  count?: number;
  interval?: number;
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
  sx?: SxProps<Theme>;
}

export interface TwinkleStarData {
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

export interface TwinkleStarProps {
  star: TwinkleStarData;
}

export interface TwinkleStarsProps {
  count?: number;
  maxCount?: number;
  spawnInterval?: number;
  minLifetime?: number;
  maxLifetime?: number;
  colors?: string[];
  baseSize?: number;
  enabled?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface RocketProps {
  orbitRadius?: number;
  orbitSpeed?: number;
  rocketScale?: number;
  autoRotate?: boolean;
  position?: Property.Position | undefined;
  size?: string | number;
  transform?: string;
  className?: string;
  sx?: SxProps<Theme>;
}
