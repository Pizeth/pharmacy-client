// src/components/DataTable/mui/components/column-menu/types.ts

import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

/**
 * Common context passed through the column-menu components.
 */
export interface DataTableColumnMenuContext<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;
}
