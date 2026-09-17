// src/interfaces/theme.interface.ts

import {
  AvatarProps,
  DividerProps,
  LoginProps,
  SideImageProps,
  AuthNavigationProps,
  FooterProps,
  SocialLoginProps,
  SocialButtonProps,
  MeteorShowerProps,
} from "./auth.interface";
import {
  AuthFormProps,
  DrawerToggleProps,
  IconInputProps,
  LoginFormProps,
  PasswordFieldProps,
  SelectFieldProps,
  ShootingStarProps,
  TwinkleStarProps,
  TVProps,
  ValidatedButtonProps,
} from "./component-props.interface";
import type { DataTableComponentsPropsList } from "@/components/DataTable/mui/theme";
import type { FormDialogProps } from "@/components/forms/FormDialog";
import type { ResourcePageProps } from "@/components/layouts/ResourcePage";
import type { ResourceActionButtonProps } from "@/components/buttons/ResourceActionButton";

// This interface maps each component's name to its specific props interface.
// To add a new component, you only need to add a new line here.
/**
 * ------------------------------------------------------------------
 * Application MUI component-prop registry
 * ------------------------------------------------------------------
 *
 * Every named custom MUI component that appears under:
 *
 *   theme.components
 *
 * must be represented here unless it has a dedicated augmentation
 * contract of its own.
 *
 * RazethDataTable itself is intentionally NOT listed here.
 *
 * It has a dedicated contract in:
 *
 *   src/theme.d.ts
 *
 * because its defaultProps and variant/ownerState contracts are
 * intentionally different.
 */
export interface RazethComponentsPropsList extends DataTableComponentsPropsList {
  RazethAuthForm: Partial<AuthFormProps>;
  RazethLogin: Partial<LoginProps>;
  RazethSideImage: Partial<SideImageProps>;
  RazethAvatar: Partial<AvatarProps>;
  RazethLoginForm: Partial<LoginFormProps>;
  RazethDivider: Partial<DividerProps>;
  RazethSocialLogin: Partial<SocialLoginProps>;
  RazethSocialButton: Partial<SocialButtonProps>;
  RazethAuthNavigation: Partial<AuthNavigationProps>;
  RazethFooter: Partial<FooterProps>;
  RazethTV: Partial<TVProps>;
  RazethNavToggle: Partial<DrawerToggleProps>;
  RazethValidatedButton: Partial<ValidatedButtonProps>;

  /**
   * Existing visual-effect theme components.
   *
   * These names already appear in:
   *
   *   src/theme/razeth.ts
   *   src/theme/razeth-old.ts
   *
   * but were missing from the central registry.
   */
  RazethShootingStar: Partial<ShootingStarProps>;
  RazethTwinkleStar: Partial<TwinkleStarProps>;
  RazethMeteor: Partial<MeteorShowerProps>;

  RazethTextField: Partial<IconInputProps>;

  RazethPasswordField: Partial<PasswordFieldProps>;

  RazethSelectField: Partial<SelectFieldProps>;

  RazethFormDialog: Partial<FormDialogProps>;

  RazethResourcePage: Partial<ResourcePageProps>;

  RazethResourceActionButton: Partial<ResourceActionButtonProps>;

  /**
   * Resource surfaces use no special public default props,
   * but remain named MUI theme families.
   */
  RazethTranslationKeyForm: Record<string, never>;

  RazethTranslationKeyTable: Record<string, never>;
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
