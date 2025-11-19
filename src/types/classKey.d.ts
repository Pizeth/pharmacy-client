import { ComponentsPropsList } from "@/interfaces/theme.interface";
import { ComponentsOverrides, Theme } from "@mui/material";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type ClassKey =
  | "root"
  | "overlay"
  | "heading"
  | "content"
  | "password"
  | "label"
  | "button"
  | "icon"
  | "card"
  | "avatar"
  | "image"
  | "caption"
  | "footer";

export type StyleComponent = StyledComponent<
  MUIStyledCommonProps<Theme>,
  Pick<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    | keyof React.ClassAttributes<HTMLDivElement>
    | keyof React.HTMLAttributes<HTMLDivElement>
  >,
  {}
>;

type MUIComponentsOverrides = ComponentsOverrides<Omit<Theme, "components">>;

type OverrideFor<Name> = Name extends keyof MUIComponentsOverrides
  ? MUIComponentsOverrides[Name]
  : unknown;

// Generic helper type for custom component config
export type CustomComponentConfig<Name extends keyof ComponentsPropsList> = {
  defaultProps?: ComponentsPropsList[Name];
  styleOverrides?: OverrideFor<Name>;
  variants?: Array<{
    props: ComponentsPropsList[Name];
    style: (props: { theme: Theme }) => unknown;
  }>;
};

// Mapped type to generate all component configs automatically
export type CustomComponents = {
  [K in keyof ComponentsPropsList]?: CustomComponentConfig<K>;
};

// Generic helper type for custom component config
// export type CustomComponentConfig<Name extends keyof ComponentsPropsList> = {
//   defaultProps?: ComponentsPropsList[Name];
//   styleOverrides?: ComponentsOverrides<Omit<Theme, "components">>[Name];
//   variants?: Array<{
//     props: ComponentsPropsList[Name];
//     style: (props: { theme: Theme }) => unknown;
//   }>;
// };
