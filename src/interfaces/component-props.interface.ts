import { StyleComponent } from "@/types/classKey";
import {
  AvatarOwnProps,
  ButtonProps,
  ChipPropsColorOverrides,
  ChipPropsSizeOverrides,
  ChipPropsVariantOverrides,
  PopoverVirtualElement,
  PopperPlacementType,
  SvgIconPropsSizeOverrides,
  SxProps,
  TextFieldProps,
  Theme,
} from "@mui/material";
import { Property } from "csstype";
import { SignUpParams } from "./auth.interface";
import {
  ControllerFieldState,
  ControllerRenderProps,
  ErrorOption,
  FieldValues,
  SubmitHandler,
  UseControllerProps,
  UseControllerReturn,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";
import { SaveHandler } from "ra-core";
import { SaveButtonProps } from "react-admin";
// import { AsyncRuleType, AuthAction } from "@/types";
import { Circle } from "lucide-react";
import { HtmlHTMLAttributes, ReactNode, Ref, RefObject } from "react";
import { VirtualElement } from "@popperjs/core/lib/types";
// import { IParticlesProps } from "@tsparticles/react/dist/IParticlesProps";
import { IParticlesProps } from "@tsparticles/react";
import { OverridableStringUnion } from "@mui/types";
import { AsyncRuleType, AuthAction } from "@/types/auth";
import { Engine } from "@tsparticles/engine";

export interface AuthProps extends HtmlHTMLAttributes<HTMLDivElement> {
  // content?: ReactNode;
  card?: ReactNode;
  // Avatar: MUIStyledCommonProps<Theme>;
  effect?: ReactNode;
  avatarIcon?: ReactNode;
  backgroundImage?: string;
  image?: ReactNode;
  sideImage?: ReactNode;
  children?: ReactNode;
  divider?: ReactNode;
  social?: ReactNode;
  authNavigationLinks?: ReactNode;
  // enableTabs?: boolean; // New prop to enable tab mode
  // defaultTab?: "login" | "signup"; // New prop to set default tab
  enableToggle?: boolean; // Enable link-based toggle
  defaultMode?: AuthAction;
  // onSignUp?: (data: any) => void | Promise<void>;
  footer?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  variant?: "compact" | "full";
  src?: string;
  alt?: string;
  heading?: string;
}

export interface AuthFormProps extends HtmlHTMLAttributes<HTMLFormElement> {
  mode?: AuthAction;
  content?: StyleComponent;
  password?: StyleComponent;
  footer?: StyleComponent;
  formButton?: StyleComponent;
  redirectTo?: string;
  className?: string;
  sx?: SxProps<Theme>;
  children?: ReactNode;
  forgotPassword?: string;
  forgotPasswordUrl?: string;
  termsUrl?: string;
  privacyUrl?: string;
}

export interface LoginFormProps {
  content?: StyleComponent;
  password?: StyleComponent;
  footer?: StyleComponent;
  formButton?: StyleComponent;
  redirectTo?: string;
  className?: string;
  sx?: SxProps<Theme>;
  children?: ReactNode;
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

export interface DrawerToggleProps extends HtmlHTMLAttributes<HTMLDivElement> {
  wrapper?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  src?: string;
  circleSize?: string; // e.g. "33%", "200px"
  circleColor?: string; // e.g. "#1e40af", "red", "var(--mui-palette-primary-main)"
  logoOffset?: string; // e.g. "2%", "8px"
  className?: string;
  sx?: SxProps<Theme>;
}

// export interface ValidatedButtonProps extends SaveButtonProps {
//   loading?: boolean;
//   authType?: AuthAction;
//   className?: string;
//   sx?: any;
// }

export interface ValidatedButtonProps extends Omit<ButtonProps, "loading"> {
  /** Whether the form submission is in-flight */
  loading?: boolean;
  /** Controls label and icon: "signin" → Sign In, "signup" → Sign Up */
  authType?: AuthAction;
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

export interface ColumnAvatarProps extends Omit<AvatarOwnProps, "children"> {
  children?: string;
  icon?: React.ReactNode;
}

export interface TVProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  sx?: SxProps<Theme>;
}

export interface PoperResultProps extends HtmlHTMLAttributes<HTMLDivElement> {
  open: boolean;
  // reference: RefObject<HTMLDivElement | null>;
  placement?: PopperPlacementType;
  anchorEl:
    | null
    | VirtualElement
    | HTMLElement
    | (() => HTMLElement)
    | (() => VirtualElement);
  width?: number | string | undefined;
  results: any;
  error: string | null;
  activeIndex: number;
  // onClose: () => void;
  onSelect?: (product: any) => void;
  setValue: (value: string) => void;
  setOpen: (open: boolean) => void;
}

export interface UserMenuProps {
  anchorEl:
    | null
    | Element
    | PopoverVirtualElement
    | (() => Element | PopoverVirtualElement | null)
    | undefined;
  open: boolean;
  placement?: PopperPlacementType;
  onClose: () => void;
  data: {
    name: string;
    email: string;
    role: string;
    avatar: string;
    storageUsed: number;
    storageTotal: number;
  };
}

export interface RazethAvatarContainerProps extends HtmlHTMLAttributes<HTMLDivElement> {
  src?: string;
  icon?: React.ReactElement<unknown> | undefined;
  alt?: string;
  role?: string;
  color?:
    | OverridableStringUnion<
        | "default"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning",
        ChipPropsColorOverrides
      >
    | undefined;
  fontSize?:
    | OverridableStringUnion<
        "inherit" | "large" | "medium" | "small",
        SvgIconPropsSizeOverrides
      >
    | undefined;
  size?:
    | OverridableStringUnion<"small" | "medium", ChipPropsSizeOverrides>
    | undefined;
  variant?:
    | OverridableStringUnion<"filled" | "outlined", ChipPropsVariantOverrides>
    | undefined;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface MiniDashboardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  mainCaption?: string;
  subCaption?: string;
  link?: string;
}

export interface ThemeToggleProps {
  /** Mirrors MUI icon size convention. Default 24 = MUI default icon size. */
  size?: number;
  checked?: boolean;
  // onChange?: (checked: boolean) => void;
  onChange?: (checked?: boolean) => void; // make arg optional
  ariaLabel?: string;
}

export interface ParticleProps extends IParticlesProps {
  children?: React.ReactNode;
}

// export interface IconInputProps<TFieldValues extends FieldValues = FieldValues>
//   extends
//     UseControllerProps<TFieldValues>,
//     Omit<TextFieldProps, "name" | "defaultValue"> {
//   // Add any other custom props from BaseInput here if they aren't in TextFieldProps
//   isPassword?: boolean;
//   resettable?: boolean;
//   clearAlwaysVisible?: boolean;
//   iconStart?: React.ReactNode;
//   iconEnd?: React.ReactNode;
//   behavior?: FieldBehavior;
// }

export interface IconInputProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<BaseInputProps<TFieldValues>, "field" | "fieldState"> {
  name: string;
  rules?: UseControllerProps["rules"];
  defaultValue?: unknown;
  behavior?: FieldBehavior;
  required?: boolean;
  /**
   * Set true to run async uniqueness validation for this field.
   *
   * Why a separate prop and not rules.validate:
   * RHF silently skips rules.validate on all fields when useForm has a resolver.
   * This prop instead uses a useEffect side-effect channel (setError/clearErrors)
   * which works regardless of whether a resolver is present.
   */
  asyncValidate?: boolean;
}

export interface BaseInputProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<TextFieldProps, "variant"> {
  field: UseControllerReturn<TFieldValues>["field"];
  fieldState: UseControllerReturn<TFieldValues>["fieldState"];
  /** Pass "password" to activate the built-in show/hide toggle */
  type?: string;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  /**
   * Show a clear button when the field has a value.
   * Defaults to `true` so text fields always get a clear button unless
   * explicitly opted out with `resettable={false}`.
   */
  resettable?: boolean;
  clearAlwaysVisible?: boolean;
  isValidating?: boolean;
  isFocused?: boolean;
  // Explicitly add this to resolve the destructuring conflict
  readOnly?: boolean;
  helperText?: ReactNode;
  ref?: Ref<HTMLDivElement>; // Standard prop in React 19
  rootRef?: React.RefObject<HTMLDivElement | null>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface ControlledInputProps extends Omit<
  BaseInputProps,
  "field" | "fieldState"
> {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  name: string;
  asyncValidate?: boolean;
  clearErrors?: (name: string) => void;
  setError?: (name: string, error: ErrorOption) => void;
  isFocused?: boolean;
  onFocusChange?: (v: boolean) => void;
}

export interface InputAdornmentProps {
  value: string;
  /** Pass "password" to activate the show/hide toggle internally */
  type?: string;
  resettable?: boolean;
  clearAlwaysVisible?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isValidating?: boolean;
  iconEnd: ReactNode;
  spinnerColor?: "primary" | "error" | "warning" | "success" | "inherit"; // ← add
  onClear: () => void;
}

// export interface PasswordFieldProps<
//   TFieldValues extends FieldValues = FieldValues,
// > extends IconInputProps<TFieldValues> {
//   /**
//    * Show the zxcvbn strength meter below the field.
//    * When true, also wires up `strengthRule` as the async RHF validator so the
//    * field stays invalid until the password is strong enough.
//    */
//   strengthMeter?: boolean;
//   /**
//    * Value of the password field this one must match (confirm-password use case).
//    * When provided, wires up `matchRule` automatically.
//    */
//   matchPassword?: string;
// }

export interface PasswordFieldProps extends Omit<
  IconInputProps,
  "asyncValidate" | "type"
> {
  /** Show the zxcvbn strength meter and wire up strength validation */
  strengthMeter?: boolean;
  /**
   * Value of the password field to match against (confirm-password case).
   * When provided, wires up match validation automatically.
   */
  matchPassword?: string;
}

export interface ControlledPasswordInputProps extends Omit<
  ControlledInputProps,
  "type" | "asyncValidate"
> {
  // score?: number;
  // message?: string;
  strengthMeter: boolean;
  matchPassword?: string;
}

export interface FieldBehavior {
  clearable?: boolean;
  passwordToggle?: boolean;
  asyncValidate?: AsyncRuleType;
  showSpinner?: boolean;
  shakeOnError?: boolean;
}

export interface InputHelperTextProps {
  helperText?: React.ReactNode;
  error?: ValidationErrorMessage | string;
}

export interface ValidationErrorMessageWithArgs {
  message: string;
  args: {
    [key: string]: ValidationErrorMessageWithArgs | any;
  };
}

export type ValidationErrorMessage = string | ValidationErrorMessageWithArgs;

export interface UseAsyncFieldValidationOptions {
  /** RHF field name — also used as the API source path segment */
  name: string;
  /** Current field value, obtained from watch(name) */
  value: string;
  setError?: UseFormSetError<FieldValues>;
  clearErrors?: UseFormClearErrors<FieldValues>;
  /** Debounce delay in ms (default 500) */
  debounceDelay?: number;
  /** Skip validation entirely (e.g. field not yet dirty, or signin mode) */
  enabled?: boolean;
}

export interface UsePasswordValidationOptions extends UseAsyncFieldValidationOptions {
  threshold?: number;
}

export interface UseMatchPasswordOptions extends Omit<
  UseAsyncFieldValidationOptions,
  "debounceDelay"
> {
  matchValue: string;
}
