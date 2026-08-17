"use client";

import { TableRow } from "@mui/material";
import type { HeaderGroup, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableHeaderCell } from "./DataTableHeaderCell";

export interface DataTableHeaderRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly headerGroup: HeaderGroup<MuiDataTableFeatures, TData>;
}

/**
 * Renders one TanStack header group.
 */
export function DataTableHeaderRow<TData extends RowData>(
  props: DataTableHeaderRowProps<TData>,
) {
  const { table, headerGroup } = props;

  return (
    <TableRow data-header-group-id={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <DataTableHeaderCell key={header.id} table={table} header={header} />
      ))}
    </TableRow>
  );
}
