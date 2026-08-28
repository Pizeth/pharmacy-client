// src/components/DataTable/mui/server-data/useDataTableServerResult.ts

"use client";

import { useEffect, useRef } from "react";
import type { RowData } from "@tanstack/table-core";
import type {
  DataTableServerPaginationResult,
  DataTableServerResult,
  DataTableServerResultLifecycle,
  UseDataTableServerResultOptions,
} from "./types";

/**
 * Derive presentation-ready server result state from generic
 * loading/fetching/error/result inputs.
 *
 * This hook deliberately performs NO network requests.
 *
 * It can therefore be used with:
 *
 * - fetch
 * - Axios
 * - TanStack Query
 * - Refine
 * - SWR
 * - GraphQL clients
 * - custom request hooks
 */
export function useDataTableServerResult<TData extends RowData>(
  options: UseDataTableServerResultOptions<TData>,
): DataTableServerResultLifecycle<TData> {
  const {
    query,
    result,
    loading = false,
    fetching,
    error,
    keepPreviousResult = true,
  } = options;

  /**
   * Most query libraries distinguish:
   *
   *   initial/pending loading
   *
   * from:
   *
   *   any request currently fetching.
   *
   * If the caller only supplies `loading`, use it for both.
   */
  const isFetching = fetching ?? loading;

  /**
   * Keep the most recently committed successful result.
   *
   * We intentionally store the normalized result rather than the raw
   * transport response.
   *
   * This keeps HTTP/API details out of the lifecycle layer.
   */
  const previousResultRef = useRef<DataTableServerResult<TData> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (result !== undefined) {
      previousResultRef.current = result;
    }
  }, [result]);

  const previousResult = keepPreviousResult
    ? previousResultRef.current
    : undefined;

  /**
   * A current result always wins.
   *
   * A previous result is only used while the current result is
   * temporarily unavailable.
   */
  const displayedResult = result ?? previousResult;

  const hasResult = displayedResult !== undefined;

  const isPreviousResult =
    result === undefined &&
    previousResult !== undefined &&
    displayedResult === previousResult;

  /**
   * Before the first server result arrives we still expose the
   * current requested page/pageSize.
   *
   * pageCount = -1 means:
   *
   *   not known yet
   *
   * which our pagination renderer already understands.
   */
  const fallbackPagination: DataTableServerPaginationResult = {
    pageIndex: query.pagination.pageIndex,
    pageSize: query.pagination.pageSize,
    rowCount: 0,
    pageCount: -1,
    hasNextPage: false,
    hasPreviousPage: query.pagination.pageIndex > 0,
  };

  const rows = displayedResult?.rows ?? [];

  const pagination = displayedResult?.pagination ?? fallbackPagination;

  const hasRows = rows.length > 0;

  const isEmpty = hasResult && !hasRows;

  /**
   * Initial loading means there is nothing useful to keep visible.
   *
   * Once a result exists, another request becomes a refresh rather
   * than a blocking table load.
   */
  const isInitialLoading = loading && !hasResult;

  const isRefreshing = isFetching && hasResult;

  /**
   * Treat undefined/null as no error.
   *
   * Everything else remains untouched because error interpretation is
   * an application/transport concern.
   */
  const hasError = error !== undefined && error !== null;

  const blockingError = hasError && !hasResult ? error : undefined;

  const refreshError = hasError && hasResult ? error : undefined;

  return {
    rows,
    pagination,
    hasResult,
    isPreviousResult,
    hasRows,
    isEmpty,
    isInitialLoading,
    isFetching,
    isRefreshing,
    error,
    blockingError,
    refreshError,
  };
}
