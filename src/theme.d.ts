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
import type { HrdSlotKey } from "@/features/hrd/styles/hrdSlotKeys";
import type { NavigationSlotMap } from "@/components/Navigations/styles/slots";
import type { PublicDocumentsSlotKey } from "@/features/hrd/styles/publicDocumentsSlotKeys";
import type { AvatarContainerProps } from "@/components/Avatar/AvatarContainer";
import type { RouteContentLoadingSlot } from "@/components/layouts/RouteContentLoading";
import type { PulseLoaderSlot } from "@/components/effect/loaders/PulseLoader/PulseLoader.styles";
import type { LoginFeedbackSlot } from "@/components/auth/LoginFeedback.styles";

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
      /**
       * Data-dense surfaces need crisper elevation than the broader
       * application neumorphism language, especially in dark mode.
       */
      dataTableCard: string;
      dataTableInset: string;
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
      dataTableCard: string;
      dataTableInset: string;
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
  interface ComponentNameToClassKey extends NavigationSlotMap, Record<
    keyof RazethComponentsPropsList,
    ClassKey
  > {
    RazethDataTable: DataTableSlotKey;
    RazethSiteBreadcrumbs: import("@/components/layouts/SiteBreadcrumbs").SiteBreadcrumbSlot;
    RazethTableCreateButton: "root";
    RazethDocumentTracking: import("@/features/document-tracking/styles").DocumentTrackingSlot;
    RazethCompactCardToggle: import("@/components/Tables/CompactCardToggle").CompactCardToggleSlot;
    RazethResourceTableLoading: import("@/components/Tables/ResourceTableLoading").ResourceTableLoadingSlot;
    RazethAdminUsers: import("@/features/admin/users/styles").AdminUserSlot;
    RazethAdminSocial: import("@/features/admin/social/styles").AdminSocialSlot;
    RazethAdminRoles: import("@/features/admin/roles/styles").AdminRoleSlot;
    RazethHrd: HrdSlotKey;
    RazethLoader: PulseLoaderSlot;
    RazethCloudLoader: "root" | "message";
    RazethRouteContentLoading: RouteContentLoadingSlot;
    RazethLoginFeedback: LoginFeedbackSlot;
    RazethPublicDocuments: PublicDocumentsSlotKey;
    RazethAvatarContainer: "root" | "chip" | "foreground";
    RazethBackToTop: "root" | "progressRing";
    RazethSideImagePreview: "root" | "toolbar";
    RazethDrawerTheme: "root" | "label";
    RazethNavPattern: "root";
    RazethNavigationLayout: "main" | "headerDivider";
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
    RazethSiteBreadcrumbs: Record<string, unknown>;
    RazethTableCreateButton: Record<string, unknown>;
    RazethDocumentTracking: Record<string, unknown>;
    RazethCompactCardToggle: Record<string, unknown>;
    RazethResourceTableLoading: Record<string, unknown>;
    RazethAdminUsers: Record<string, unknown>;
    RazethAdminSocial: Record<string, unknown>;
    RazethAdminRoles: Record<string, unknown>;
    RazethDrawer: Record<string, unknown>;
    RazethLoginFeedback: Record<string, unknown>;
    RazethNav: Record<string, unknown>;
    RazethSearch: Record<string, unknown>;
    RazethSearchPoppers: Record<string, unknown>;
    RazethUserSetting: import("@/interfaces/component-props.interface").UserMenuProps;
    RazethDataTable: DataTableVariantProps;
    RazethHrd: Record<string, unknown>;
    RazethLoader: Record<string, unknown>;
    RazethCloudLoader: Record<string, unknown>;
    RazethRouteContentLoading: Record<string, unknown>;
    RazethPublicDocuments: Record<string, unknown>;
    RazethAvatarContainer: AvatarContainerProps;
    RazethBackToTop: Record<string, unknown>;
    RazethSideImagePreview: Record<string, unknown>;
    RazethDrawerTheme: Record<string, unknown>;
    RazethNavPattern: Record<string, unknown>;
    RazethNavigationLayout: Record<string, unknown>;
  }

  interface Components extends CustomComponents {
    RazethSiteBreadcrumbs?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethSiteBreadcrumbs"] };
    RazethTableCreateButton?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethTableCreateButton"] };
    RazethDocumentTracking?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethDocumentTracking"] };
    RazethCompactCardToggle?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethCompactCardToggle"] };
    RazethResourceTableLoading?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethResourceTableLoading"] };
    RazethAdminUsers?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethAdminUsers"] };
    RazethAdminSocial?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethAdminSocial"] };
    RazethAdminRoles?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethAdminRoles"] };
    RazethLoginFeedback?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethLoginFeedback"] };
    RazethSideImagePreview?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethSideImagePreview"] };
    RazethDrawer?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethDrawer"] };
    RazethNav?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethNav"] };
    RazethSearch?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethSearch"] };
    RazethSearchPoppers?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethSearchPoppers"] };
    RazethUserSetting?: { styleOverrides?: ComponentsOverrides<MuiTheme>["RazethUserSetting"] };
    RazethNavigationLayout?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethNavigationLayout"];
    };
    RazethNavPattern?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethNavPattern"];
    };
    RazethDrawerTheme?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethDrawerTheme"];
    };
    RazethCloudLoader?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethCloudLoader"];
    };
    RazethLoader?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethLoader"];
    };
    RazethBackToTop?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethBackToTop"];
    };
    RazethAvatarContainer?: {
      defaultProps?: Partial<AvatarContainerProps>;
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethAvatarContainer"];
    };
    RazethPublicDocuments?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethPublicDocuments"];
    };
    RazethRouteContentLoading?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethRouteContentLoading"];
    };
    RazethHrd?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethHrd"];
    };
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
