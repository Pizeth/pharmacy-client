import type { MuiDataTableDensity } from "../density";

import type {
  DataTableToolbarSearchMode,
  DataTableToolbarSearchPosition,
} from "../components/toolbar";

/**
 * Theme-level defaults supported by RazethDataTable.
 *
 * Important:
 *
 * Do not put row/resource-specific values here.
 *
 * Theme defaults should describe presentation and generic behavior,
 * not:
 *
 * - columns
 * - data
 * - API adapters
 * - resource query mappings
 */
export interface DataTableThemeProps {
  /**
   * Default density for DataTables.
   */
  readonly density?: MuiDataTableDensity;

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
   * Default fullscreen action visibility.
   */
  readonly enableFullscreen?: boolean;
}

/**
 * Slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
 */
export type DataTableClassKey =
  | "root"
  | "shell"
  | "toolbar"
  | "toolbarStart"
  | "toolbarCenter"
  | "toolbarEnd"
  | "tableContainer"
  | "table"
  | "head"
  | "headerRow"
  | "headerCell"
  | "headerCellContent"
  | "headerLabel"
  | "headerActions"
  | "resizeHandle"
  | "filterRow"
  | "filterCell"
  | "body"
  | "bodyRow"
  | "bodyCell"
  | "pagination"
  | "selectionBar";
