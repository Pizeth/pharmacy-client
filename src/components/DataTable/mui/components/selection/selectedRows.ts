// src/components/DataTable/mui/components/selection/selectedRows.ts

import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

/**
 * Minimal row-selection map shape required by the MUI selection UI.
 *
 * TanStack row-selection state uses row IDs as keys and booleans as
 * selected flags.
 */
export type DataTableRowSelectionState = Readonly<Record<string, boolean>>;

/**
 * Return selected row IDs while ignoring stale/false entries.
 */
export function getDataTableSelectedRowIds(
  rowSelection: DataTableRowSelectionState,
): string[] {
  const ids: string[] = [];

  for (const [rowId, selected] of Object.entries(rowSelection)) {
    if (selected) {
      ids.push(rowId);
    }
  }

  return ids;
}

/**
 * Resolve the selected rows available in the loaded core model.
 * Manual pagination can retain IDs whose data is not loaded. Keep those
 * IDs in the selection context, but do not invent rows or throw for them.
 */
export function getDataTableSelectedRows<TData extends RowData>(
  table: MuiDataTableInstance<TData>,

  selectedRowIds: readonly string[],
): Row<MuiDataTableFeatures, TData>[] {
  const rows: Row<MuiDataTableFeatures, TData>[] = [];

  const rowsById = table.getCoreRowModel().rowsById;
  for (const rowId of selectedRowIds) {
    const row = rowsById[rowId];
    if (row) rows.push(row);
  }

  return rows;
}
