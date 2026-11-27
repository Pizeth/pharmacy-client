// src/components/DataTable/core/live/types.ts

import type { RowData } from "@tanstack/table-core";

/**
 * Transport-independent realtime event kinds understood by DataTable
 * reconciliation policy.
 */
export type DataTableLiveEventType =
  | "created"
  | "updated"
  | "deleted"
  | "invalidate";

/**
 * Stable identities at the generic live boundary.
 *
 * Transport bridges normalize numeric/backend-specific identifiers before
 * creating these events so all later reconciliation compares one representation.
 */
export type DataTableLiveEventId = string;
export type DataTableLiveResourceId = string;
export type DataTableLiveRecordId = string;

export interface DataTableLiveEventBase {
  /**
   * Globally/transport-stably unique event identity used for duplicate-event
   * protection in later realtime phases.
   */
  readonly eventId: DataTableLiveEventId;

  /**
   * Resource identity, e.g. "translationKeys" or "documents".
   *
   * Generic DataTable does not interpret this string.
   */
  readonly resource: DataTableLiveResourceId;

  /**
   * Optional transport-independent ordering/version metadata.
   *
   * Reconciliation may use this when an adapter can prove ordering semantics,
   * but no generic transport is required to provide it.
   */
  readonly revision?: string | number;

  /**
   * Optional ISO timestamp for diagnostics/ordering hints.
   * It is not treated as authoritative ordering by the generic contract.
   */
  readonly occurredAt?: string;
}

export interface DataTableLiveCreatedEvent<TData extends RowData>
  extends DataTableLiveEventBase {
  readonly type: "created";
  readonly recordId: DataTableLiveRecordId;

  /**
   * Optional normalized row payload.
   *
   * Bridges that only know an identity can omit it; reconciliation then falls
   * back to invalidation/refetch.
   */
  readonly record?: TData;
}

export interface DataTableLiveUpdatedEvent<TData extends RowData>
  extends DataTableLiveEventBase {
  readonly type: "updated";
  readonly recordId: DataTableLiveRecordId;
  readonly record?: TData;
}

export interface DataTableLiveDeletedEvent
  extends DataTableLiveEventBase {
  readonly type: "deleted";
  readonly recordId: DataTableLiveRecordId;
}

export interface DataTableLiveInvalidateEvent
  extends DataTableLiveEventBase {
  readonly type: "invalidate";

  /**
   * Omitted means the current resource/query should be considered stale.
   * Present means one known record caused invalidation, while still allowing
   * refetch when local reconciliation cannot be proven safe.
   */
  readonly recordId?: DataTableLiveRecordId;
}

export type DataTableLiveEvent<TData extends RowData> =
  | DataTableLiveCreatedEvent<TData>
  | DataTableLiveUpdatedEvent<TData>
  | DataTableLiveDeletedEvent
  | DataTableLiveInvalidateEvent;

/**
 * Input accepted at a transport bridge before identity normalization.
 */
export type DataTableLiveIdentityInput = string | number;
