"use client";

import { TableBody } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyRow } from "./DataTableBodyRow";

export interface DataTableBodyProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Render the table's final row model.
 *
 * We intentionally use:
 *
 *   table.getRowModel()
 *
 * rather than:
 *
 *   table.getCoreRowModel()
 *
 * because getRowModel() represents the final TanStack row-model pipeline:
 *
 * core
 *   -> filtering
 *   -> sorting
 *   -> pagination
 *   -> ...
 *
 * depending on the registered feature family and manual-mode options.
 */
export function DataTableBody<TData extends RowData>(
  props: DataTableBodyProps<TData>,
) {
  const { table } = props;

  const rows = table.getRowModel().rows;

  return (
    <TableBody>
      {rows.map((row) => (
        <DataTableBodyRow key={row.id} table={table} row={row} />
      ))}
    </TableBody>
  );
}
