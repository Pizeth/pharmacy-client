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
  useDataTableServerResult,
  useDataTableServerState,
  useMuiDataTable,
} from "@/components/DataTable";
import type {
  DataTableServerResultLifecycle,
  DataTableServerStateController,
} from "@/components/DataTable";
import { createTranslationKeyColumns } from "../columns";
import type { TranslationKey } from "../schemas";
import { useTranslationKeyDataTableRequest } from "./useTranslationKeyDataTableRequest";
import { useTranslationKeyFilterOptions } from "./useTranslationKeyFilterOptions";
import type { TranslationKeyFilterOptionsState } from "./useTranslationKeyFilterOptions";
import type { DataTableRowAction } from "@/components/DataTable/mui/columns/actions";
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "@/components/DataTable/mui/columns/actions";
import { DATA_TABLE_EXPANSION_COLUMN_ID } from "@/components/DataTable/mui/columns/expansion";
import { DATA_TABLE_SELECTION_COLUMN_ID } from "@/components/DataTable/mui/columns/selection";

export interface UseTranslationKeyDataTableOptions {
  readonly rowActions?: readonly DataTableRowAction<TranslationKey>[];

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
   * Server-backed row selection is page/query-context local.
   *
   * A same-query mutation refresh preserves the selected record so an
   * edit can refresh canonical data without surprising deselection.
   *
   * A semantic query transition clears selection so stale/off-page IDs
   * cannot accidentally authorize resource mutation commands.
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
   * 4. Execute TranslationKey resource query
   * --------------------------------------------------------------
   */
  /**
   * Query state changes establish a different server-result context.
   *
   * Reset expansion for:
   *
   * - pagination
   * - sorting
   * - column filtering
   * - global search
   * - explicit query replacement/reset
   *
   * request.refresh() deliberately leaves query.state unchanged, so
   * nested TranslationValue mutations preserve the expanded key while
   * canonical server data replaces row.original.translations.
   */
  useEffect(() => {
    setExpanded({});
    setRowSelection({});
    setRowPinning({
      top: [],
      bottom: [],
    });
  }, [query.state]);

  const request = useTranslationKeyDataTableRequest(query.state);

  /**
   * ================================================================
   * 5. Generic server-result lifecycle
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
     * Preserve current rows while:
     *
     * - sorting
     * - filtering
     * - searching
     * - paginating
     * - refreshing
     */
    keepPreviousResult: true,
  });

  /**
   * Reconcile selection only after the current query has a canonical
   * server result.
   *
   * Same-query mutation refreshes intentionally preserve selection
   * while the previous result is displayed. Once the replacement
   * result arrives, IDs no longer present on the loaded server page are
   * removed.
   *
   * This prevents a successful edit which changes filter/sort/page
   * membership from leaving an off-page ID selected and appearing to
   * authorize a mutation command for data no longer loaded.
   */
  useEffect(() => {
    if (
      !enableRowSelection ||
      !server.hasResult ||
      server.isPreviousResult ||
      server.isFetching
    ) {
      return;
    }

    const loadedRowIds = new Set(server.rows.map((row) => String(row.id)));

    setRowSelection((previous) => {
      let changed = false;
      const next: RowSelectionState = {};

      for (const [rowId, selected] of Object.entries(previous)) {
        if (selected && loadedRowIds.has(rowId)) {
          next[rowId] = true;
        } else if (selected) {
          changed = true;
        }
      }

      return changed ? next : previous;
    });
  }, [
    enableRowSelection,
    server.hasResult,
    server.isPreviousResult,
    server.isFetching,
    server.rows,
  ]);

  /**
   * Reconcile row pinning against the canonical loaded server page.
   *
   * keepPinnedRows=false prevents off-page rows from being resurrected by
   * TanStack, but controlled pinning state should still discard stale IDs once
   * the replacement result settles.
   *
   * This mirrors the selection cleanup above while keeping both state machines
   * independently correct.
   */
  useEffect(() => {
    if (
      !enableRowSelection ||
      !server.hasResult ||
      server.isPreviousResult ||
      server.isFetching
    ) {
      return;
    }

    const loadedRowIds = new Set(server.rows.map((row) => String(row.id)));

    setRowPinning((previous) => {
      const top = (previous.top ?? []).filter((rowId) =>
        loadedRowIds.has(rowId),
      );

      const bottom = (previous.bottom ?? []).filter((rowId) =>
        loadedRowIds.has(rowId),
      );

      const unchanged =
        top.length === (previous.top?.length ?? 0) &&
        bottom.length === (previous.bottom?.length ?? 0);

      return unchanged
        ? previous
        : {
            top,
            bottom,
          };
    });
  }, [
    enableRowSelection,
    server.hasResult,
    server.isPreviousResult,
    server.isFetching,
    server.rows,
  ]);

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
    refresh: request.refresh,
  };
}
