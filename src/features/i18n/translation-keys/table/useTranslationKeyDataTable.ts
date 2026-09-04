"use client";

import {
  createDataTableServerTableBinding,
  useDataTableServerResult,
  useDataTableServerState,
  useMuiDataTable,
} from "@/components/DataTable";
import type {
  DataTableServerResultLifecycle,
  DataTableServerStateController,
} from "@/components/DataTable";
import { translationKeyColumns } from "../columns";
import type { TranslationKey } from "../schemas";
import { useTranslationKeyDataTableRequest } from "./useTranslationKeyDataTableRequest";

/**
 * Return type of the first real TranslationKey server-backed table
 * controller.
 *
 * Keeping query/result/request alongside the table instance makes the
 * resource component able to drive:
 *
 * - loading UI
 * - progress UI
 * - refresh
 * - error UI
 * - toolbar controls
 *
 * without putting transport knowledge into the renderer.
 */
export interface UseTranslationKeyDataTableResult {
  readonly table: ReturnType<typeof useMuiDataTable<TranslationKey>>;
  readonly query: DataTableServerStateController;
  readonly server: DataTableServerResultLifecycle<TranslationKey>;
  readonly refresh: () => void;
}

/**
 * Complete TranslationKey server-backed DataTable controller.
 */
export function useTranslationKeyDataTable(): UseTranslationKeyDataTableResult {
  /**
   * --------------------------------------------------------------
   * 1. Query state
   * --------------------------------------------------------------
   *
   * TanStack-facing pagination is zero-based:
   *
   *   pageIndex: 0
   *
   * The Standard API adapter later converts it to:
   *
   *   page: 1
   */
  const query = useDataTableServerState({
    defaultPageSize: 25,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      sorting: [
        /**
         * Optional initial table sort.
         *
         * The backend itself already provides deterministic default
         * ordering when sorting is empty, so we do not need to
         * manufacture a client sort here.
         */
      ],
      columnFilters: [],
      globalFilter: "",
    },
  });

  /**
   * --------------------------------------------------------------
   * 2. Execute TranslationKey resource query
   * --------------------------------------------------------------
   */
  const request = useTranslationKeyDataTableRequest(query.state);

  /**
   * --------------------------------------------------------------
   * 3. Normalize request lifecycle for DataTable
   * --------------------------------------------------------------
   */
  const server = useDataTableServerResult<TranslationKey>({
    query: query.state,
    result: request.result,
    loading: request.loading,
    fetching: request.fetching,
    error: request.error,

    /**
     * Preserve the last successful page during sorting, filtering,
     * pagination and refresh requests.
     */
    keepPreviousResult: true,
  });

  /**
   * --------------------------------------------------------------
   * 4. Convert server lifecycle + controller into TanStack options
   * --------------------------------------------------------------
   */
  const binding = createDataTableServerTableBinding<TranslationKey>({
    query,
    result: server,
  });

  /**
   * --------------------------------------------------------------
   * 5. Create the actual TanStack v9 MUI table
   * --------------------------------------------------------------
   *
   * No useReactTable.
   *
   * This is our configured createTableHook() family.
   */
  const table = useMuiDataTable({
    ...binding,

    columns: translationKeyColumns,

    /**
     * TranslationKey.id is stable across pagination and refreshes.
     *
     * Never use the current row index as server-backed row identity.
     */
    getRowId: (row) => String(row.id),

    /**
     * Resource capabilities.
     *
     * Individual columns further narrow these.
     */
    enableSorting: true,

    enableColumnFilters: true,

    /**
     * Server-backed tables should never apply local filtering or
     * sorting to the currently loaded page.
     *
     * The binding already sets the manual flags, these options only
     * express that the UI capabilities themselves are enabled.
     */
    manualPagination: true,

    manualSorting: true,

    manualFiltering: true,
  });

  return {
    table,
    query,
    server,
    refresh: request.refresh,
  };
}
