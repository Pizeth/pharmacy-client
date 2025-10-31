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
  circleStopCount: number; // number of fading rings
  // circleSoftStop: string; // % where solid color ends
  // circleSoftFade: string; // % where it fully fades
  circlePulseMin: number; // lower bound of softness
  circlePulseMax: number; // upper bound of softness
  circlePulseSequence: number[]; // sequence of softness values for animation
  circlePulseDuration: string; // animation speed
  maxOpacity: number; // maximum opacity of the radial gradient
}

export interface line {
  color: string;
  delay: string;
}
