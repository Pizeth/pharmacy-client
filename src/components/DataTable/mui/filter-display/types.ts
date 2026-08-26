// src/components/DataTable/mui/filter-display/types.ts

/**
 * Presentation mode used for column filters.
 *
 * "popover"
 *   Column filters are accessed through the existing column
 *   menu/filter popover UI.
 *
 * "subheader"
 *   Filters may additionally be rendered as a dedicated row beneath
 *   the table headers.
 *
 * Both modes write to the exact same TanStack columnFilters state.
 */
export type MuiDataTableColumnFilterDisplayMode = "popover" | "subheader";

/**
 * Public filter-display configuration accepted by DataTable.
 */
export interface DataTableFilterDisplayConfig {
  /**
   * Controlled filter-display mode.
   *
   * Default: "popover".
   */
  readonly columnFilterDisplayMode?: MuiDataTableColumnFilterDisplayMode;

  /**
   * Initial mode when uncontrolled.
   *
   * Default: "popover".
   */
  readonly defaultColumnFilterDisplayMode?: MuiDataTableColumnFilterDisplayMode;

  /**
   * Called whenever a mode change is requested.
   */
  readonly onColumnFilterDisplayModeChange?: (
    mode: MuiDataTableColumnFilterDisplayMode,
  ) => void;

  /**
   * Controlled visibility of the subheader filter row.
   *
   * This has no effect when mode === "popover".
   */
  readonly showColumnFilters?: boolean;

  /**
   * Initial subheader visibility in uncontrolled mode.
   *
   * Default: false.
   */
  readonly defaultShowColumnFilters?: boolean;

  /**
   * Called whenever the subheader visibility changes.
   */
  readonly onShowColumnFiltersChange?: (show: boolean) => void;
}
