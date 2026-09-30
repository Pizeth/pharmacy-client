"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ExpandedState,
  RowPinningState,
  RowSelectionState,
} from "@tanstack/table-core";
import { useTheme } from "@mui/material";
import {
  createDataTableServerTableBinding,
  useDataTableLiveTableStateSafety,
  useDataTableServerState,
  useMuiDataTable,
} from "@/components/DataTable";
import type {
  DataTableServerResultLifecycle,
  DataTableServerStateController,
} from "@/components/DataTable";
import { createTranslationKeyColumns } from "../columns";
import type { TranslationKey } from "../schemas";
import {
  useTranslationKeyRefineDataTableServerResult,
} from "../refine";
import { useTranslationKeyFilterOptions } from "./useTranslationKeyFilterOptions";
import type { TranslationKeyFilterOptionsState } from "./useTranslationKeyFilterOptions";
import type { DataTableRowAction } from "@/components/DataTable/mui/columns/actions";
import {
  TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE,
} from "../server/translationKeyQueryUrlState";
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "@/components/DataTable/mui/columns/actions";
import { DATA_TABLE_EXPANSION_COLUMN_ID } from "@/components/DataTable/mui/columns/expansion";
import { DATA_TABLE_SELECTION_COLUMN_ID } from "@/components/DataTable/mui/columns/selection";

export interface UseTranslationKeyDataTableOptions {
  readonly rowActions?: readonly DataTableRowAction<TranslationKey>[];

  /**
   * Optional externally owned semantic server-query controller.
   *
   * The production /admin/i18n route supplies the Next.js URL-synchronized
   * controller. Tests and non-route consumers may keep using the normal
   * internal controller.
   */
  readonly queryController?: DataTableServerStateController;

  /**
   * Enables TranslationKey's production detail-panel surface.
   *
   * Generic row-expansion infrastructure already belongs to the MUI
   * DataTable family.
   */
  readonly enableTranslationDetails?: boolean;

  /**
   * Enables TranslationKey row selection.
   *
   * Selection is presentation/application command state. It remains
   * outside DataTableServerQueryState and never enters the HTTP query.
   */
  readonly enableRowSelection?: boolean;
}

/**
 * Complete TranslationKey DataTable controller result.
 *
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

  /**
   * Controlled server-query state.
   */
  readonly query: DataTableServerStateController;

  /**
   * Presentation-ready server-result lifecycle.
   */
  readonly server: DataTableServerResultLifecycle<TranslationKey>;

  /**
   * Resource filter-option lifecycle.
   */
  readonly filterOptions: TranslationKeyFilterOptionsState;

  /**
   * Explicitly refresh TranslationKey rows.
   */
  readonly refresh: () => void;
}

/**
 * Complete TranslationKey server-backed DataTable controller.
 *
 * Resource orchestration:
 *
 *   category options
 *         ↓
 *   resource columns
 *
 *
 *   server query state
 *         ↓
 *   resource request
 *         ↓
 *   normalized lifecycle
 *         ↓
 *   TanStack binding
 *         ↓
 *   useMuiDataTable()
 */
