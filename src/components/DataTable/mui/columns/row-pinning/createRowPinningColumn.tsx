"use client";

import type { RowData } from "@tanstack/table-core";
import type { DataTableExplicitRowPinningDisplayMode } from "../../row-pinning";
import { createMuiDataTableColumnHelper } from "../../table";
import { DataTableRowPinningControls } from "./DataTableRowPinningControls";

export const DATA_TABLE_ROW_PINNING_COLUMN_ID = "__dataTableRowPinning";

export interface CreateRowPinningColumnOptions {
  /**
   * Explicit pinning interaction/display mode.
   *
   * Selection-driven modes deliberately do not use this column.
   */
  readonly displayMode?: DataTableExplicitRowPinningDisplayMode;

  readonly size?: number;
  readonly enableColumnPinning?: boolean;
}

/**
 * Create the standard per-row pinning command column.
 *
 * TanStack owns whether each row can pin and owns every pin/unpin mutation.
 * This column is only the generic MUI interaction surface.
 */
export function createRowPinningColumn<TData extends RowData>(
  options: CreateRowPinningColumnOptions = {},
) {
  const {
    displayMode = "sticky",
    size = displayMode === "top-and-bottom" ? 68 : 44,
    enableColumnPinning = true,
  } = options;

  const columnHelper = createMuiDataTableColumnHelper<TData>();

  return columnHelper.display({
    id: DATA_TABLE_ROW_PINNING_COLUMN_ID,
    header: "Pin",
    cell: () => <DataTableRowPinningControls displayMode={displayMode} />,

    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableHiding: false,
    enableResizing: false,
    enablePinning: enableColumnPinning,

    size,
    minSize: size,
    maxSize: size,

    meta: {
      label: "Pin",
      align: "center",
      headerAlign: "center",
      enableColumnMenu: false,
      enableColumnOrdering: false,
      truncate: false,
    },
  });
}
