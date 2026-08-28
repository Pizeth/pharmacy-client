// src/components/DataTable/mui/server-data/createDataTableServerAdapter.ts

import type { RowData } from "@tanstack/table-core";
import type { DataTableServerAdapter } from "./types";

/**
 * Identity helper for defining strongly typed DataTable server adapters.
 *
 * Its runtime implementation is intentionally trivial.
 *
 * The value is in preserving inference for:
 *
 *   TRequest
 *   TResponse
 *   TData
 *
 * while authoring an adapter.
 */
export function createDataTableServerAdapter<
  TRequest,
  TResponse,
  TData extends RowData,
>(
  adapter: DataTableServerAdapter<TRequest, TResponse, TData>,
): DataTableServerAdapter<TRequest, TResponse, TData> {
  return adapter;
}