export function useTranslationKeyDataTable(
  options: UseTranslationKeyDataTableOptions = {},
): UseTranslationKeyDataTableResult {
  const {
    rowActions = [],
    queryController,
    enableTranslationDetails = false,
    enableRowSelection = false,
  } = options;
  const theme = useTheme();

  /**
   * Translation detail expansion is resource-local presentation state.
   *
   * It must not become part of DataTableServerQueryState:
   *
   * - a same-query mutation refresh should preserve the open detail panel
   * - a semantic table-query transition should clear stale expansion
   */
  const [expanded, setExpanded] = useState<ExpandedState>({});

  /**
   * Server-backed row selection is stable record-identity application state.
   *
   * It intentionally survives:
   *
   * - sorting,
   * - column filtering,
   * - global search,
   * - pagination,
   * - same-query canonical refreshes.
   *
   * Manual/server pagination means the currently loaded page is only a subset
   * of the resource. Absence from one page is therefore NOT evidence that a
   * selected record no longer exists.
   *
   * Mutation commands that require a loaded record already guard themselves
   * through selectedRows.length, while known successful deletion removes the
   * deleted stable ID explicitly.
   */
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  /**
   * Row pinning is controlled independently from row selection.
   *
   * This distinction is required by the "select-sticky" interaction model:
   *
   * - selecting ONE row through its row checkbox pins that row
   * - deselecting that row unpins it
   * - selecting the whole page selects every row but intentionally clears
   *   pinning instead of stacking 25 sticky rows at the top of the viewport
   *
   * Selection-driven pin IDs survive semantic query transitions alongside
   * rowSelection. keepPinnedRows=false below guarantees that off-page IDs are
   * never resurrected into the current server page merely because the pin
   * identity remains remembered.
   *
   * The generic selection controls coordinate TanStack's own:
   *
   *   row.toggleSelected(...)
   *   row.pin(...)
   *   table.setRowPinning(...)
   *
   * so this resource only owns the controlled state lifecycle.
   */
  const [rowPinning, setRowPinning] = useState<RowPinningState>({
    top: [],
    bottom: [],
  });

  /**
   * ================================================================
   * 1. Resource filter-option data
   * ================================================================
   *
   * This currently loads TranslationCategory records.
   *
   * It deliberately does NOT belong to the main table-query request.
   */
  const filterOptions = useTranslationKeyFilterOptions();

  /**
   * ================================================================
   * 2. Build resource columns
   * ================================================================
   *
   * Column identity should remain stable while the option collections
   * themselves remain stable.
   */
  const columns = useMemo(
    () =>
      createTranslationKeyColumns({
        categoryFilterOptions: filterOptions.categoryOptions,
        categoryFilterOptionsFetching: filterOptions.fetching,
        categoryFilterOptionsError: filterOptions.error,
        localeFilterOptions: filterOptions.localeOptions,
        rowActions,
        enableTranslationDetails,
        enableRowSelection,
      }),
    [
      filterOptions.categoryOptions,
      filterOptions.localeOptions,
      filterOptions.fetching,
      filterOptions.error,
      rowActions,
      enableTranslationDetails,
      enableRowSelection,
    ],
  );

  /**
   * --------------------------------------------------------------
   * 3. Server query state
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
  const internalQuery = useDataTableServerState({
    defaultPageSize:
      TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE.pagination.pageSize,
    defaultState:
      TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE,

    /**
     * These are already true by default, but listing them here makes
     * this resource's server behavior explicit.
     */
    resetPageOnSortingChange: true,
    resetPageOnColumnFiltersChange: true,
    resetPageOnGlobalFilterChange: true,
  });

  /**
   * A host route may own semantic query state (for example through the
   * shareable URL adapter) without changing the resource's request/binding
   * architecture.
   */
  const query =
    queryController ??
    internalQuery;

  /**
   * --------------------------------------------------------------
   * 4. Execute TranslationKey resource query
   * --------------------------------------------------------------
   */
  /**
   * Query state changes establish a different server-result context for
   * expansion only.
   *
   * Reset expansion for:
   *
   * - pagination
   * - sorting
   * - column filtering
   * - global search
   * - explicit query replacement/reset
   *
   * Row selection and selection-driven pin identities are deliberately NOT
   * reset here. They are stable-ID application state and must survive ordinary
   * table query changes.
   *
   * Refine refresh deliberately leaves query.state unchanged, so nested
   * TranslationValue mutations preserve the expanded key while canonical
   * server data replaces row.original.translations.
   */
  useEffect(() => {
    setExpanded({});
  }, [query.state]);

  /**
   * ================================================================
   * 5. Production Refine request + generic server-result lifecycle
   * ================================================================
   *
   * TranslationKey keeps its established Standard API backend contract:
   *
   *   POST /api/v1/i18n/keys/query
   *
   * while Refine/TanStack Query now owns list-request execution/caching through
   * the resource's named provider.
   *
   * The generic bridge still returns DataTable's normalized lifecycle:
   *
   *   rows
   *   pagination
   *   initial loading
   *   background refresh
   *   previous-result preservation
   *   blocking error
   *   refresh error
   */
  const refine =
    useTranslationKeyRefineDataTableServerResult(
      query.state,
    );

  const server =
    refine.server;

  /**
   * ================================================================
   * 6. Generic server -> TanStack binding
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
   *   rowCount
   *   pageCount
   */
  const binding = createDataTableServerTableBinding<TranslationKey>({
    query,
    result: server,
  });

  /**
   * --------------------------------------------------------------
   * 7. Create the actual TanStack v9 MUI table
   * --------------------------------------------------------------
   *
   * No useReactTable.
   *
   * This is our configured createTableHook() family.
   */
  const table = useMuiDataTable({
    ...binding,

    /**
     * Layer resource-owned expansion over the query-owned state slices
     * supplied by the generic server binding.
     */
    state: {
      ...binding.state,
      expanded,
      rowSelection,
      rowPinning,
    },

    onExpandedChange: setExpanded,

    onRowSelectionChange: setRowSelection,

    /**
     * TanStack row.pin()/table.setRowPinning() must flow back into the
     * resource-owned controlled state.
     */
    onRowPinningChange: setRowPinning,

    /**
     * Same-query server-result replacement must not close the detail
     * panel. Semantic query transitions reset it explicitly above.
     */
    autoResetExpanded: false,

    columns,

    /**
     * TranslationKey.id is stable across pagination and refreshes.
     *
     * Never use the current row index as server-backed row identity.
     */
    getRowId: (row) => String(row.id),

    /**
     * ------------------------------------------------------------
     * Row selection
     * ------------------------------------------------------------
     *
     * Selection is opt-in for this resource slice. Multiple rows may
     * be selected for status/inspection, while mutation commands may
     * further narrow themselves to exactly one selected row.
     */
    enableRowSelection,

    /**
     * ------------------------------------------------------------
     * Row pinning — legacy MRT "select-sticky" parity
     * ------------------------------------------------------------
     *
     * The row pinning feature is now installed in the shared MUI table
     * family. TranslationKey opts into it by deriving pinned top rows from
     * its controlled selection state.
     *
     * keepPinnedRows=false is important for a manual/server table: a row
     * from another server page must never be resurrected into the current
     * render merely because an old ID was pinned.
     */
    enableRowPinning: enableRowSelection,
    keepPinnedRows: false,

    /**
     * ------------------------------------------------------------
     * Translation detail panel
     * ------------------------------------------------------------
     *
     * Every TranslationKey can expose its nested translations.
     *
     * This remains TanStack expansion state.
     *
     * It does NOT imply hierarchical subRows and does not issue
     * another request merely because a row expands.
     */
    getRowCanExpand: enableTranslationDetails ? () => true : undefined,

    /**
     * ------------------------------------------------------------
     * Sorting
     * ------------------------------------------------------------
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

    /**
     * Keep browser capability aligned with backend validation.
     */
    maxMultiSortColCount: 10,

    /**
     * ------------------------------------------------------------
     * Global search
     * ------------------------------------------------------------
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
     * ------------------------------------------------------------
     * Column filtering
     * ------------------------------------------------------------
     *
     * Phase 1.7.10.5:
     *
     * The resource-aware filter mappings are now complete:
     *
     *   key
     *       text -> contains
     *
     *   description
     *       text -> contains
     *
     *   category
     *       select<number> -> categoryId equals
     *
     *   locale
     *       select<string> -> locale equals
     */
    enableColumnFilters: true,

    /**
     * ------------------------------------------------------------
     * Resizing
     * ------------------------------------------------------------
    
     * TanStack logical resize direction should agree with the MUI
     * theme.
     *
     * Your renderer explicitly notes that this belongs at table
     * creation time rather than being mutated by the renderer.
     */
    columnResizeDirection: theme.direction,

    enableColumnPinning: true,

    /**
     * ------------------------------------------------------------
     * Utility-column logical pinning
     * ------------------------------------------------------------
     *
     * Utility columns use logical start/end rather than physical positions.
     *
     * LTR:
     *
     *   expansion -> left
     *   actions   -> right
     *
     * RTL:
     *
     *   expansion -> right
     *   actions   -> left
     *
     * No physical left/right assumptions enter the resource.
     */
    initialState:
      enableTranslationDetails || enableRowSelection || rowActions.length > 0
        ? {
            columnPinning: {
              /**
               * Keep utility columns in the same logical order as the
               * established MRT reference:
               *
               *   expansion -> selection
               *
               * Logical start automatically mirrors in RTL.
               */
              start: [
                ...(enableTranslationDetails
                  ? [DATA_TABLE_EXPANSION_COLUMN_ID]
                  : []),
                ...(enableRowSelection
                  ? [DATA_TABLE_SELECTION_COLUMN_ID]
                  : []),
              ],

              end: rowActions.length > 0 ? [DATA_TABLE_ACTIONS_COLUMN_ID] : [],
            },
          }
        : undefined,

    /**
     * ------------------------------------------------------------
     * Server-owned transformations
     * ------------------------------------------------------------
     *
     * These are also supplied by binding. Keeping them explicit here
     * documents the resource's contract.
     *
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

  /**
   * ================================================================
   * 8. Canonical server/live row-state safety
   * ================================================================
   *
   * TranslationKey uses cross-query stable selection identities.
   *
   * Therefore the current loaded page is authoritative for expansion, but is
   * NOT authoritative for rowSelection/rowPinning:
   *
   * - an ID missing after pagination may simply be on another page,
   * - an ID missing after filtering may simply be filtered out,
   * - an ID missing after sorting may simply have moved to another page.
   *
   * Known deletion is handled explicitly by the resource mutation command.
   * keepPinnedRows=false still prevents off-page pinned rows from being
   * rendered into the current page.
   *
   * Page-index recovery and expanded-row reconciliation remain enabled.
   */
  useDataTableLiveTableStateSafety({
    table,
    query,
    server,
    getRowId: (row) => row.id,
    enabled: true,
    reconcileRowSelection: false,
    reconcileRowPinning: false,
    reconcileExpanded: true,
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
     * ------------------------------------------------------------
     * Filter options
     * ------------------------------------------------------------
     */
    filterOptions,

    /**
     * Explicit reload without changing query state.
     */
    refresh:
      refine.request.refresh,
  };
}
