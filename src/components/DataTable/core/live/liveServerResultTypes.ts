// src/components/DataTable/core/live/liveServerResultTypes.ts

import type { RowData } from "@tanstack/table-core";

import type {
  DataTableServerQueryState,
} from "../server-state";
import type {
  DataTableServerResultLifecycle,
} from "../server-data";

import type {
  DataTableLiveEvent,
  DataTableLiveIdentityInput,
  DataTableLiveResourceId,
} from "./types";
import type {
  DataTableLiveReconcileDecision,
  DataTableLiveRefetchDecision,
  DataTableLiveUpdatedRecordStabilityProof,
} from "./reconciliationTypes";

export type DataTableLiveEventIgnoreReason =
  | "resource-mismatch"
  | "duplicate-event";

export interface DataTableLiveIgnoredEventResult {
  readonly status: "ignored";
  readonly reason: DataTableLiveEventIgnoreReason;
}

export interface DataTableLiveRefetchEventResult {
  readonly status: "refetch";
  readonly decision: DataTableLiveRefetchDecision;
}

export interface DataTableLiveReconciledEventResult<
  TData extends RowData,
> {
  readonly status: "reconciled";
  readonly decision: DataTableLiveReconcileDecision<TData>;
}

export type DataTableLiveEventHandlingResult<
  TData extends RowData,
> =
  | DataTableLiveIgnoredEventResult
  | DataTableLiveRefetchEventResult
  | DataTableLiveReconciledEventResult<TData>;

export interface DataTableLiveEventDeduplicator {
  readonly accept: (
    event: DataTableLiveEvent<RowData>,
  ) => boolean;
  readonly clear: () => void;
  readonly size: () => number;
}

export interface CreateDataTableLiveEventDeduplicatorOptions {
  /**
   * Bounded FIFO history prevents an indefinitely mounted table from retaining
   * every event ID it has ever observed.
   *
   * Default: 512.
   */
  readonly maxEntries?: number;
}

export interface UseDataTableLiveServerResultOptions<
  TData extends RowData,
> {
  readonly resource:
    | DataTableLiveResourceId
    | DataTableLiveIdentityInput;

  readonly query: DataTableServerQueryState;
  readonly server: DataTableServerResultLifecycle<TData>;

  readonly refresh: () => void;

  readonly getRowId: (
    row: TData,
  ) => DataTableLiveIdentityInput;

  readonly canReconcileUpdatedRecord?:
    DataTableLiveUpdatedRecordStabilityProof<TData>;

  readonly maxDeduplicationEntries?: number;
}

export interface UseDataTableLiveServerResultValue<
  TData extends RowData,
> {
  /**
   * Presentation-ready lifecycle with any proven live row overlay applied.
   */
  readonly server: DataTableServerResultLifecycle<TData>;

  /**
   * Execute one already-normalized generic live event.
   */
  readonly handleEvent: (
    event: DataTableLiveEvent<TData>,
  ) => DataTableLiveEventHandlingResult<TData>;

  /**
   * Primarily useful after an explicit session boundary.
   *
   * Normal transport reconnects deliberately do NOT clear event history, so a
   * redelivered event remains deduplicated.
   */
  readonly clearEventHistory: () => void;
}
