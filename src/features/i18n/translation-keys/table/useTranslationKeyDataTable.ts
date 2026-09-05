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
import { useTheme } from "@mui/material";

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
 *
 * This is where the infrastructure built throughout Phase 1.7 finally
 * converges into one real TanStack v9 table instance.
 *
 * We deliberately allow TypeScript to infer the return type.
 *
 * In particular, we do not manually recreate the complicated
 * createTableHook() feature-bound table type.
 */
export function useTranslationKeyDataTable(): UseTranslationKeyDataTableResult {
  const theme = useTheme();

  /**
   * --------------------------------------------------------------
   * 1. Server query state
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

    /**
     * These are already true by default, but listing them here makes
     * this resource's server behavior explicit.
     */
    resetPageOnSortingChange: true,
    resetPageOnColumnFiltersChange: true,
    resetPageOnGlobalFilterChange: true,
  });

  /**
   * --------------------------------------------------------------
   * 2. Execute TranslationKey resource query
   * --------------------------------------------------------------
   */
  const request = useTranslationKeyDataTableRequest(query.state);

  /**
   * ================================================================
   * 3. Generic server-result lifecycle
   * ================================================================
   *
   * This gives us:
   *
   *   rows
   *   pagination
   *   initial loading
   *   background refresh
   *   previous-result preservation
   *   blocking error
   *   refresh error
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
   * ================================================================
   * 4. Generic server -> TanStack binding
   * ================================================================
   *
   * Produces:
   *
   *   data
   *   state
   *   onPaginationChange
   *   onSortingChange
   *   onColumnFiltersChange
   *   onGlobalFilterChange
   *
   *   manualPagination: true
   *   manualSorting: true
   *   manualFiltering: true
   *
   *   pageCount
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

    /**
     * Backend supports up to 10 sorting descriptors.
     *
     * Keep the client-side capability aligned with the server
     * structural validation limit.
     */
    enableMultiSort: true,

    maxMultiSortColCount: 10,

    /**
     * Global search is already safe:
     *
     * UI string
     *   ↓
     * semantic resource capability
     *   ↓
     * Standard API sends only search.term
     *   ↓
     * Nest owns actual searchable fields
     */
    enableGlobalFilter: true,

    /**
     * TEMPORARY FOR 1.7.10.4
     *
     * Keep column-filter controls disabled until Phase 1.7.10.5,
     * where we will bind the correct UI variants:
     *
     *   ID          -> numeric
     *   Key         -> text
     *   Description -> text
     *   Category    -> category select returning NUMBER
     *   Locale      -> locale select returning STRING
     *
     * The server infrastructure itself is already ready.
     */
    enableColumnFilters: false,

    /**
     * TanStack logical resize direction should agree with the MUI
     * theme.
     *
     * Your renderer explicitly notes that this belongs at table
     * creation time rather than being mutated by the renderer.
     */
    columnResizeDirection: theme.direction,

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
    /**
     * Completed MUI-family TanStack v9 table.
     */
    table,

    /**
     * Controlled server query state.
     */
    query,

    /**
     * Presentation-ready server lifecycle.
     */
    server,

    /**
     * Explicit reload without changing query state.
     */
    refresh: request.refresh,
  };
}
