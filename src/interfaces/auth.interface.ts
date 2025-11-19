import { StyleComponent } from "@/types/classKey";
import { Theme } from "@emotion/react";
import { ButtonProps, SxProps } from "@mui/material";
import { HtmlHTMLAttributes, ReactNode } from "react";

export interface LoginParams {
  // For form login
  credential?: string;
  password?: string;
  // For OIDC callback
  token?: string;
  // Other params
  [key: string]: unknown;
}

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: number;
}

export interface LoginProps extends HtmlHTMLAttributes<HTMLDivElement> {
  // Content: MUIStyledCommonProps<Theme>;
  // Card: MUIStyledCommonProps<Theme>;
  // Avatar: MUIStyledCommonProps<Theme>;
  avatarIcon?: ReactNode;
  backgroundImage?: string;
  sideImage?: ReactNode;
  children?: ReactNode;
  divider?: ReactNode;
  social?: ReactNode;
  signUp?: ReactNode;
  footer?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
  variant?: "compact" | "full";
  src?: string;
  alt?: string;
  heading?: string;
}

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

export interface AvatarProps extends HtmlHTMLAttributes<HTMLDivElement> {
  avatarIcon?: ReactNode;
  src?: string;
  //   backgroundImage?: string;
  //   children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface SideImageProps extends HtmlHTMLAttributes<HTMLDivElement> {
  circle?: ReactNode;
  logo?: ReactNode;
  src?: string;
  circleSize?: string; // e.g. "33%", "200px"
  circleColor?: string; // e.g. "#1e40af", "red", "var(--mui-palette-primary-main)"
  logoOffset?: string; // e.g. "2%", "8px"
  className?: string;
  sx?: SxProps<Theme>;
}

export interface DividerProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  title?: string;
  sx?: SxProps<Theme>;
}

export interface SocialLoginProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

export interface SocialButtonProps
  extends ButtonProps /*ExtendButtonBase<ButtonTypeMap> & ButtonOwnProps */ {
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
  // onClick?: MouseEventHandler<T> | undefined;
}

export interface SignUpProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  message?: string;
  title?: string;
  link?: string;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
}

export interface FooterProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  description?: string;
  termsOfService?: string;
  termsOfServiceUrl?: string;
  privacyPolicy?: string;
  privacyPolicyUrl?: string;
  copyright?: string;
  ampersand?: string;
  sx?: SxProps<Theme>;
}
