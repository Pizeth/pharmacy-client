// src/components/DataTable/mui/server-state/createDataTableServerQueryState.ts

import type {
  DataTableServerQueryState,
  DataTableServerQueryStateInput,
} from "./types";

/**
 * Create one complete server-query state.
 *
 * A function is used rather than a shared object constant so arrays
 * and pagination state are never accidentally shared between tables.
 */
export function createDataTableServerQueryState(
  input: DataTableServerQueryStateInput = {},

  defaultPageSize: number = 25,
): DataTableServerQueryState {
  return {
    pagination: input.pagination ?? {
      pageIndex: 0,
      pageSize: defaultPageSize,
    },
    sorting: input.sorting ?? [],
    columnFilters: input.columnFilters ?? [],
    globalFilter: input.globalFilter ?? "",
  };
}
