"use client";

import { TableRow } from "@mui/material";

import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyCell } from "./DataTableBodyCell";

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

  return (
    <TableRow
      hover
      data-row-id={row.id}
      sx={(theme) => ({
        /**
         * Base background consumed by sticky body cells.
         */
        "--DataTable-row-background": theme.palette.background.paper,

        /**
         * Keep pinned cells visually synchronized with MUI's
         * row hover state.
         */
        "&:hover": {
          "--DataTable-row-background": theme.palette.action.hover,
        },
      })}
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
  );
}
