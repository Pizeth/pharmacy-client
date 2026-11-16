import type { Breakpoint } from "@mui/material/styles";
import type { CSSProperties } from "react";
import type { MuiDataTableDensity } from "../density";
import type { DataTableDisplayMode } from "../presentation/types";
import type {
  DataTableToolbarSearchMode,
  DataTableToolbarSearchPosition,
} from "../components/toolbar";
import type {
  DataTableBooleanFilterProps,
  DataTableNumberFilterProps,
  DataTableNumberRangeFilterProps,
  DataTableSelectFilterProps,
  DataTableTextFilterProps,
} from "../components/filtering/types";
import type { DataTableVariantProps } from "./variants";

/**
 * ------------------------------------------------------------------
 * Theme-level DataTable defaults
 * ------------------------------------------------------------------
 *
 * These values belong to:
 *
 *   theme.components.RazethDataTable.defaultProps
 *
 * This is NOT the structural ownerState type.
 *
 * Theme defaults describe generic presentation/behavior defaults.
 * Resource-specific values never belong here.
 *
 * Theme defaults should describe presentation and generic behavior,
 * not:
 *
 * - columns
 * - data
 * - API adapters
 * - resource query mappings
 */
export interface DataTableThemeProps extends DataTableVariantProps {
  /**
   * Initial uncontrolled density for DataTables.
   *
   * Explicit:
   *
   *   density
   *   defaultDensity
   *
   * props take precedence.
   *
   * Changing this theme default does not reset mounted uncontrolled
   * density state.
   */
  readonly density?: MuiDataTableDensity;

  /**
   * Initial uncontrolled presentation mode.
   *
   * "auto" remains unresolved until Phase 1.9.4 and currently renders the
   * established table presentation.
   */
  readonly defaultDisplayMode?: DataTableDisplayMode;

  /**
   * Responsive threshold used when default/requested display mode is "auto".
   *
   * Default: "sm".
   */
  readonly autoCardBreakpoint?: Breakpoint;

  /**
   * Whether the standard toolbar is rendered.
   */
  readonly enableToolbar?: boolean;

  /**
   * Whether global search is rendered.
   */
  readonly enableGlobalSearch?: boolean;

  readonly searchMode?: DataTableToolbarSearchMode;

  readonly searchPosition?: DataTableToolbarSearchPosition;

  /**
   * Default visibility of the column-management action.
   */
  readonly enableColumnManager?: boolean;

  /**
   * Default density switch visibility.
   */
  readonly enableDensityToggle?: boolean;

  /**
   * Default table/card presentation-toggle visibility.
   *
   * The action still renders only when the current DataTable supplies a card
   * presentation.
   */
  readonly enableDisplayModeToggle?: boolean;

  /**
   * Default fullscreen-action visibility.
   *
   * Important:
   *
   * This controls the ACTION.
   *
   * It is not fullscreen state.
   */
  readonly enableFullscreen?: boolean;

  /**
   * Preferred width of the native table surface.
   *
   * This is a generic presentation default. A DataTable instance may override
   * it explicitly. When omitted, the renderer uses TanStack's resolved total
   * visible-column width.
   *
   * Example:
   *
   *   theme.components.RazethDataTable.defaultProps.tableWidth = "100%"
   */
  readonly tableWidth?: CSSProperties["width"];

  /**
   * Optional minimum width of the native table surface.
   *
   * When omitted, TanStack's resolved total visible-column width remains the
   * minimum so wide column models continue to scroll horizontally.
   */
  readonly tableMinWidth?: CSSProperties["minWidth"];
}

/**
 * Slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
 */
export type {
  DataTableClassKey,
  DataTableSlotKey,
} from "../styles/dataTableClasses";

/**
 * ------------------------------------------------------------------
 * Leaf filter MUI component-prop extension
 * ------------------------------------------------------------------
 *
 * These are independent named MUI components:
 *
 *   RazethDataTableTextFilter
 *   RazethDataTableNumberFilter
 *   ...
 *
 * RazethDataTable itself is augmented separately in src/theme.d.ts
 * because its:
 *
 *   defaultProps contract
 *
 * and:
 *
 *   variants / ownerState contract
 *
 * are intentionally different.
 */
export interface DataTableComponentsPropsList {
  RazethDataTableTextFilter: Partial<DataTableTextFilterProps>;
  RazethDataTableNumberFilter: Partial<DataTableNumberFilterProps>;
  RazethDataTableNumberRangeFilter: Partial<DataTableNumberRangeFilterProps>;
  RazethDataTableBooleanFilter: Partial<DataTableBooleanFilterProps>;
  RazethDataTableSelectFilter: Partial<DataTableSelectFilterProps>;
}
