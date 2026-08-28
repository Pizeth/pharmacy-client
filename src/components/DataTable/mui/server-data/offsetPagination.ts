// src/components/DataTable/mui/server-data/offsetPagination.ts

import type { DataTableServerQueryState } from "../server-state";

/**
 * Generic one-based offset-pagination request.
 *
 * This matches APIs using:
 *
 *   page = 1
 *   pageSize = 25
 *
 * rather than TanStack's:
 *
 *   pageIndex = 0
 */
export interface DataTableOffsetPaginationRequest {
  readonly page: number;
  readonly pageSize: number;
}

/**
 * Convert TanStack's zero-based pagination state into a conventional
 * one-based API request.
 */
export function createDataTableOffsetPaginationRequest(
  query: Pick<DataTableServerQueryState, "pagination">,
): DataTableOffsetPaginationRequest {
  return {
    page: query.pagination.pageIndex + 1,
    pageSize: query.pagination.pageSize,
  };
}
