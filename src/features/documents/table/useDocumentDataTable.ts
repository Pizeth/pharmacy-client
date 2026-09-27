"use client";

// src/features/documents/table/useDocumentDataTable.ts

import type { HttpError } from "@refinedev/core";
import { useTheme } from "@mui/material";
import { useMemo } from "react";

import {
  createDataTableServerTableBinding,
  useDataTableServerState,
  useMuiDataTable,
  useRefineDataTableServerResult,
} from "@/components/DataTable";
import type {
  DataTableServerResultLifecycle,
  DataTableServerStateController,
  RefineDataTableUseListQueryOptions,
} from "@/components/DataTable";

import { createDocumentColumns } from "../columns";
import { documentRefineDataTableAdapter } from "../documentTableRefineAdapter";
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
    queryOptions: options.queryOptions,
    keepPreviousResult: true,
  });

  const binding = createDataTableServerTableBinding<DocumentRecord>({
    query,
    result: lifecycle.server,
  });

  const table = useMuiDataTable({
    ...binding,
    columns,

    getRowId: (row) => String(row.id),

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
      loading: lifecycle.server.isInitialLoading,
      error: lifecycle.server.blockingError
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

  return {
    table,
    query,
    server: lifecycle.server,
    refresh: lifecycle.request.refresh,
  };
}
