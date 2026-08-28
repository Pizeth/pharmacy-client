// src/components/DataTable/adapters/standard-api/adaptStandardPaginatedResponse.ts

import type { RowData } from "@tanstack/table-core";

import type {
  DataTableServerResponseAdapter,
  DataTableServerResult,
} from "../../mui/server-data";
import type { StandardApiPaginatedResponse } from "./types";

/**
 * Convert the application's current standard paginated API response
 * into DataTable's backend-independent server result.
 *
 * Translation performed here:
 *
 * backend:
 *
 *   response.data.data
 *
 * becomes:
 *
 *   result.rows
 *
 *
 * backend:
 *
 *   currentPage: 1
 *
 * becomes:
 *
 *   pageIndex: 0
 */
export function adaptStandardPaginatedResponse<TData extends RowData>(
  response: StandardApiPaginatedResponse<TData>,
): DataTableServerResult<TData> {
  const { data: rows, metadata } = response.data;

  /**
   * Backend currentPage is one-based.
   *
   * DataTable/TanStack pageIndex is zero-based.
   */
  const pageIndex = metadata.currentPage - 1;

  return {
    rows,
    pagination: {
      pageIndex,
      pageSize: metadata.pageSize,
      rowCount: metadata.totalItems,
      pageCount: metadata.totalPages,
      hasNextPage: metadata.hasNextPage,
      hasPreviousPage: metadata.hasPreviousPage,
    },
  };
}

/**
 * Typed response-adapter object for consumers that prefer the generic
 * DataTableServerResponseAdapter contract.
 */
export function createStandardPaginatedResponseAdapter<
  TData extends RowData,
>(): DataTableServerResponseAdapter<
  StandardApiPaginatedResponse<TData>,
  TData
> {
  return {
    readResponse: adaptStandardPaginatedResponse<TData>,
  };
}
