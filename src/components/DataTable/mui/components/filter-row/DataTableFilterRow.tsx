// src/components/DataTable/mui/components/filter-row/DataTableFilterRow.tsx

"use client";

import { TableRow } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";
import type { MuiDataTableInstance } from "../../table";
import { DataTableFilterCell } from "./DataTableFilterCell";
import { useDataTableAccessibility } from "../../accessibility";

export interface DataTableFilterRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;

  /**
   * Number of normal header rows rendered above the filter row.
   */
  readonly headerRowCount: number;
}

/**
 * Dedicated column-filter subheader row.
 *
 * Uses visible leaf columns rather than header groups because each
 * filter belongs to one concrete leaf column.
 */
export function DataTableFilterRow<TData extends RowData>(
  props: DataTableFilterRowProps<TData>,
) {
  const { table, headerRowCount } = props;

  const { filterRowId } = useDataTableAccessibility();

  const { density } = useDataTableDensity();

  const densityMetrics = getDataTableDensityMetrics(density);

  const stickyTop = headerRowCount * densityMetrics.headerHeight;

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
      })}
    >
      {() => {
        const columns = table.getVisibleLeafColumns();

        return (
          <TableRow
            id={filterRowId}
            data-filter-row="true"
            aria-label="Column filters"
            sx={{
              backgroundColor: "background.paper",
            }}
          >
            {columns.map((column) => (
              <DataTableFilterCell
                key={column.id}
                table={table}
                column={column}
                stickyTop={stickyTop}
              />
            ))}
          </TableRow>
        );
      }}
    </table.Subscribe>
  );
}
