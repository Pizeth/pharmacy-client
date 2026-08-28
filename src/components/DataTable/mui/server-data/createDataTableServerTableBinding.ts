// src/components/DataTable/mui/server-data/createDataTableServerTableBinding.ts

import type { RowData } from "@tanstack/table-core";
import type {
  CreateDataTableServerTableBindingOptions,
  DataTableServerTableBinding,
} from "./types";

/**
 * Create the standard TanStack options shared by server-backed MUI
 * DataTables.
 *
 * This helper does NOT create a table.
 *
 * The returned object is intended to be spread into:
 *
 *   useMuiDataTable({
 *     ...binding,
 *     columns,
 *     ...
 *   })
 *
 * Resource-specific behavior remains outside this helper.
 */
export function createDataTableServerTableBinding<TData extends RowData>(
  options: CreateDataTableServerTableBindingOptions<TData>,
): DataTableServerTableBinding<TData> {
  const { query, result } = options;

  return {
    /**
     * Current or preserved server page.
     */
    data: result.rows,

    /**
     * Server-query-controlled TanStack state slices.
     */
    state: query.state,

    onPaginationChange: query.onPaginationChange,
    onSortingChange: query.onSortingChange,
    onColumnFiltersChange: query.onColumnFiltersChange,
    onGlobalFilterChange: query.onGlobalFilterChange,

    /**
     * Server owns these row-model transformations.
     *
     * We keep the client row-model features installed in the static
     * MUI feature family because client tables still use them.
     *
     * Manual modes simply bypass those transformations for this table.
     */
    manualPagination: true,

    manualSorting: true,
    manualFiltering: true,

    /**
     * Page count comes from the normalized server metadata.
     *
     * Before the first result this may be -1.
     */
    pageCount: result.pagination.pageCount,
  };
}
