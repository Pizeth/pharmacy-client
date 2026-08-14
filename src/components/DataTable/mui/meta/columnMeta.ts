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
 * MUI-specific metadata attached to columnDef.meta.
 *
 * Keep this object focused on presentation.
 *
 * Behavioral capabilities must continue to use TanStack's own
 * feature-aware ColumnDef options.
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
   * Hint used by the future filter UI to determine which
   * MUI filtering control should be rendered.
   */
  readonly filterVariant?: MuiDataTableFilterVariant;
}
