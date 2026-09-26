"use client";

import type {
  BaseRecord,
  HttpError,
} from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";

import {
  useDataTableServerResult,
} from "../../../mui/server-data";
import type {
  RefineDataTableServerLifecycle,
  UseRefineDataTableServerResultOptions,
} from "./types";
import {
  useRefineDataTableRequest,
} from "./useRefineDataTableRequest";

/**
 * Complete Refine -> DataTable server-result bridge.
 *
 * This hook composes:
 *
 *   Refine request execution
 *
 * with:
 *
 *   DataTable's existing transport-independent result lifecycle.
 *
 * The result can be passed directly to:
 *
 *   createDataTableServerTableBinding()
 *
 * without the MUI renderer learning anything about Refine.
 */
export function useRefineDataTableServerResult<
  TData extends RowData & BaseRecord,
  TError extends HttpError = HttpError,
>(
  options: UseRefineDataTableServerResultOptions<TData, TError>,
): RefineDataTableServerLifecycle<TData> {
  const {
    keepPreviousResult = true,
    ...requestOptions
  } = options;

  const request = useRefineDataTableRequest<
    TData,
    TError
  >(requestOptions);

  const server = useDataTableServerResult<TData>({
    query: options.query,
    result: request.result,
    loading: request.loading,
    fetching: request.fetching,
    error: request.error,
    keepPreviousResult,
  });

  return {
    request,
    server,
  };
}
