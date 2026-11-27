// src/components/DataTable/core/live/reconciliationTypes.ts

import type { RowData } from "@tanstack/table-core";

import type {
  DataTableServerQueryState,
} from "../server-state";
import type {
  DataTableServerResult,
} from "../server-data";

import type {
  DataTableLiveEvent,
  DataTableLiveIdentityInput,
  DataTableLiveRecordId,
  DataTableLiveUpdatedEvent,
} from "./types";

/**
 * The generic live layer deliberately exposes only two reconciliation
 * strategies for a matching resource event:
 *
 * - refetch:
 *     The current normalized result may no longer be correct.
 *
 * - reconcile:
 *     Correctness of an in-place normalized-result update has been proven.
 *
 * "Ignore" belongs to transport/subscription routing and duplicate-event
 * handling rather than result reconciliation itself.
 */
export type DataTableLiveReconciliationStrategy =
  | "refetch"
  | "reconcile";

/**
 * Explain why the conservative refetch path was selected.
 *
 * Keeping these reasons stable makes later bridges observable/testable without
 * teaching them how the policy was implemented.
 */
export type DataTableLiveRefetchReason =
  | "no-current-result"
  | "invalidate-event"
  | "created-event-affects-membership-or-pagination"
  | "deleted-event-affects-membership-or-pagination"
  | "missing-updated-record-payload"
  | "payload-record-id-mismatch"
  | "record-not-on-current-page"
  | "duplicate-record-id-on-current-page"
  | "updated-record-stability-unproven";

/**
 * Reason attached to the one local-reconciliation path established in 2.0.2.
 */
export type DataTableLiveReconcileReason =
  "updated-record-stability-proven";

export interface DataTableLiveRefetchDecision {
  readonly strategy: "refetch";
  readonly reason: DataTableLiveRefetchReason;
}

export interface DataTableLiveReconcileDecision<
  TData extends RowData,
> {
  readonly strategy: "reconcile";
  readonly reason: DataTableLiveReconcileReason;

  /**
   * New immutable normalized result.
   *
   * Pagination metadata is intentionally preserved exactly because this path is
   * only legal when query membership and row ordering are proven stable.
   */
  readonly result: DataTableServerResult<TData>;

  readonly recordId: DataTableLiveRecordId;
  readonly rowIndex: number;
}

export type DataTableLiveReconciliationDecision<
  TData extends RowData,
> =
  | DataTableLiveRefetchDecision
  | DataTableLiveReconcileDecision<TData>;

/**
 * Narrow context presented to a resource-specific update-stability proof.
 *
 * Returning true is a strong assertion. The callback must know that replacing
 * currentRow with nextRow:
 *
 * - keeps the row matched by the current filters/search,
 * - keeps the row at the same position for the current sort/server ordering,
 * - does not alter rowCount/pageCount/page membership.
 *
 * If any of those properties are uncertain, return false.
 */
export interface DataTableLiveUpdateReconciliationContext<
  TData extends RowData,
> {
  readonly event: DataTableLiveUpdatedEvent<TData>;
  readonly query: DataTableServerQueryState;
  readonly result: DataTableServerResult<TData>;

  readonly currentRow: TData;
  readonly nextRow: TData;
  readonly rowIndex: number;
}

/**
 * Resource-owned proof that one visible update is safe to apply locally.
 *
 * The generic layer intentionally cannot infer this from arbitrary field names.
 */
export type DataTableLiveUpdatedRecordStabilityProof<
  TData extends RowData,
> = (
  context: DataTableLiveUpdateReconciliationContext<TData>,
) => boolean;

export interface ReconcileDataTableLiveEventOptions<
  TData extends RowData,
> {
  readonly query: DataTableServerQueryState;

  /**
   * Current canonical normalized result for this exact query.
   *
   * Pass undefined when there is no canonical result yet. A preserved result
   * from another query should not be supplied as if it were current.
   */
  readonly result?: DataTableServerResult<TData>;

  readonly event: DataTableLiveEvent<TData>;

  /**
   * Extract the same stable record identity represented by event.recordId.
   *
   * Numeric resource IDs are accepted and normalized to the generic string
   * identity representation before comparison.
   */
  readonly getRowId: (
    row: TData,
  ) => DataTableLiveIdentityInput;

  /**
   * Optional proof enabling the only local patch supported by 2.0.2:
   * replacing one already-visible updated row in place.
   *
   * Omission is intentionally conservative and selects refetch.
   */
  readonly canReconcileUpdatedRecord?:
    DataTableLiveUpdatedRecordStabilityProof<TData>;
}
