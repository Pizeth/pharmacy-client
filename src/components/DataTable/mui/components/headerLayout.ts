/**
 * ------------------------------------------------------------------
 * DataTable header affordance geometry
 * ------------------------------------------------------------------
 *
 * These constants define the physical inline space occupied by the
 * controls rendered immediately after a header label.
 *
 * They are intentionally centralized because center-aligned headers
 * need to compensate for this trailing content in order to center the
 * LABEL itself rather than the entire:
 *
 *   label + sort + filter + menu
 *
 * cluster.
 *
 * This is conceptually similar to Material React Table's `headerPL`
 * compensation, but our implementation keeps the visual sizes and
 * compensation calculation synchronized explicitly.
 */

/**
 * ------------------------------------------------------------------
 * Shared geometry for compact DataTable header affordances.
 * ------------------------------------------------------------------
 */

/**
 * Gap between adjacent header affordances.
 *
 * 2 px corresponds to MUI spacing(0.25) with the default 8 px scale.
 */
export const DATA_TABLE_HEADER_AFFORDANCE_GAP_PX = 2;

/**
 * Sort arrow itself.
 */
export const DATA_TABLE_HEADER_SORT_ICON_SIZE_PX = 16;

/**
 * Active multi-sort order badge.
 */
export const DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX = 16;

/**
 * Active-filter icon.
 */
export const DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX = 16;

/**
 * Compact column-menu button.
 */
export const DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX = 24;

/**
 * Runtime state determining which trailing header affordances currently
 * occupy space.
 */
export interface DataTableHeaderCenterCompensationOptions {
  readonly canSort: boolean;
  readonly showSortIndex: boolean;
  readonly showFilterIndicator: boolean;
  readonly showColumnMenu: boolean;
}

/**
 * Calculate the amount of logical inline-start compensation necessary
 * to keep the header LABEL geometrically centered in its physical
 * column.
 *
 * Example:
 *
 *   Category ↓ ⋮
 *
 * has trailing width from:
 *
 *   sort icon
 *   menu
 *
 * Without compensation, centering the complete cluster places
 * "Category" slightly left of the body-cell center.
 *
 * We add the same amount of empty space before the label:
 *
 *   [compensation] Category ↓ ⋮
 *
 * producing a symmetrical layout around the label.
 *
 * Logical inline-start is used by the renderer, so the technique works
 * correctly for both LTR and RTL layouts.
 */
export function getDataTableHeaderCenterCompensationPx(
  options: DataTableHeaderCenterCompensationOptions,
): number {
  const { canSort, showSortIndex, showFilterIndicator, showColumnMenu } =
    options;

  let compensation = 0;

  /**
   * TableSortLabel:
   *
   * label [2px gap] [16px icon]
   */
  if (canSort) {
    compensation +=
      DATA_TABLE_HEADER_AFFORDANCE_GAP_PX + DATA_TABLE_HEADER_SORT_ICON_SIZE_PX;
  }

  /**
   * Sort label -> multi-sort index:
   *
   * [2px gap] [16px badge]
   */
  if (showSortIndex) {
    compensation +=
      DATA_TABLE_HEADER_AFFORDANCE_GAP_PX +
      DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX;
  }

  /**
   * Main label/sort area -> active-filter indicator:
   *
   * [2px gap] [16px icon]
   */
  if (showFilterIndicator) {
    compensation +=
      DATA_TABLE_HEADER_AFFORDANCE_GAP_PX +
      DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX;
  }

  /**
   * Previous semantic content -> column menu:
   *
   * [2px gap] [24px button]
   */
  if (showColumnMenu) {
    compensation +=
      DATA_TABLE_HEADER_AFFORDANCE_GAP_PX +
      DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX;
  }

  return compensation;
}
