import type { MuiDataTableDensity } from "../density";
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
   * Initial uncontrolled density for DataTables.
   * Explicit density/defaultDensity props take precedence.
   * Changing this theme default does not reset mounted density state.
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
export type {
  DataTableClassKey,
  DataTableSlotKey,
} from "../styles/dataTableClasses";

/**
 * ------------------------------------------------------------------
 * DataTable-specific MUI ComponentsPropsList extension
 * ------------------------------------------------------------------
 *
 * This interface is deliberately kept inside the DataTable package.
 *
 * The application-level RazethComponentsPropsList can extend it rather
 * than importing every individual DataTable component prop type.
 *
 * That keeps theme augmentation scalable as more DataTable slots become
 * theme-aware later.
 */
export interface DataTableComponentsPropsList {
  RazethDataTableTextFilter: Partial<DataTableTextFilterProps>;
  RazethDataTableNumberFilter: Partial<DataTableNumberFilterProps>;
  RazethDataTableNumberRangeFilter: Partial<DataTableNumberRangeFilterProps>;
  RazethDataTableBooleanFilter: Partial<DataTableBooleanFilterProps>;
  RazethDataTableSelectFilter: Partial<DataTableSelectFilterProps>;
}
