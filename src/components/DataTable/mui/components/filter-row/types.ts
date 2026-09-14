import type {
  DataTableColumnGeometryStyle,
  DataTableCssPixelValue,
} from "../../styles";

/**
 * ------------------------------------------------------------------
 * Runtime FilterCell measurements
 * ------------------------------------------------------------------
 *
 * Permanent presentation belongs to:
 *
 *   RazethDataTable / FilterCell
 *
 * This type contains only values that genuinely depend on live
 * DataTable/TanStack state.
 */
export interface DataTableFilterCellStyle extends DataTableColumnGeometryStyle {
  /**
   * Vertical sticky offset beneath all ordinary header rows.
   */
  "--DataTable-filter-sticky-top": DataTableCssPixelValue;

  /**
   * Resolved physical height of the filter cell.
   *
   * The value currently follows DataTable density metrics.
   */
  "--DataTable-filter-cell-height": DataTableCssPixelValue;
}
