"use client";

import { alpha, TableRow } from "@mui/material";

import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyCell } from "./DataTableBodyCell";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";

export interface DataTableBodyRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
}

/**
 * Render a single TanStack row.
 *
 * We intentionally use row.getVisibleCells().
 *
 * The column-visibility feature therefore remains the authority over
 * which cells appear in the rendered row.
 *
 * The row background is communicated through a CSS variable.
 *
 * Pinned cells need a solid background so horizontally scrolling
 * cells cannot show through underneath them. Using a row-level CSS
 * variable lets pinned cells still participate in row hover behavior.
 */
export function DataTableBodyRow<TData extends RowData>(
  props: DataTableBodyRowProps<TData>,
) {
  const { table, row } = props;

  const { density } = useDataTableDensity();

  const densityMetrics = getDataTableDensityMetrics(density);

  return (
    <table.Subscribe
      source={table.atoms.rowSelection}
      selector={(rowSelection) => Boolean(rowSelection?.[row.id])}
    >
      {(selected) => (
        <TableRow
          hover
          selected={selected}
          data-row-id={row.id}
          data-selected={selected ? "true" : undefined}
          data-density={density}
          sx={(theme) => {
            const baseBackground = theme.palette.background.paper;

            const hoverBackground = theme.palette.action.hover;

            // const selectedBackground = theme.palette.action.selected;

            const selectedBackground = alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity,
            );

            // const selectedHoverBackground = alpha(
            //   theme.palette.primary.main,
            //   theme.palette.action.selectedOpacity +
            //     theme.palette.action.hoverOpacity,
            // );

            const selectedHoverBackground = alpha(
              theme.palette.primary.main,
              Math.min(
                1,
                theme.palette.action.selectedOpacity +
                  theme.palette.action.hoverOpacity,
              ),
            );

            return {
              minHeight: `${densityMetrics.bodyRowHeight}px`,

              /**
               * Base background consumed by sticky body cells.
               */
              "--DataTable-row-background": selected
                ? selectedBackground
                : baseBackground,

              /**
               * Keep pinned cells visually synchronized with MUI's
               * row hover state.
               */
              "&:hover": {
                "--DataTable-row-background": selected
                  ? selectedHoverBackground
                  : hoverBackground,
              },
            };
          }}
        >
          <table.Subscribe
            selector={(state) => ({
              columnVisibility: state.columnVisibility,
              columnPinning: state.columnPinning,
            })}
          >
            {() =>
              row
                .getVisibleCells()
                .map((cell) => (
                  <DataTableBodyCell key={cell.id} table={table} cell={cell} />
                ))
            }
          </table.Subscribe>
        </TableRow>
      )}
    </table.Subscribe>
  );
}
