"use client";

// src/components/DataTable/mui/components/DataTableHead.tsx

import { TableHead } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import { useDataTableFilterDisplay } from "../filter-display";
import type { MuiDataTableInstance } from "../table";
import { DataTableFilterRow } from "./filter-row";
import { DataTableHeaderRow } from "./DataTableHeaderRow";

export interface DataTableHeadProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Renders the current TanStack header-groups structure.
 *
 * Grouped/nested columns may produce multiple header rows,
 * therefore we must render getHeaderGroups() rather than assuming
 * that a table has exactly one header row.
 *
 * Visibility and pinning can change which columns appear and their
 * rendered order, so we subscribe specifically to those slices.
 */
export function DataTableHead<TData extends RowData>(
  props: DataTableHeadProps<TData>,
) {
  const { table } = props;

  const { columnFilterDisplayMode, showColumnFilters } =
    useDataTableFilterDisplay();

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
      })}
    >
      {() => {
        const headerGroups = table.getHeaderGroups();

        const renderFilterRow =
          columnFilterDisplayMode === "subheader" && showColumnFilters;

        return (
          <TableHead>
            {headerGroups.map((headerGroup, headerRowIndex) => (
              <DataTableHeaderRow
                key={headerGroup.id}
                table={table}
                headerGroup={headerGroup}
                headerRowIndex={headerRowIndex}
              />
            ))}
            {renderFilterRow && (
              <DataTableFilterRow
                table={table}
                headerRowCount={headerGroups.length}
              />
            )}
          </TableHead>
        );
      }}
    </table.Subscribe>
  );
}
