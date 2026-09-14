// src/components/DataTable/mui/components/DataTableHeader.types.ts

import type {
  DataTableColumnGeometryStyle,
  DataTableCssPixelValue,
} from "../styles";

/**
 * ------------------------------------------------------------------
 * Runtime HeaderCell measurements
 * ------------------------------------------------------------------
 *
 * This interface deliberately contains only values determined from
 * live TanStack/DataTable state.
 *
 * Static presentation does NOT belong here.
 *
 * For example, these do NOT belong in this interface:
 *
 * - background color
 * - font weight
 * - overflow
 * - borders
 * - transitions
 * - padding policy
 *
 * Those belong to:
 *
 *   styled(..., {
 *     name: DATA_TABLE_COMPONENT_NAME,
 *     slot: "HeaderCell",
 *   })
 *
 * and therefore become customizable through:
 *
 *   theme.components.RazethDataTable.styleOverrides.headerCell
 */
export interface DataTableHeaderCellStyle extends DataTableColumnGeometryStyle {
  /**
   * Vertical sticky offset of this header row.
   *
   * Calculated from:
   *
   *   headerRowIndex
   *       ×
   *   densityMetrics.headerHeight
   *
   * Example:
   *
   *   first row:
   *     0px
   *
   *   second 56px header row:
   *     56px
   */
  "--DataTable-header-sticky-top": DataTableCssPixelValue;
}
