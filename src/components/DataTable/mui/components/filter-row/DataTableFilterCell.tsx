// src/components/DataTable/mui/components/filter-row/DataTableFilterCell.tsx

"use client";

import { Box, TableCell } from "@mui/material";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";
import type { MuiDataTableInstance } from "../../table";
import { getDataTablePinnedLayout, getDataTablePinnedSx } from "../pinning";
import { DataTableColumnFilter } from "../filtering";

export interface DataTableFilterCellProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;

  /**
   * Vertical sticky offset of the filter row.
   *
   * The filter row sits immediately below all normal header rows.
   */
  readonly stickyTop: number;
}

/**
 * Renders one leaf-column cell in the optional filter subheader row.
 *
 * Responsibilities of this component:
 *
 * - preserve column sizing
 * - preserve sticky header positioning
 * - preserve logical start/end pinning
 * - render a structural blank cell for non-filterable columns
 * - mount the existing DataTableColumnFilter renderer
 *
 * It deliberately does NOT know anything about filter-value shapes.
 *
 * Text, number, range, boolean, select, date, etc. belong to
 * DataTableColumnFilter and its specialized editors.
 */
export function DataTableFilterCell<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableFilterCellProps<TData, TValue>) {
  const { table, column, stickyTop } = props;

  const { density } = useDataTableDensity();

  const densityMetrics = getDataTableDensityMetrics(density);

  return (
    <table.Subscribe
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnPinning: state.columnPinning,
        columnFilters: state.columnFilters,
      })}
    >
      {() => {
        const size = column.getSize();

        const pinnedLayout = getDataTablePinnedLayout(table, column);

        const pinnedSx = getDataTablePinnedSx(pinnedLayout, "header");

        const canFilter = column.getCanFilter();

        return (
          <TableCell
            data-filter-column-id={column.id}
            data-pinned={pinnedLayout?.position}
            data-density={density}
            sx={{
              /**
               * The entire filter row is part of the sticky header
               * stack.
               */
              position: "sticky",
              top: `${stickyTop}px`,
              zIndex: 3,

              /**
               * Sticky cells require their own background.
               */
              backgroundColor: "background.paper",
              boxSizing: "border-box",

              /**
               * Keep this cell synchronized with the exact committed
               * TanStack column width.
               */
              width: `${size}px`,
              minWidth: `${size}px`,
              maxWidth: `${size}px`,

              /**
               * The subheader needs enough room for MUI small inputs.
               *
               * We don't force DataTableColumnFilter itself to know
               * anything about density or header structure.
               */
              height: `${Math.max(40, densityMetrics.headerHeight - 4)}px`,
              px: 0.75,
              py: 0.5,
              verticalAlign: "middle",

              /**
               * Some MUI controls, labels, and menus need to remain
               * visually unrestricted by the table cell itself.
               */
              overflow: "visible",

              /**
               * Compact the existing standard filtering controls when
               * they are hosted in the header filter row.
               *
               * This is presentation styling only.
               * Filter behavior remains completely inside
               * DataTableColumnFilter.
               */
              "& .MuiFormControl-root": {
                minWidth: 0,
              },

              "& .MuiInputBase-root": {
                minWidth: 0,
              },

              /**
               * Pinned positioning must come last so pinned header
               * behavior wins over the generic sticky cell rules.
               */
              ...pinnedSx,
            }}
          >
            {canFilter ? (
              <DataTableColumnFilter column={column} />
            ) : (
              /**
               * Never remove an unfilterable column's structural
               * cell.
               *
               * Expansion, selection, actions, and any ordinary
               * column with enableColumnFilter=false must still
               * occupy their normal table-grid position.
               */
              <Box
                aria-hidden="true"
                sx={{
                  width: "100%",
                  minHeight: 32,
                }}
              />
            )}
          </TableCell>
        );
      }}
    </table.Subscribe>
  );
}
