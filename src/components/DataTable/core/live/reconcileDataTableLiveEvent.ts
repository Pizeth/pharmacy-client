// src/components/DataTable/core/live/reconcileDataTableLiveEvent.ts

import type { RowData } from "@tanstack/table-core";

import {
  normalizeDataTableLiveRecordId,
} from "./createDataTableLiveEvent";
import type {
  DataTableLiveReconciliationDecision,
  ReconcileDataTableLiveEventOptions,
} from "./reconciliationTypes";

/**
 * Decide whether one normalized live event can be applied to the current
 * normalized server result without making that result semantically incorrect.
 *
 * This function is pure:
 *
 * - no React state,
 * - no request execution,
 * - no query invalidation side effect,
 * - no transport knowledge,
 * - no mutation of the supplied result.
 *
 * The caller owns execution of the returned strategy.
 */
export function reconcileDataTableLiveEvent<
  TData extends RowData,
>(
  options: ReconcileDataTableLiveEventOptions<TData>,
): DataTableLiveReconciliationDecision<TData> {
  const {
    query,
    result,
    event,
    getRowId,
    canReconcileUpdatedRecord,
  } = options;

  /**
   * There is nothing canonical to patch before the current query has produced
   * a normalized result.
   */
  if (result === undefined) {
    return {
      strategy: "refetch",
      reason: "no-current-result",
    };
  }

  /**
   * Invalidation explicitly says the current server query is stale.
   */
  if (event.type === "invalidate") {
    return {
      strategy: "refetch",
      reason: "invalidate-event",
    };
  }

  /**
   * A create can change:
   *
   * - total row count,
   * - page count,
   * - current-page membership,
   * - server ordering.
   *
   * Appending/prepending locally is therefore not generically safe.
   */
  if (event.type === "created") {
    return {
      strategy: "refetch",
      reason: "created-event-affects-membership-or-pagination",
    };
  }

  /**
   * A delete can require pulling a row from the following page and always
   * changes total-count semantics. Removing the visible row alone could leave
   * an under-filled or invalid page.
   */
  if (event.type === "deleted") {
    return {
      strategy: "refetch",
      reason: "deleted-event-affects-membership-or-pagination",
    };
  }

  /**
   * From here the event is narrowed to "updated".
   *
   * Identity-only update events cannot be patched locally because there is no
   * normalized replacement row.
   */
  const nextRow = event.record;

  if (nextRow === undefined) {
    return {
      strategy: "refetch",
      reason: "missing-updated-record-payload",
    };
  }

  const payloadRecordId = normalizeDataTableLiveRecordId(
    getRowId(nextRow),
  );

  /**
   * Refuse a payload whose identity disagrees with the envelope.
   *
   * Silently applying it would be substantially worse than a refetch.
   */
  if (payloadRecordId !== event.recordId) {
    return {
      strategy: "refetch",
      reason: "payload-record-id-mismatch",
    };
  }

  const matchingIndexes: number[] = [];

  for (
    let rowIndex = 0;
    rowIndex < result.rows.length;
    rowIndex += 1
  ) {
    const currentRecordId = normalizeDataTableLiveRecordId(
      getRowId(result.rows[rowIndex]),
    );

    if (currentRecordId === event.recordId) {
      matchingIndexes.push(rowIndex);
    }
  }

  /**
   * An update for a row not currently visible is still ambiguous:
   *
   * - it may now match the active query,
   * - it may have moved onto this page because a sort key changed,
   * - it may displace another row.
   *
   * Refetch rather than assuming "not visible" means "irrelevant".
   */
  if (matchingIndexes.length === 0) {
    return {
      strategy: "refetch",
      reason: "record-not-on-current-page",
    };
  }

  /**
   * Duplicate stable identities violate the assumptions required for a precise
   * in-place replacement. Preserve correctness by falling back to refetch.
   */
  if (matchingIndexes.length > 1) {
    return {
      strategy: "refetch",
      reason: "duplicate-record-id-on-current-page",
    };
  }

  const rowIndex = matchingIndexes[0];
  const currentRow = result.rows[rowIndex];

  /**
   * The generic layer does not know resource field semantics.
   *
   * Even for an already-visible row, an update may alter an active filter,
   * global-search field, sort key, or backend-specific default ordering.
   *
   * Local replacement therefore requires an explicit resource proof.
   */
  const stable =
    canReconcileUpdatedRecord?.({
      event,
      query,
      result,
      currentRow,
      nextRow,
      rowIndex,
    }) ?? false;

  if (!stable) {
    return {
      strategy: "refetch",
      reason: "updated-record-stability-unproven",
    };
  }

  const rows = result.rows.slice();

  rows[rowIndex] = nextRow;

  return {
    strategy: "reconcile",
    reason: "updated-record-stability-proven",
    recordId: event.recordId,
    rowIndex,
    result: {
      rows,
      pagination: result.pagination,
    },
  };
}
