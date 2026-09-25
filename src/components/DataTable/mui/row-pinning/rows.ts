import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import {
  isDataTableStickyRowPinningMode,
  type DataTableRowPinningDisplayMode,
} from "./types";

/**
 * Resolve the physical body-row render order for one row-pinning display mode.
 *
 * TanStack remains the source of truth for:
 *
 * - the current final row model
 * - top pinned rows
 * - center rows
 * - bottom pinned rows
 *
 * The renderer decides only whether pinned rows stay in their normal scrolling
 * position (sticky modes) or move into static top/bottom regions.
 */
export function getDataTableRowsForPinningDisplay<TData extends RowData>(
  table: MuiDataTableInstance<TData>,
  displayMode: DataTableRowPinningDisplayMode,
): Array<Row<MuiDataTableFeatures, TData>> {
  const rows = table.getRowModel().rows;

  if (isDataTableStickyRowPinningMode(displayMode)) {
    /**
     * In sticky mode, preserve the normal body order for every row already in
     * the final row model.
     *
     * keepPinnedRows=true may additionally make pinned rows available through
     * TanStack's top/bottom APIs even when filtering/pagination removed them
     * from the current row model. Add only those missing rows at their
     * corresponding edge and avoid duplicates.
     */
    const renderedRowIds = new Set(rows.map((row) => row.id));

    const missingTopRows = table
      .getTopRows()
      .filter((row) => !renderedRowIds.has(row.id));

    const missingBottomRows = table
      .getBottomRows()
      .filter((row) => !renderedRowIds.has(row.id));

    return [...missingTopRows, ...rows, ...missingBottomRows];
  }

  /**
   * Static modes physically regroup pinned rows.
   *
   * This uses TanStack's own partition directly rather than duplicating row
   * membership logic in the renderer.
   */
  return [
    ...table.getTopRows(),
    ...table.getCenterRows(),
    ...table.getBottomRows(),
  ];
}
