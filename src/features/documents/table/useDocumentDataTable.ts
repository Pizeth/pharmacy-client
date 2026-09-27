"use client";

// src/features/documents/table/useDocumentDataTable.ts

import type { HttpError } from "@refinedev/core";
import { useTheme } from "@mui/material";
import {
  useCallback,
  useMemo,
} from "react";

import {
  createDataTableServerTableBinding,
  removeDataTableLiveRecordFromTableState,
  useDataTableLiveServerResult,
  useDataTableLiveTableStateSafety,
  useDataTableServerState,
  useMuiDataTable,
  useRefineDataTableLiveSubscription,
  useRefineDataTableServerResult,
} from "@/components/DataTable";
import type {
  DataTableServerResultLifecycle,
  DataTableServerStateController,
  RefineDataTableUseListQueryOptions,
} from "@/components/DataTable";

import { createDocumentColumns } from "../columns";
import {
  DOCUMENT_REFINE_RESOURCE,
  documentRefineDataTableAdapter,
} from "../documentTableRefineAdapter";
import {
  canReconcileDocumentLiveUpdate,
  documentRefineLiveEventAdapter,
} from "../documentLiveAdapter";
import type { DocumentRecord } from "../types";

export interface UseDocumentDataTableOptions {
  /**
   * Refine/TanStack Query execution tuning only.
   *
   * Query semantics remain owned by documentTableSemanticQuery.
   */
  readonly queryOptions?: RefineDataTableUseListQueryOptions<
    DocumentRecord,
    HttpError
  >;

  /**
   * Enables the Refine LiveProvider subscription bridge.
   *
   * Default: true. With no Refine liveProvider installed this is inert.
   */
  readonly liveEnabled?: boolean;
}

export interface UseDocumentDataTableResult {
  readonly table: ReturnType<typeof useMuiDataTable<DocumentRecord>>;
  readonly query: DataTableServerStateController;
  readonly server: DataTableServerResultLifecycle<DocumentRecord>;
  readonly refresh: () => void;
}

/**
 * Complete second-resource controller proving the generic Refine lifecycle.
 *
 * Document semantic query
 *   -> Refine adapter
 *   -> useRefineDataTableServerResult
 *   -> generic server table binding
 *   -> useMuiDataTable
 *
 * The MUI renderer remains transport-independent.
 */
export function useDocumentDataTable(
  options: UseDocumentDataTableOptions = {},
): UseDocumentDataTableResult {
  const {
    queryOptions,
    liveEnabled = true,
  } = options;

  const theme = useTheme();

  const columns = useMemo(() => createDocumentColumns(), []);

  const query = useDataTableServerState({
    defaultPageSize: 25,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      sorting: [],
      columnFilters: [],
      globalFilter: "",
    },
    resetPageOnSortingChange: true,
    resetPageOnColumnFiltersChange: true,
    resetPageOnGlobalFilterChange: true,
  });

  const lifecycle = useRefineDataTableServerResult<DocumentRecord, HttpError>({
    query: query.state,
    adapter: documentRefineDataTableAdapter,
    queryOptions,
    keepPreviousResult: true,
  });

  /**
   * Generic normalized-live execution layer.
   *
   * A proven visible-row update can be overlaid locally. Every ambiguous event
   * executes the existing Refine refresh command.
   */
  const live = useDataTableLiveServerResult<DocumentRecord>({
    resource: DOCUMENT_REFINE_RESOURCE,
    query: query.state,
    server: lifecycle.server,
    refresh: lifecycle.request.refresh,
    getRowId: (row) => row.id,
    canReconcileUpdatedRecord:
      canReconcileDocumentLiveUpdate,
  });

  const binding = createDataTableServerTableBinding<DocumentRecord>({
    query,
    result: live.server,
  });

  const table = useMuiDataTable({
    ...binding,
    columns,

    getRowId: (row) => String(row.id),

    /**
     * Realtime state-safety proof uses real TanStack selection/pinning state.
     * These capabilities remain independent of whether a particular renderer
     * exposes controls for them.
     */
    enableRowSelection: true,
    enableRowPinning: true,
    keepPinnedRows: false,

    enableSorting: true,
    enableMultiSort: true,
    maxMultiSortColCount: 10,

    enableGlobalFilter: true,
    enableColumnFilters: true,

    enableColumnPinning: true,
    columnResizeDirection: theme.direction,

    /**
     * Use the renderer's generic body-state slots for this resource.
     *
     * A blocking error is intentionally rendered as presentation text rather
     * than passing an Error object into React.
     */
    meta: {
      loading: live.server.isInitialLoading,
      error: live.server.blockingError
        ? "Unable to load documents."
        : undefined,
      emptyContent: "No documents to display.",
      noResultsContent: "No documents match the current search or filters.",
    },

    /**
     * The binding already supplies these flags. Repeating them documents the
     * resource contract: server/provider transformations always win.
     */
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  /**
   * Canonical-result settlement reconciles stale selected/pinned/expanded IDs
   * and recovers an out-of-range page after live count changes.
   */
  useDataTableLiveTableStateSafety({
    table,
    query,
    server: live.server,
    getRowId: (row) => row.id,
  });

  const onLiveEvent = useCallback(
    (
      event: Parameters<
        typeof live.handleEvent
      >[0],
    ): void => {
      const handled =
        live.handleEvent(event);

      /**
       * Remove a known deleted ID immediately, before the asynchronous refetch
       * settles. Resource mismatch/duplicate events must not mutate state.
       */
      if (
        event.type === "deleted" &&
        handled.status !== "ignored"
      ) {
        removeDataTableLiveRecordFromTableState({
          table,
          recordId: event.recordId,
        });
      }
    },
    [
      live.handleEvent,
      table,
    ],
  );

  useRefineDataTableLiveSubscription<DocumentRecord>({
    adapter: documentRefineLiveEventAdapter,
    enabled: liveEnabled,
    onEvent: onLiveEvent,
  });

  return {
    table,
    query,
    server: live.server,
    refresh: lifecycle.request.refresh,
  };
}
