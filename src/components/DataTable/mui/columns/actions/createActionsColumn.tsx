"use client";

import type { RowData } from "@tanstack/table-core";
import { createMuiDataTableColumnHelper } from "../../table";
import { DataTableRowActions } from "./DataTableRowActions";
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "./types";
import type { CreateActionsColumnOptions } from "./types";

/**
 * Create the standard trailing row-actions display column.
 *
 * The column itself contains no application behavior.
 *
 * All application behavior is supplied through typed action
 * definitions.
 */
export function createActionsColumn<TData extends RowData>(
  options: CreateActionsColumnOptions<TData>,
) {
  const {
    actions,
    header = "Actions",
    size = 120,
    maxInlineActions = 2,
    enablePinning = true,
  } = options;

  const columnHelper = createMuiDataTableColumnHelper<TData>();

  return columnHelper.display({
    id: DATA_TABLE_ACTIONS_COLUMN_ID,
    size,
    minSize: size,
    maxSize: size,

    /**
     * Utility-column behavior.
     */
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableHiding: false,
    enableResizing: false,
    enablePinning,

    /**
     * A utility column should still explain itself.
     *
     * The visible header is independently configurable while the
     * stable meta label remains available to column-management UI.
     */
    header,

    cell: ({ row }) => (
      <DataTableRowActions<TData>
        row={row}
        actions={actions}
        maxInlineActions={maxInlineActions}
      />
    ),

    meta: {
      label: "Actions",
      align: "center",
      headerAlign: "center",
      enableColumnMenu: false,
      enableColumnOrdering: false,
      truncate: false,
    },
  });
}
