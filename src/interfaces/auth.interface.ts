import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
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
  avatarIcon?: ReactNode;
  backgroundImage?: string;
  children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface LoginFormProps {
  redirectTo?: string;
  className?: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

export interface AvatarProps extends HtmlHTMLAttributes<HTMLDivElement> {
  avatarIcon?: ReactNode;
  //   backgroundImage?: string;
  //   children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface SideImageProps extends HtmlHTMLAttributes<HTMLDivElement> {
  className?: string;
  src?: string;
  sx?: SxProps<Theme>;
}
