import {
  CssVarsTheme,
  PaletteMode,
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
  CssVarsThemeOptions,
} from "@mui/material/styles";

import { ClassKey, CustomComponents } from "@/types/classKey";
import {
  Line,
  Meteor,
  RazethComponentsPropsList,
  SideImage,
} from "@/interfaces/theme.interface";

declare module "@mui/material/styles" {
  interface Palette {
    passwordStrength: string[] | ((theme: Theme) => string[]);
  }
  interface PaletteOptions {
    passwordStrength?: string[] | ((theme: Theme) => string[]);
  }

  // 1. Extend ThemeVars to include your custom keys for CSS Variables
  interface ThemeVars {
    sideImage?: SideImage;
    // You can add other custom variable paths here
  }

  // 2. Merge MuiTheme with CssVarsTheme and your custom properties
  interface Theme extends MuiTheme, CssVarsTheme {
    custom: {
      sideImage: SideImage;
      lines: Line[];
      meteor: Meteor;
    };
  }

  // 3. Do the same for ThemeOptions
  interface ThemeOptions extends MuiThemeOptions, CssVarsThemeOptions {
    custom?: {
      sideImage?: SideImage;
      lines?: Line[];
      meteor?: Meteor;
    };
  }

  // ComponentNameToClassKey can derive its keys from our map.
  // Note: If each component has different keys (e.g., 'root', 'card'),
  // this interface should be defined manually for full accuracy.
  interface ComponentNameToClassKey extends Record<
    keyof RazethComponentsPropsList,
    ClassKey
  > {}

  // ComponentsPropsList directly extends our map.
  interface ComponentsPropsList extends RazethComponentsPropsList {}

  interface Components extends CustomComponents {
    // Your custom components are now automatically included
    // You can still add standard MUI component overrides here if needed
  }
}

export type GradientRow = {
  y: number; // the row baseline
  dotY: number; // the dot’s y position
};

export type GradientPoint = {
  x: number;
  y: number;
  small?: boolean; // true = small dot, false = long streak
};

export type GradientOptions = {
  dotSize?: number; // default 1.5
  streakWidth?: number; // default 4
  streakHeight?: number; // default 100
  color?: string; // default "var(--c)"
};

export type AuthAction = "signin" | "signup";
