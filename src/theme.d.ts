// src/theme.d.ts

import {
  CssVarsTheme,
  PaletteMode,
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
  CssVarsThemeOptions,
  ComponentsOverrides,
  ComponentsVariants,
} from "@mui/material/styles";
import type { DataTableThemeProps } from "@/components/DataTable/mui/theme/types";
import type { DataTableVariantProps } from "@/components/DataTable/mui/theme/variants";
import type { DataTableSlotKey } from "@/components/DataTable/mui/styles/dataTableClasses";

import { ClassKey, CustomComponents } from "@/types/classKey";
import {
  Line,
  Meteor,
  RazethComponentsPropsList,
  SideImage,
} from "@/interfaces/theme.interface";

declare module "@mui/material/styles" {
  interface Palette {
    passwordStrength: string[] | ((theme: MuiTheme) => string[]);
    link: {
      hover: string;
    };
    card: string;
    customShadows: {
      neumorphic: string;
      inset: string;
      circleWell: string;
    };
    dynamic: {
      background: string;
    };
  }
  interface PaletteOptions {
    passwordStrength?: string[] | ((theme: MuiTheme) => string[]);
    link?: {
      hover?: string;
    };
    card?: string;
    customShadows?: {
      neumorphic: string;
      inset: string;
      circleWell: string;
    };
    dynamic?: {
      background: string;
    };
  }

  // 1. Extend ThemeVars to include your custom keys for CSS Variables
  interface ThemeVars {
    sideImage?: SideImage;
    // You can add other custom variable paths here
  }

  interface CommonColors {
    whiteChannel: string;
    blackChannel: string;
  }

  // 2. Merge MuiTheme with CssVarsTheme and your custom properties
  interface Theme extends CssVarsTheme {
    // explicitly non-optional — this is the missing piece
    vars: CssVarsTheme["vars"];
    custom: {
      sideImage: SideImage;
      lines: Line[];
      meteor: Meteor;
      paper: string;
    };
  }

  // 3. Do the same for ThemeOptions
  interface ThemeOptions extends CssVarsThemeOptions {
    custom?: {
      sideImage?: SideImage;
      lines?: Line[];
      meteor?: Meteor;
      paper?: string;
    };
  }

  // ComponentNameToClassKey can derive its keys from our map.
  // Note: If each component has different keys (e.g., 'root', 'card'),
  // this interface should be defined manually for full accuracy.
  interface ComponentNameToClassKey extends Record<
    keyof RazethComponentsPropsList,
    ClassKey
  > {
    RazethDataTable: DataTableSlotKey;
  }

  /**
   * MUI's component-prop map drives:
   *
   * - variant matching
   * - styleOverrides ownerState typing
   *
   * It deliberately does NOT represent the complete DataTable renderer
   * prop surface.
   *
   * Theme defaultProps are typed separately below.
   */
  interface ComponentsPropsList extends RazethComponentsPropsList {
    RazethDataTable: DataTableVariantProps;
  }

  interface Components extends CustomComponents {
    /** Shared structural slots and resource-independent presentation defaults. */
    RazethDataTable?: {
      /**
       * Broader generic presentation defaults.
       *
       * This intentionally includes:
       *
       * - density
       * - toolbar defaults
       * - search defaults
       * - action defaults
       * - visual variant
       */
      defaultProps?: Partial<DataTableThemeProps>;

      /**
       * MUI types styleOverride callbacks against the component-level
       * ComponentsPropsList entry.
       *
       * RazethDataTable is a shared name used by many independently rendered
       * slots, however, so callers must not assume Root-only variant
       * ownerState exists inside every styleOverride callback.
       *
       * Use:
       *
       * - ordinary slot styleOverrides for slot styling
       * - RazethDataTable.variants for variant matching
       * - stable utility-class descendant selectors inside a Root variant
       *   when a variant must affect child slots
       */
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethDataTable"];

      /**
       * Theme variants are intentionally matched against:
       *
       *   DataTableVariantProps
       *
       * rather than the full DataTableThemeProps contract.
       */
      variants?: ComponentsVariants<MuiTheme>["RazethDataTable"];
    };

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

export type IconSize = "small" | "medium" | "large" | number | string;
