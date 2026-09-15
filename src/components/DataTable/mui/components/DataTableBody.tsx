"use client";

import { styled, TableBody } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../table";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import {
  DataTableEmptyState,
  DataTableErrorState,
  DataTableLoadingState,
} from "./states";
import { normalizeDataTableGlobalFilter } from "../utils";
import { DataTableDetailPanelRenderer } from "./detail-panel";
import { DataTableBodyRowGroup } from "./DataTableBodyRowGroup";

const BodyRoot = styled(TableBody, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Body",
  overridesResolver: (_props, styles) => styles.body,
})({});

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
            <BodyRoot className={dataTableClasses.body}>
              <DataTableErrorState colSpan={colSpan}>
                {meta.error}
              </DataTableErrorState>
            </BodyRoot>
          );
        }

        if (meta?.loading) {
          return (
            <BodyRoot className={dataTableClasses.body}>
              <DataTableLoadingState colSpan={colSpan}>
                {meta.loadingContent}
              </DataTableLoadingState>
            </BodyRoot>
          );
        }

        if (rows.length === 0) {
          return (
            <BodyRoot className={dataTableClasses.body}>
              <DataTableEmptyState
                colSpan={colSpan}
                filtered={hasActiveFilters}
              >
                {hasActiveFilters ? meta?.noResultsContent : meta?.emptyContent}
              </DataTableEmptyState>
            </BodyRoot>
          );
        }

        return (
          <BodyRoot className={dataTableClasses.body}>
            {rows.map((row) => (
              <DataTableBodyRowGroup
                key={row.id}
                table={table}
                row={row}
                renderDetailPanel={renderDetailPanel}
              />
            ))}
          </BodyRoot>
        );
      }}
    </table.Subscribe>
  );
}
