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
   * Default fullscreen-action visibility.
   *
   * Important:
   *
   * This controls the ACTION.
   *
   * It is not fullscreen state.
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
