// src/components/DataTable/core/live/tableStateSafetyTypes.ts

import type {
  ExpandedState,
  RowData,
  RowPinningState,
  RowSelectionState,
  Updater,
} from "@tanstack/table-core";

import type {
  DataTableServerResultLifecycle,
} from "../server-data";
import type {
  DataTableServerStateController,
} from "../server-state";

import type {
  DataTableLiveIdentityInput,
  DataTableLiveRecordId,
} from "./types";

/**
 * Narrow table capability used by live row-identity safety.
 *
 * The core live layer does not depend on the MUI table instance. Any TanStack
 * table family implementing these setters satisfies this contract
 * structurally.
 */
export interface DataTableLiveTableStateTarget {
  readonly setRowSelection: (
    updater:
      Updater<RowSelectionState>,
  ) => void;

  readonly setRowPinning: (
    updater:
      Updater<RowPinningState>,
  ) => void;

  readonly setExpanded: (
    updater:
      Updater<ExpandedState>,
  ) => void;
}

export interface DataTableLiveTableStateSnapshot {
  readonly rowSelection:
    RowSelectionState;
  readonly rowPinning:
    RowPinningState;
  readonly expanded:
    ExpandedState;
}

export interface DataTableLiveTableStateSafetyResult
  extends DataTableLiveTableStateSnapshot {
  readonly rowSelectionChanged: boolean;
  readonly rowPinningChanged: boolean;
  readonly expandedChanged: boolean;
}

export interface UseDataTableLiveTableStateSafetyOptions<
  TData extends RowData,
> {
  readonly table:
    DataTableLiveTableStateTarget;
  readonly query:
    DataTableServerStateController;
  readonly server:
    DataTableServerResultLifecycle<TData>;

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
  readonly table:
    DataTableLiveTableStateTarget;
  readonly recordId:
    DataTableLiveRecordId;

  readonly rowSelection?: boolean;
  readonly rowPinning?: boolean;
  readonly expanded?: boolean;
}
