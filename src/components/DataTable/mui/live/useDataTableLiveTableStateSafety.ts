"use client";

// src/components/DataTable/mui/live/useDataTableLiveTableStateSafety.ts

import { useEffect } from "react";
import type { RowData } from "@tanstack/table-core";

import {
  createDataTableLiveVisibleRowIdSet,
  reconcileDataTableLiveExpanded,
  reconcileDataTableLiveRowPinning,
  reconcileDataTableLiveRowSelection,
  resolveDataTableLiveSafePageIndex,
} from "./tableStateSafety";
import type {
  UseDataTableLiveTableStateSafetyOptions,
} from "./tableStateSafetyTypes";

/**
 * Reconcile row-identity-bearing TanStack state only after a canonical server
 * result for the current query has settled.
 *
 * Background fetching/previous-result presentation is deliberately excluded:
 * usable prior rows remain interactive while a replacement request is in
 * flight, and stale IDs are removed only when the canonical replacement is
 * known.
 *
 * The hook also recovers an out-of-range page after live create/delete activity
 * changes pageCount. It never resets a still-valid current page.
 */
export function useDataTableLiveTableStateSafety<
  TData extends RowData,
>(
  options: UseDataTableLiveTableStateSafetyOptions<TData>,
): void {
  const {
    table,
    query,
    server,
    getRowId,
    enabled = true,
    reconcileRowSelection = true,
    reconcileRowPinning = true,
    reconcileExpanded = true,
    recoverOutOfRangePage = true,
  } = options;

  useEffect(() => {
    if (
      !enabled ||
      !server.hasResult ||
      server.isPreviousResult ||
      server.isFetching
    ) {
      return;
    }

    const visibleRowIds =
      createDataTableLiveVisibleRowIdSet(
        server.rows,
        getRowId,
      );

    if (reconcileRowSelection) {
      table.setRowSelection((previous) =>
        reconcileDataTableLiveRowSelection(
          previous,
          visibleRowIds,
        ),
      );
    }

    if (reconcileRowPinning) {
      table.setRowPinning((previous) =>
        reconcileDataTableLiveRowPinning(
          previous,
          visibleRowIds,
        ),
      );
    }

    if (reconcileExpanded) {
      table.setExpanded((previous) =>
        reconcileDataTableLiveExpanded(
          previous,
          visibleRowIds,
        ),
      );
    }

    if (recoverOutOfRangePage) {
      const currentPageIndex =
        query.state.pagination.pageIndex;

      const safePageIndex =
        resolveDataTableLiveSafePageIndex(
          currentPageIndex,
          server.pagination.pageCount,
        );

      if (safePageIndex !== currentPageIndex) {
        query.onPaginationChange((previous) => ({
          ...previous,
          pageIndex: safePageIndex,
        }));
      }
    }
  }, [
    enabled,
    getRowId,
    query,
    reconcileExpanded,
    reconcileRowPinning,
    reconcileRowSelection,
    recoverOutOfRangePage,
    server.hasResult,
    server.isFetching,
    server.isPreviousResult,
    server.pagination.pageCount,
    server.rows,
    table,
  ]);
}
