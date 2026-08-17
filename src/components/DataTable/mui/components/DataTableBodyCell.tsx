"use client";

import { TableCell } from "@mui/material";
import type { Cell, CellData, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { resolveTableCellAlignment } from "./alignment";
import { getDataTablePinnedLayout, getDataTablePinnedSx } from "./pinning";

export interface DataTableBodyCellProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly cell: Cell<MuiDataTableFeatures, TData, TValue>;
}

/**
 * Render one body cell.
 *
 * AppCell performs two important jobs:
 *
 * 1. provides TanStack's cell context
 * 2. exposes the context-bound FlexRender helper
 *
 * We deliberately do not directly call:
 *
 *   cell.getValue()
 *
 * because that would bypass custom columnDef.cell rendering.
 */
export function DataTableBodyCell<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableBodyCellProps<TData, TValue>) {
  const { table, cell } = props;

  const meta = cell.column.columnDef.meta;

  const align = resolveTableCellAlignment(meta?.align);

  return (
    <table.AppCell
      cell={cell}
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnPinning: state.columnPinning,
      })}
    >
      {(appCell) => {
        /**
         * These reads belong inside the subscribed child render.
         */
        const size = cell.column.getSize();

        const pinnedLayout = getDataTablePinnedLayout(table, cell.column);

        const pinnedSx = getDataTablePinnedSx(pinnedLayout, "body");

        return (
          <TableCell
            align={align}
            data-column-id={cell.column.id}
            data-pinned={pinnedLayout?.position}
            sx={{
              boxSizing: "border-box",
              width: `${size}px`,
              minWidth: `${size}px`,
              maxWidth: `${size}px`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ...pinnedSx,
            }}
          >
            <appCell.FlexRender />
          </TableCell>
        );
      }}
    </table.AppCell>
  );
}
