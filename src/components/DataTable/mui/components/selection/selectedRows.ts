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
 * Resolve selected IDs back to concrete TanStack rows.
 *
 * `true` requests lookup through the complete row model rather than
 * limiting lookup to the immediately visible page.
 *
 * This is important because rowSelection may preserve selected rows
 * across pagination/filtering.
 */
export function getDataTableSelectedRows<TData extends RowData>(
  table: MuiDataTableInstance<TData>,

  selectedRowIds: readonly string[],
): Row<MuiDataTableFeatures, TData>[] {
  const rows: Row<MuiDataTableFeatures, TData>[] = [];

  for (const rowId of selectedRowIds) {
    rows.push(table.getRow(rowId, true));
  }

  return rows;
}
