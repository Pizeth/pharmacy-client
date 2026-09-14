// src/components/DataTable/mui/components/filter-row/DataTableFilterRow.tsx

"use client";

import { styled, TableRow } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";
import type { MuiDataTableInstance } from "../../table";
import { DataTableFilterCell } from "./DataTableFilterCell";
import { useDataTableAccessibility } from "../../accessibility";
import { getDataTableVisibleColumnsInRenderOrder } from "../visibleColumnOrder";

export interface DataTableFilterRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;

  /**
   * Number of normal header rows rendered above the filter row.
   */
  readonly headerRowCount: number;
}

const FilterRowRoot = styled(TableRow, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterRow",
  overridesResolver: (_props, styles) => styles.filterRow,
})(({ theme }) => ({
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
}));

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
        const columns = getDataTableVisibleColumnsInRenderOrder(table);

        return (
          <FilterRowRoot
            className={dataTableClasses.filterRow}
            id={filterRowId}
            data-filter-row="true"
            aria-label="Column filters"
          >
            {columns.map((column) => (
              <DataTableFilterCell
                key={column.id}
                table={table}
                column={column}
                stickyTop={stickyTop}
              />
            ))}
          </FilterRowRoot>
        );
      }}
    </table.Subscribe>
  );
}
