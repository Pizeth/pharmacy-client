import { StyleComponent } from "@/types/classKey";
import { SxProps, Theme } from "@mui/material";
import { Property } from "csstype";
import { SignUpParams } from "./auth.interface";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { SaveHandler } from "ra-core";
import { SaveButtonProps } from "react-admin";
import { AuthAction } from "@/types/theme";
import { Circle } from "lucide-react";

export interface LoginFormProps {
  content?: StyleComponent;
  password?: StyleComponent;
  footer?: StyleComponent;
  formButton?: StyleComponent;
  redirectTo?: string;
  className?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  forgotPassword?: string;
  forgotPasswordUrl?: string;
}

export interface SignUpFormProps extends LoginFormProps {
  // onSubmit?: (data: SignUpParams) => void | Promise<void>;
  // onSubmit?: SubmitHandler<FieldValues> | SaveHandler<SignUpParams>;
  // redirectTo?: string;
  // className?: string;
  // sx?: SxProps<Theme>;
  // children?: React.ReactNode;
  termsUrl?: string;
  privacyUrl?: string;
}

export interface ValidatedButtonProps extends SaveButtonProps {
  loading: boolean;
  authType?: AuthAction;
  className?: string;
  sx?: any;
}

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

interface BasicSVGProps {
  id: string;
  width?: number | string;
  height?: number | string;
  x?: number | string;
  y?: number | string;
  cx?: number | string;
  cy?: number | string;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface PatternProps extends BasicSVGProps {
  patternUnits?: string;
  attributeName?: string;
  from?: string | number;
  to?: string | number;
  duration?: string | number;
  repeatCount?: string | number;
  href?: string;
}

export interface CircleMaskProps extends BasicSVGProps {
  pattern: string;
  filterId?: string;
  fill?: string;
  r?: number | string;
}

export interface FilterProps extends BasicSVGProps {
  stdDeviation?: string | number;
  result?: string;
  inValue?: string;
  in2?: string | number;
  scale?: string | number;
}
