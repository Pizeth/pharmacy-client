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

/**
 * MUI's strongly typed override contract.
 *
 * This remains useful for the newer independent DataTable controls:
 *
 *   RazethDataTableTextFilter
 *   RazethDataTableNumberFilter
 *   ...
 *
 * Those components were explicitly built around MUI's modern:
 *
 *   styled()
 *   ownerState
 *   styleOverrides
 *
 * contract.
 */
type MUIComponentsOverrides = ComponentsOverrides<Omit<Theme, "components">>;

/**
 * ------------------------------------------------------------------
 * Legacy application style override
 * ------------------------------------------------------------------
 *
 * Older Razeth components were authored as standalone theme objects
 * before the current MUI ownerState architecture.
 *
 * Their exported override objects contain:
 *
 *   slot: CSS object
 *
 * or:
 *
 *   slot: ({ theme }) => CSS object
 *
 * They should not be retroactively forced through MUI's modern
 * ownerState interpolation type merely because RazethDataTable now
 * needs that stronger contract.
 *
 * `object` here is deliberate:
 *
 * - no `any`
 * - no `unknown`
 * - still requires a style object/callback result
 * - does not falsely infer ownerState support
 */
type LegacyStyleOverride = object | ((props: { theme: Theme }) => object);

/**
 * Legacy components historically use several private/custom slots.
 *
 * Keep their slot registry permissive while migration of those
 * unrelated components remains outside the DataTable project.
 */
type LegacyStyleOverrides = Record<string, LegacyStyleOverride>;

/**
 * ------------------------------------------------------------------
 * styleOverrides policy
 * ------------------------------------------------------------------
 *
 * New DataTable leaf controls:
 *
 *   use MUI's strict override typing.
 *
 * Existing application components:
 *
 *   retain the legacy CSS-object/callback contract.
 *
 * RazethDataTable itself never reaches this type because it is
 * declared separately in src/theme.d.ts.
 */
type OverrideFor<Name extends RazethComponentName> =
  Name extends `RazethDataTable${string}`
    ? Name extends keyof MUIComponentsOverrides
      ? MUIComponentsOverrides[Name]
      : LegacyStyleOverrides
    : LegacyStyleOverrides;

// type OverrideFor<Name extends RazethComponentName> =
//   Name extends keyof MUIComponentsOverrides
//     ? MUIComponentsOverrides[Name]
//     : unknown;

/**
 * Generic configuration used by the application's ordinary custom
 * MUI components.
 *
 * `defaultProps` remains fully tied to the actual component props.
 *
 * `styleOverrides` is strict for the modern DataTable leaf controls
 * and intentionally legacy-compatible for older Razeth components.
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
   * This remains separate from RazethDataTable's native
   * ComponentsVariants contract.
   *
   * Its variants are typed with MUI ComponentsVariants directly in
   * src/theme.d.ts.
   */
  variants?: Array<{
    props: RazethComponentsPropsList[Name];
    style: (props: { theme: Theme }) => object;
  }>;
};

/**
 * Application custom components only.
 *
 * RazethDataTable is excluded naturally because it is not a key of
 * RazethComponentsPropsList.
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
