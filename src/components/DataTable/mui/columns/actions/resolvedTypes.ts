// src/components/DataTable/mui/columns/actions/resolvedTypes.ts

import type { ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";
import type { IconButtonProps } from "@mui/material";
import type { DataTableRowAction, DataTableRowActionContext } from "./types";

/**
 * Resolve either a static action value or a context-derived value.
 */
export interface ResolvedDataTableRowAction<TData extends RowData> {
  readonly definition: DataTableRowAction<TData>;
  readonly context: DataTableRowActionContext<TData>;
  readonly icon: ReactNode;
  readonly color: IconButtonProps["color"];
  readonly disabled: boolean;
  readonly inline: boolean;
}
