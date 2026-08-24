// mui/components/column-manager/getColumnManagerLabel.ts

import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";

/**
 * Resolve the stable text label used by table-management UI.
 *
 * Priority:
 *
 * 1. MUI-specific explicit label
 * 2. string column header
 * 3. column id
 */
export function getColumnManagerLabel<
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<MuiDataTableFeatures, TData, TValue>): string {
  const meta = column.columnDef.meta;

  /**
   * We will add this metadata field below.
   */
  if (meta?.label) {
    return meta.label;
  }

  const header = column.columnDef.header;

  if (typeof header === "string") {
    return header;
  }

  return column.id;
}
