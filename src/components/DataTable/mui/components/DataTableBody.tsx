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
import { normalizeDataTableGlobalFilter } from "../utils";
import { DataTableDetailPanelRenderer } from "./detail-panel";
import { DataTableBodyRowGroup } from "./DataTableBodyRowGroup";

export interface DataTableBodyProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;
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
  const { table, renderDetailPanel } = props;

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
        globalFilter: state.globalFilter,
        expanded: state.expanded,
      })}
    >
      {(selected) => {
        const rows = table.getRowModel().rows;

        const visibleColumnCount = table.getVisibleLeafColumns().length;

        /**
         * Guard against an invalid colSpan=0.
         *
         * In practice at least one visible column should normally remain,
         * but the renderer should still produce valid markup if every
         * hideable column becomes hidden.
         */
        const colSpan = Math.max(1, visibleColumnCount);

        const meta = table.options.meta;

        const globalFilter = normalizeDataTableGlobalFilter(
          selected.globalFilter,
        );

        const hasActiveFilters =
          selected.columnFilters.length > 0 ||
          normalizeDataTableGlobalFilter(selected.globalFilter).length > 0;

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
              <DataTableEmptyState
                colSpan={colSpan}
                filtered={hasActiveFilters}
              >
                {hasActiveFilters ? meta?.noResultsContent : meta?.emptyContent}
              </DataTableEmptyState>
            </TableBody>
          );
        }

        return (
          <TableBody>
            {rows.map((row) => (
              <DataTableBodyRowGroup
                key={row.id}
                table={table}
                row={row}
                renderDetailPanel={renderDetailPanel}
              />
            ))}
          </TableBody>
        );
      }}
    </table.Subscribe>
  );
}
