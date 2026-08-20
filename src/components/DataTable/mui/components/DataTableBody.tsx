"use client";

import { TableBody } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyRow } from "./DataTableBodyRow";
import {
  DataTableEmptyState,
  DataTableErrorState,
  DataTableLoadingState,
} from "./states";

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

  // const rows = table.getRowModel().rows;

  // return (
  //   <TableBody>
  //     {rows.map((row) => (
  //       <DataTableBodyRow key={row.id} table={table} row={row} />
  //     ))}
  //   </TableBody>
  // );

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        pagination: state.pagination,
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      })}
    >
      {() => {
        const rows = table.getRowModel().rows;

        const visibleColumnCount = table.getVisibleLeafColumns().length;

        const meta = table.options.meta;

        /**
         * Guard against an invalid colSpan=0.
         *
         * In practice at least one visible column should normally remain,
         * but the renderer should still produce valid markup if every
         * hideable column becomes hidden.
         */
        const colSpan = Math.max(1, visibleColumnCount);

        if (meta?.error) {
          return (
            <TableBody>
              <DataTableErrorState colSpan={colSpan}>
                {meta.error}
              </DataTableErrorState>
            </TableBody>
          );
        }

        if (meta?.loading) {
          return (
            <TableBody>
              <DataTableLoadingState colSpan={colSpan}>
                {meta.loadingContent}
              </DataTableLoadingState>
            </TableBody>
          );
        }

        if (rows.length === 0) {
          return (
            <TableBody>
              <DataTableEmptyState colSpan={colSpan}>
                {meta?.emptyContent}
              </DataTableEmptyState>
            </TableBody>
          );
        }

        return (
          <TableBody>
            {rows.map((row) => (
              <DataTableBodyRow key={row.id} table={table} row={row} />
            ))}
          </TableBody>
        );
      }}
    </table.Subscribe>
  );
}
