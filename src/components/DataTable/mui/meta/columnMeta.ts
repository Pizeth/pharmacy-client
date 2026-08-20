// src/components/DataTable/mui/meta/columnMeta.ts

/**
 * Logical horizontal alignment used by the MUI DataTable renderer.
 *
 * We deliberately use logical `start` / `end` instead of physical
 * `left` / `right` so the rendering layer can map alignment correctly
 * in both LTR and RTL layouts.
 */
export type MuiDataTableAlignment = "start" | "center" | "end";

/**
 * Rendering hint for the default filtering UI associated with a column.
 *
 * This does NOT control TanStack filtering behavior itself.
 *
 * Actual filtering behavior remains defined through TanStack options such as:
 *
 * - enableColumnFilter
 * - filterFn
 * - enableFilters
 * - enableColumnFilters
 */
export type MuiDataTableFilterVariant =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "multi-select"
  | "date"
  | "date-range"
  | "number-range";

/**
 * One option rendered by select-style filters.
 *
 * TValue is intentionally restricted to primitive values suitable for
 * HTML/MUI selection controls.
 */
export interface MuiDataTableFilterOption<
  TValue extends string | number | boolean = string | number | boolean,
> {
  readonly label: string;
  readonly value: TValue;
}

/**
 * MUI-specific column presentation metadata.
 *
 * TanStack behavioral options such as:
 *
 * - enableSorting
 * - enableColumnFilter
 * - filterFn
 * - enablePinning
 * - enableResizing
 *
 * remain directly on ColumnDef.
 */
export interface MuiDataTableColumnMeta {
  /**
   * Logical alignment for body cells.
   *
   * Defaults to `start`.
   */
  readonly align?: MuiDataTableAlignment;

  /**
   * Logical alignment for the column header.
   *
   * When omitted, the renderer may fall back to `align`.
   */
  readonly headerAlign?: MuiDataTableAlignment;

  /**
   * Controls which MUI editor is used for this column's filter UI.
   *
   * This does not enable filtering by itself.
   *
   * TanStack's `enableColumnFilter` / `enableFilters` remain the
   * behavioral source of truth.
   */
  readonly filterVariant?: MuiDataTableFilterVariant;

  /**
   * Options for select and multi-select filter variants.
   */
  readonly filterOptions?: readonly MuiDataTableFilterOption[];

  /**
   * Optional UI label override for the filter input.
   *
   * Useful when the rendered header is not a simple string.
   */
  readonly filterLabel?: string;

  /**
   * Whether the standard DataTable column menu should be available.
   *
   * Defaults to true.
   *
   * Useful for internal utility columns such as:
   *
   * - selection
   * - row actions
   * - expander
   */
  readonly enableColumnMenu?: boolean;
}
