"use client";

import {
  useList,
  type BaseRecord,
  type HttpError,
} from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";
import { useCallback, useMemo } from "react";

import type {
  RefineDataTableRequestState,
  UseRefineDataTableRequestOptions,
} from "./types";

/**
 * Execute one controlled DataTable server query through Refine.
 *
 * Architecture:
 *
 *   DataTableServerQueryState
 *            ↓
 *   RefineDataTableAdapter.createRequest()
 *            ↓
 *       Refine useList()
 *            ↓
 *   RefineDataTableAdapter.readResponse()
 *            ↓
 *   DataTableServerResult
 *
 * This hook deliberately stops at primitive request state.
 *
 * It does NOT decide:
 *
 * - whether loading should replace the whole table,
 * - whether old rows should remain visible,
 * - whether an error is blocking or refresh-only.
 *
 * Those transport-independent decisions remain centralized in
 * useDataTableServerResult().
 */
export function useRefineDataTableRequest<
  TData extends RowData & BaseRecord,
  TError extends HttpError = HttpError,
>(
  options: UseRefineDataTableRequestOptions<TData, TError>,
): RefineDataTableRequestState<TData> {
  const {
    query,
    adapter,
    queryOptions,
  } = options;

  /**
   * The adapter owns the complete Refine request shape:
   *
   * - resource
   * - one-based pagination
   * - sorters
   * - filters
   * - provider name
   * - meta
   *
   * The renderer and this execution hook do not need resource knowledge.
   */
  const request = useMemo(
    () => adapter.createRequest(query),
    [adapter, query],
  );

  const list = useList<TData, TError, TData>({
    ...request,
    queryOptions,
  });

  /**
   * React Query placeholderData belongs to the new query key while containing
   * old-query rows.
   *
   * Feeding that value through readResponse(response, currentQuery) would
   * incorrectly label old rows with the new page/filter metadata.
   *
   * DataTable already has useDataTableServerResult() for previous-result
   * preservation, so placeholder data is intentionally treated as "no current
   * canonical result yet".
   */
  const result = useMemo(() => {
    if (!list.query.data || list.query.isPlaceholderData) {
      return undefined;
    }

    return adapter.readResponse(
      list.query.data,
      query,
    );
  }, [
    adapter,
    list.query.data,
    list.query.isPlaceholderData,
    query,
  ]);

  const refresh = useCallback((): void => {
    /**
     * Refetch returns a promise, but the public DataTable refresh command is
     * intentionally fire-and-forget just like the existing resource loader.
     */
    void list.query.refetch();
  }, [list.query.refetch]);

  return {
    result,

    /**
     * Refine/TanStack Query distinguishes initial loading from background
     * fetching already.
     */
    loading: list.query.isLoading,
    fetching: list.query.isFetching,

    /**
     * QueryObserverResult uses null while there is no error.
     * DataTable accepts unknown and treats null/undefined as no error.
     */
    error: list.query.error,

    refresh,
  };
}
