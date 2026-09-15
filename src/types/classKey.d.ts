// src/types/classKey.d.ts

import { RazethComponentsPropsList } from "@/interfaces/theme.interface";
import { ComponentsOverrides, Theme } from "@mui/material";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export type ClassKey =
  | "root"
  | "main"
  | "wrapper"
  | "overlay"
  | "ambient"
  | "effect"
  | "mobile"
  | "heading"
  | "content"
  | "item"
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

/**
 * ------------------------------------------------------------------
 * Application custom-component names
 * ------------------------------------------------------------------
 *
 * IMPORTANT:
 *
 * This generic helper must operate on the application's own custom
 * component registry:
 *
 *   RazethComponentsPropsList
 *
 * and NOT MUI's globally augmented:
 *
 *   ComponentsPropsList
 *
 * Once ComponentsPropsList is augmented it also contains the bespoke:
 *
 *   RazethDataTable
 *
 * contract.
 *
 * RazethDataTable intentionally has its own native MUI declaration in:
 *
 *   src/theme.d.ts
 *
 * because its:
 *
 * - defaultProps contract
 * - variant contract
 * - styleOverrides contract
 *
 * are more specialized than this legacy generic helper.
 */
type RazethComponentName = keyof RazethComponentsPropsList;

type MUIComponentsOverrides = ComponentsOverrides<Omit<Theme, "components">>;

type OverrideFor<Name extends RazethComponentName> =
  Name extends keyof MUIComponentsOverrides
    ? MUIComponentsOverrides[Name]
    : unknown;

/**
 * Generic configuration used by the application's ordinary custom
 * MUI components.
 *
 * Do not use this type as the RazethDataTable contract.
 */
// export type CustomComponentConfig<Name extends keyof ComponentsPropsList> = {
export type CustomComponentConfig<Name extends RazethComponentName> = {
  defaultProps?: RazethComponentsPropsList[Name];
  styleOverrides?: OverrideFor<Name>;

  /**
   * Existing custom-component variant contract.
   *
   * RazethDataTable does NOT flow through this branch.
   *
   * Its variants are typed with MUI ComponentsVariants directly in
   * src/theme.d.ts.
   */
  variants?: Array<{
    props: RazethComponentsPropsList[Name];
    style: (props: { theme: Theme }) => unknown;
  }>;
};

/**
 * Application custom components only.
 *
 * This mapped type must stay finite and must not derive from MUI's
 * globally augmented ComponentsPropsList.
 */
export type CustomComponents = {
  [K in RazethComponentName]?: CustomComponentConfig<K>;
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
