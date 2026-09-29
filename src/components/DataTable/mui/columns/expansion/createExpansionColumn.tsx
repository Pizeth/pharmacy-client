// mui/columns/expansion/createExpansionColumn.tsx

"use client";

import type { RowData } from "@tanstack/table-core";
import { createMuiDataTableColumnHelper } from "../../table";
import { DataTableExpandAllButton } from "./DataTableExpandAllButton";
import { DataTableExpandRowButton } from "./DataTableExpandRowButton";

export const DATA_TABLE_EXPANSION_COLUMN_ID = "__dataTableExpansion";

export interface CreateExpansionColumnOptions {
  /**
   * Explicit header content.
   *
   * When omitted the utility column keeps the standard icon affordance:
   *
   * - interactive when showExpandAll=true
   * - disabled when showExpandAll=false
   */
  readonly header?: string;

  /** Default: 44px. */
  readonly size?: number;

  /** Default: true. */
  readonly enablePinning?: boolean;

  /**
   * Whether the header affordance may expand/collapse the complete page.
   *
   * false preserves the compact icon geometry while disabling the command.
   *
   * Default: true.
   */
  readonly showExpandAll?: boolean;
}

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
        : () => <DataTableExpandAllButton disabled={!showExpandAll} />,

    cell: () => <DataTableExpandRowButton />,

    meta: {
      label: "Details",
      align: "center",
      headerAlign: "center",
      enableColumnMenu: false,
      enableColumnOrdering: false,
      truncate: false,
    },
  });
}
