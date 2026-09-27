// src/components/DataTable/mui/live/tableStateSafety.ts

import type {
  ExpandedState,
  RowPinningState,
  RowSelectionState,
} from "@tanstack/table-core";

import {
  normalizeDataTableLiveRecordId,
} from "./createDataTableLiveEvent";
import type {
  DataTableLiveTableStateSafetyResult,
  DataTableLiveTableStateSnapshot,
} from "./tableStateSafetyTypes";
import type {
  DataTableLiveIdentityInput,
  DataTableLiveRecordId,
} from "./types";

export function createDataTableLiveVisibleRowIdSet<TData>(
  rows: readonly TData[],
  getRowId: (row: TData) => DataTableLiveIdentityInput,
): ReadonlySet<DataTableLiveRecordId> {
  return new Set(
    rows.map((row) =>
      normalizeDataTableLiveRecordId(getRowId(row)),
    ),
  );
}

export function reconcileDataTableLiveRowSelection(
  previous: RowSelectionState,
  visibleRowIds: ReadonlySet<DataTableLiveRecordId>,
): RowSelectionState {
  let changed = false;

  const next: RowSelectionState = {};

  for (const [rowId, selected] of Object.entries(previous)) {
    if (
      selected &&
      visibleRowIds.has(
        normalizeDataTableLiveRecordId(rowId),
      )
    ) {
      next[rowId] = true;
    } else {
      changed = true;
    }
  }

  return changed ? next : previous;
}

function filterPinnedRowIds(
  rowIds: readonly string[] | undefined,
  visibleRowIds: ReadonlySet<DataTableLiveRecordId>,
): readonly string[] | undefined {
  if (rowIds === undefined) {
    return undefined;
  }

  const next = rowIds.filter((rowId) =>
    visibleRowIds.has(
      normalizeDataTableLiveRecordId(rowId),
    ),
  );

  return next.length === rowIds.length
    ? rowIds
    : next;
}

export function reconcileDataTableLiveRowPinning(
  previous: RowPinningState,
  visibleRowIds: ReadonlySet<DataTableLiveRecordId>,
): RowPinningState {
  const top = filterPinnedRowIds(
    previous.top,
    visibleRowIds,
  );

  const bottom = filterPinnedRowIds(
    previous.bottom,
    visibleRowIds,
  );

  if (
    top === previous.top &&
    bottom === previous.bottom
  ) {
    return previous;
  }

  return {
    ...previous,
    ...(top !== undefined ? { top: [...top] } : {}),
    ...(bottom !== undefined
      ? { bottom: [...bottom] }
      : {}),
  };
}

export function reconcileDataTableLiveExpanded(
  previous: ExpandedState,
  visibleRowIds: ReadonlySet<DataTableLiveRecordId>,
): ExpandedState {
  /**
   * TanStack's boolean true means "all rows expanded".
   *
   * It contains no stale row identity to remove and therefore remains valid
   * across same-query normalized-result replacement.
   */
  if (previous === true) {
    return previous;
  }

  let changed = false;

  const next: Record<string, boolean> = {};

  for (const [rowId, expanded] of Object.entries(previous)) {
    if (
      expanded &&
      visibleRowIds.has(
        normalizeDataTableLiveRecordId(rowId),
      )
    ) {
      next[rowId] = true;
    } else {
      changed = true;
    }
  }

  return changed ? next : previous;
}

/**
 * Pure loaded-page state reconciliation.
 *
 * This does not execute table setters. It makes the safety policy independently
 * testable and preserves object identity for unchanged state families.
 */
export function reconcileDataTableLiveTableState(
  previous: DataTableLiveTableStateSnapshot,
  visibleRowIds: ReadonlySet<DataTableLiveRecordId>,
): DataTableLiveTableStateSafetyResult {
  const rowSelection =
    reconcileDataTableLiveRowSelection(
      previous.rowSelection,
      visibleRowIds,
    );

  const rowPinning =
    reconcileDataTableLiveRowPinning(
      previous.rowPinning,
      visibleRowIds,
    );

  const expanded =
    reconcileDataTableLiveExpanded(
      previous.expanded,
      visibleRowIds,
    );

  return {
    rowSelection,
    rowPinning,
    expanded,
    rowSelectionChanged:
      rowSelection !== previous.rowSelection,
    rowPinningChanged:
      rowPinning !== previous.rowPinning,
    expandedChanged:
      expanded !== previous.expanded,
  };
}

export function removeDataTableLiveRecordFromRowSelection(
  previous: RowSelectionState,
  recordId: DataTableLiveRecordId,
): RowSelectionState {
  if (!previous[recordId]) {
    return previous;
  }

  const next = {
    ...previous,
  };

  delete next[recordId];

  return next;
}

function removePinnedRecordId(
  rowIds: readonly string[] | undefined,
  recordId: DataTableLiveRecordId,
): readonly string[] | undefined {
  if (
    rowIds === undefined ||
    !rowIds.includes(recordId)
  ) {
    return rowIds;
  }

  return rowIds.filter((rowId) => rowId !== recordId);
}

export function removeDataTableLiveRecordFromRowPinning(
  previous: RowPinningState,
  recordId: DataTableLiveRecordId,
): RowPinningState {
  const top = removePinnedRecordId(
    previous.top,
    recordId,
  );

  const bottom = removePinnedRecordId(
    previous.bottom,
    recordId,
  );

  if (
    top === previous.top &&
    bottom === previous.bottom
  ) {
    return previous;
  }

  return {
    ...previous,
    ...(top !== undefined ? { top: [...top] } : {}),
    ...(bottom !== undefined
      ? { bottom: [...bottom] }
      : {}),
  };
}

export function removeDataTableLiveRecordFromExpanded(
  previous: ExpandedState,
  recordId: DataTableLiveRecordId,
): ExpandedState {
  if (previous === true || !previous[recordId]) {
    return previous;
  }

  const next = {
    ...previous,
  };

  delete next[recordId];

  return next;
}

/**
 * Resolve a server page that remains valid after live data changes total pages.
 *
 * Unknown pageCount (-1) preserves the current page. Empty results recover to
 * page zero. Otherwise pageIndex is clamped to the last valid server page.
 */
export function resolveDataTableLiveSafePageIndex(
  pageIndex: number,
  pageCount: number,
): number {
  if (pageCount < 0) {
    return pageIndex;
  }

  if (pageCount === 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(pageIndex, pageCount - 1),
  );
}
