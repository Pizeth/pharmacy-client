"use client";

import { useTheme } from "@mui/material";

import {
  createDataTableServerTableBinding,
  useDataTableServerState,
  useMuiDataTable,
  useRefineDataTableServerResult,
} from "@/components/DataTable";
import type {
  DataTableServerResultLifecycle,
  DataTableServerStateController,
} from "@/components/DataTable";
import { documentColumns } from "./documentColumns";
import { documentTableRefineAdapter } from "./documentTableQuery";
import type { DocumentTableRecord } from "./types";

export interface UseDocumentRefineDataTableResult {
  readonly table: ReturnType<
    typeof useMuiDataTable<DocumentTableRecord>
  >;
  readonly query: DataTableServerStateController;
  readonly server: DataTableServerResultLifecycle<DocumentTableRecord>;
  readonly refresh: () => void;
}

/**
 * Second-resource proof for the DataTable + Refine architecture.
 *
 * End-to-end path:
 *
 *   TanStack state
 *        ↓
 *   DataTableServerQueryState
 *        ↓
 *   documentTableSemanticQuery
 *        ↓
 *   Refine GetListParams
 *        ↓
 *   Refine data provider
 *        ↓
 *   normalized DataTableServerResult
 *        ↓
 *   generic lifecycle
 *        ↓
 *   useMuiDataTable()
 *
 * No Refine type or hook enters the generic MUI renderer.
 */
export function useDocumentRefineDataTable():
  UseDocumentRefineDataTableResult {
  const theme = useTheme();

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

  const lifecycle = useRefineDataTableServerResult<
    DocumentTableRecord
  >({
    query: query.state,
    adapter: documentTableRefineAdapter,

    /**
     * Previous-result preservation is owned by the generic DataTable lifecycle,
     * not React Query placeholderData.
     */
    keepPreviousResult: true,
  });

  const binding =
    createDataTableServerTableBinding<DocumentTableRecord>({
      query,
      result: lifecycle.server,
    });

  const table = useMuiDataTable({
    ...binding,
    columns: documentColumns,

    /**
     * Stable API identity is mandatory for server-backed rows.
     */
    getRowId: (row) => String(row.id),

    enableSorting: true,
    enableMultiSort: true,
    maxMultiSortColCount: 10,

    enableGlobalFilter: true,
    enableColumnFilters: true,

    enableColumnPinning: true,
    columnResizeDirection: theme.direction,

    /**
     * These are supplied by the binding as well. Repeating them here documents
     * that a Refine-backed resource still delegates transformations to its
     * server/provider rather than the currently loaded page.
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
