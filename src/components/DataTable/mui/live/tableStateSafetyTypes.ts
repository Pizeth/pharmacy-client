// src/components/DataTable/mui/live/tableStateSafetyTypes.ts

import type {
  ExpandedState,
  RowPinningState,
  RowSelectionState,
  RowData,
} from "@tanstack/table-core";

import type {
  DataTableServerResultLifecycle,
} from "../server-data";
import type {
  DataTableServerStateController,
} from "../server-state";
import type {
  MuiDataTableInstance,
} from "../table";

import type {
  DataTableLiveIdentityInput,
  DataTableLiveRecordId,
} from "./types";

export interface DataTableLiveTableStateSnapshot {
  readonly rowSelection: RowSelectionState;
  readonly rowPinning: RowPinningState;
  readonly expanded: ExpandedState;
}

export interface DataTableLiveTableStateSafetyResult
  extends DataTableLiveTableStateSnapshot {
  readonly rowSelectionChanged: boolean;
  readonly rowPinningChanged: boolean;
  readonly expandedChanged: boolean;
}

/**
 * Generic server/live table-state safety hook options.
 *
 * The default policy treats selection, pinning and expansion as loaded-page
 * state. Individual families may be disabled if a future resource explicitly
 * implements a different cross-page contract.
 */
export interface UseDataTableLiveTableStateSafetyOptions<
  TData extends RowData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly query: DataTableServerStateController;
  readonly server: DataTableServerResultLifecycle<TData>;

  readonly getRowId: (
    row: TData,
  ) => DataTableLiveIdentityInput;

  readonly enabled?: boolean;
  readonly reconcileRowSelection?: boolean;
  readonly reconcileRowPinning?: boolean;
  readonly reconcileExpanded?: boolean;
  readonly recoverOutOfRangePage?: boolean;
}

export interface RemoveDataTableLiveRecordFromTableStateOptions<
  TData extends RowData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly recordId: DataTableLiveRecordId;

  readonly rowSelection?: boolean;
  readonly rowPinning?: boolean;
  readonly expanded?: boolean;
}
