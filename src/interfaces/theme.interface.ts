import {
  AvatarProps,
  DividerProps,
  LoginProps,
  SideImageProps,
  SignUpProps,
  FooterProps,
  LoginFormProps,
  SocialLoginProps,
  SocialButtonProps,
} from "./auth.interface";

// This interface maps each component's name to its specific props interface.
// To add a new component, you only need to add a new line here.
export interface RazethComponentsPropsList {
  RazethLogin: Partial<LoginProps>;
  RazethSideImage: Partial<SideImageProps>;
  RazethAvatar: Partial<AvatarProps>;
  RazethLoginForm: Partial<LoginFormProps>;
  RazethDivider: Partial<DividerProps>;
  RazethSocialLogin: Partial<SocialLoginProps>;
  RazethSocialButton: Partial<SocialButtonProps>;
  RazethSignUpLink: Partial<SignUpProps>;
  RazethFooter: Partial<FooterProps>;
}

export interface SideImage {
  circleSize: string;
  circleColor: string;
  logoOffset: string;
  logoSize: string;
  circleStopCount: number; // number of fading rings
  // circleSoftStop: string; // % where solid color ends
  // circleSoftFade: string; // % where it fully fades
  circlePulseMin: number; // lower bound of softness
  circlePulseMax: number; // upper bound of softness
  circlePulseSequence: number[]; // sequence of softness values for animation
  circlePulseDuration: string; // animation speed
  maxOpacity: number; // maximum opacity of the radial gradient
  logoCaption: string;
  captionOutlineColor: string;
  captionGlowColor: string;
  // captionFontSize: number | string;
  // 👇 responsive font sizes
  captionFontSize: responsive;
  captionShadowStrength: number | string;
  // captionOffset: string;
  captionOffset: responsive;
  animationBackground: {
    backgroundImage: string;
    backgroundSize: string;
  };
  shootingStarMaxCount: number;
  shootingStarSpawnInterval: number;
  twinkleStarMaxCount: number;
  twinkleStarSpawnInterval: number;
  twinkleStarMinLifetime: number;
  twinkleStarMaxLifetime: number;
  // shootingClass: string;
  // twinkleClass: string;
  starSize: number;
  starColors: string[];
  glowIntensity: number;
  baseSpeed: number;
  minAngle: number;
  maxAngle: number;
  curveFactor: number;
  trajectoryMix: {
    straight: number;
    shallow: number;
    deep: number;
  };
}

export interface Line {
  color: string;
  delay: string;
}

export interface Meteor {
  enabled: boolean;
  interval: number;
  configs: MeteorConfig[];
}

interface responsive {
  xs: string;
  sm: string;
  md: string;
}

// Meteor configuration interface
export interface MeteorConfig {
  size: string | number;
  speed: number;
  maxCount: number;
  count: number;
  zIndex: number;
}

export interface MeteorState {
  id: string;
  top: string | number;
  left: string | number;
  size: string | number;
  speed: number;
  zIndex: number;
  startFromTop: boolean;
  initialTop: number;
  initialLeft: number;
}
