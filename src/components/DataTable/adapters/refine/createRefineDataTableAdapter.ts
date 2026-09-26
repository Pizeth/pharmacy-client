import type { BaseRecord } from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";

import { adaptRefineGetListResponse } from "./adaptRefineGetListResponse";
import { createRefineDataTableQueryAdapter } from "./createRefineDataTableQueryAdapter";
import type {
  CreateRefineDataTableAdapterOptions,
  RefineDataTableAdapter,
} from "./types";

/**
 * Compose one resource semantic query mapper with the Refine transport
 * contract.
 *
 * This does not execute Refine hooks and does not introduce React state.
 * It is a pure adapter object that can later be consumed by:
 *
 * - useList()
 * - useTable()
 * - a custom query lifecycle
 * - tests
 *
 * Keeping execution separate preserves DataTable's existing layering.
 */
export function createRefineDataTableAdapter<
  TData extends RowData & BaseRecord,
>(
  options: CreateRefineDataTableAdapterOptions,
): RefineDataTableAdapter<TData> {
  const { semanticAdapter, ...queryOptions } = options;

  const queryAdapter = createRefineDataTableQueryAdapter(
    semanticAdapter,
    queryOptions,
  );

  return {
    createRequest: queryAdapter.createRequest,

    readResponse: (
      response: GetListResponse<TData>,
      query,
    ) => adaptRefineGetListResponse(response, query),
  };
}
