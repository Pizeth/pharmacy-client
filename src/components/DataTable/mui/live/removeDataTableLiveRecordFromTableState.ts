// src/components/DataTable/mui/live/removeDataTableLiveRecordFromTableState.ts

import type { RowData } from "@tanstack/table-core";

import {
  removeDataTableLiveRecordFromExpanded,
  removeDataTableLiveRecordFromRowPinning,
  removeDataTableLiveRecordFromRowSelection,
} from "./tableStateSafety";
import type {
  RemoveDataTableLiveRecordFromTableStateOptions,
} from "./tableStateSafetyTypes";

/**
 * Immediately remove a known-deleted stable record ID from identity-bearing
 * TanStack state before the refetch strategy completes.
 *
 * This is intentionally separate from request execution. The future transport
 * bridge may call it as soon as a normalized "deleted" event arrives, closing
 * the window in which stale selection could authorize a resource mutation.
 */
export function removeDataTableLiveRecordFromTableState<
  TData extends RowData,
>(
  options: RemoveDataTableLiveRecordFromTableStateOptions<TData>,
): void {
  const {
    table,
    recordId,
    rowSelection = true,
    rowPinning = true,
    expanded = true,
  } = options;

  if (rowSelection) {
    table.setRowSelection((previous) =>
      removeDataTableLiveRecordFromRowSelection(
        previous,
        recordId,
      ),
    );
  }

  if (rowPinning) {
    table.setRowPinning((previous) =>
      removeDataTableLiveRecordFromRowPinning(
        previous,
        recordId,
      ),
    );
  }

  if (expanded) {
    table.setExpanded((previous) =>
      removeDataTableLiveRecordFromExpanded(
        previous,
        recordId,
      ),
    );
  }
}
