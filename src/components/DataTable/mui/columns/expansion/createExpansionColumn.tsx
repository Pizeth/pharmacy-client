// mui/columns/expansion/createExpansionColumn.tsx

"use client";

import type { RowData } from "@tanstack/table-core";
import { createMuiDataTableColumnHelper } from "../../table";
import { DataTableExpandAllButton } from "./DataTableExpandAllButton";
import { DataTableExpandRowButton } from "./DataTableExpandRowButton";

export const DATA_TABLE_EXPANSION_COLUMN_ID = "__dataTableExpansion";

export interface CreateExpansionColumnOptions {
  /**
   * Visible header content when expand-all is not used or when the
   * caller wants an explicit resource label.
   *
   * Default:
   *
   * - expand-all control when showExpandAll=true
   * - "Details" when showExpandAll=false
   */
  readonly header?: string;

  /**
   * Width of the expansion utility column.
   *
   * Default: 44px.
   */
  readonly size?: number;

  /**
   * Whether the utility column can be pinned.
   *
   * Default: true.
   */
  readonly enablePinning?: boolean;

  /**
   * Render expand-all control in the header.
   *
   * Default: true.
   */
  readonly showExpandAll?: boolean;
}

/**
 * Create the standard DataTable expansion display column.
 *
 * Expansion remains actual TanStack row-expansion state; this column
 * provides only the MUI interaction surface.
 */
export function createExpansionColumn<TData extends RowData>(
  options: CreateExpansionColumnOptions = {},
) {
  const {
    header,
    size = 44,
    enablePinning = true,
    showExpandAll = true,
  } = options;

  const columnHelper = createMuiDataTableColumnHelper<TData>();

  return columnHelper.display({
    id: DATA_TABLE_EXPANSION_COLUMN_ID,
    size,
    minSize: size,
    maxSize: size,
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableHiding: false,
    enableResizing: false,
    enablePinning,

    header:
      header !== undefined
        ? header
        : showExpandAll
          ? () => <DataTableExpandAllButton />
          : "Details",

    cell: () => <DataTableExpandRowButton />,

    meta: {
      label: "Details",
      align: "center",
      headerAlign: "center",
      enableColumnMenu: false,
      enableColumnOrdering: false,
    },
  });
}
