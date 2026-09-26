import type { BaseRecord, GetListResponse } from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";

import type {
  DataTableServerResult,
} from "../../mui/server-data";
import type {
  DataTableServerQueryState,
} from "../../mui/server-state";

/**
 * Convert Refine's generic GetListResponse into DataTable's normalized
 * server result.
 *
 * Refine returns:
 *
 *   data
 *   total
 *
 * but does not require a provider to echo the requested page. The current
 * DataTable query is therefore intentionally part of this adapter boundary.
 */
export function adaptRefineGetListResponse<
  TData extends RowData & BaseRecord,
>(
  response: GetListResponse<TData>,
  query: DataTableServerQueryState,
): DataTableServerResult<TData> {
  const pageIndex = query.pagination.pageIndex;
  const pageSize = query.pagination.pageSize;
  const rowCount = response.total;

  /**
   * DataTable requires an exact page count for normal offset pagination.
   *
   * pageSize is expected to be positive because it comes from TanStack
   * pagination state, but guard the division anyway so malformed external
   * controlled state never produces Infinity/NaN.
   */
  const pageCount =
    pageSize > 0
      ? Math.ceil(rowCount / pageSize)
      : 0;

  return {
    rows: [...response.data],

    pagination: {
      pageIndex,
      pageSize,
      rowCount,
      pageCount,

      hasPreviousPage: pageIndex > 0,

      hasNextPage:
        pageCount > 0 &&
        pageIndex + 1 < pageCount,
    },
  };
}
