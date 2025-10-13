import { ComponentsOverrides, Theme } from "@mui/material";
import {
  AvatarProps,
  DividerProps,
  LoginProps,
  SideImageProps,
  SignUpProps,
  FooterProps,
} from "./auth.interface";

// This interface maps each component's name to its specific props interface.
// To add a new component, you only need to add a new line here.
export interface ComponentsPropsList {
  RazethLogin: Partial<LoginProps>;
  RazethSideImage: Partial<SideImageProps>;
  RazethAvatar: Partial<AvatarProps>;
  RazethDivider: Partial<DividerProps>;
  RazethSignUpLink: Partial<SignUpProps>;
  RazethFooter: Partial<FooterProps>;
}
