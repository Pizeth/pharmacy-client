"use client";

import type { RowData } from "@tanstack/table-core";
import { createMuiDataTableColumnHelper } from "../../table";
import { DataTableSelectAllCheckbox } from "./DataTableSelectAllCheckbox";
import { DataTableSelectRowCheckbox } from "./DataTableSelectRowCheckbox";

/**
 * Stable internal id for the selection display column.
 *
 * This should never collide with application accessor columns.
 */
export const DATA_TABLE_SELECTION_COLUMN_ID = "__dataTableSelection";

export interface CreateSelectionColumnOptions {
  /**
   * Logical width of the checkbox utility column.
   */
  readonly size?: number;

  /**
   * Whether the column itself may be resized.
   *
   * Default: false
   */
  readonly enableResizing?: boolean;

  /**
   * Whether the column should be pinnable.
   *
   * Default: true
   */
  readonly enablePinning?: boolean;
}

/**
 * Creates the standard MUI DataTable row-selection display column.
 *
 * This column deliberately:
 *
 * - has no accessor
 * - cannot sort
 * - cannot filter
 * - cannot hide
 * - renders a select-all checkbox in the header
 * - renders one row checkbox per row
 */
export function createSelectionColumn<TData extends RowData>(
  options: CreateSelectionColumnOptions = {},
) {
  const columnHelper = createMuiDataTableColumnHelper<TData>();

  const size = options.size ?? 48;

  return columnHelper.display({
    id: DATA_TABLE_SELECTION_COLUMN_ID,

    header: () => <DataTableSelectAllCheckbox />,

    cell: () => <DataTableSelectRowCheckbox />,

    /**
     * Utility-column behavior.
     */
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableHiding: false,
    enablePinning: options.enablePinning ?? true,
    enableResizing: options.enableResizing ?? false,

    /**
     * Tight fixed width by default.
     */
    size,
    minSize: size,
    maxSize: size,
    meta: {
      align: "center",
      headerAlign: "center",
      enableColumnMenu: false,
    },
  });
}
