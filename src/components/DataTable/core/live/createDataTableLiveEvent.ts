// src/components/DataTable/core/live/createDataTableLiveEvent.ts

import type { RowData } from "@tanstack/table-core";

import type {
  DataTableLiveEvent,
  DataTableLiveEventId,
  DataTableLiveIdentityInput,
  DataTableLiveRecordId,
  DataTableLiveResourceId,
} from "./types";

export interface CreateDataTableLiveEventInput<TData extends RowData> {
  readonly type: DataTableLiveEvent<TData>["type"];
  readonly eventId: DataTableLiveIdentityInput;
  readonly resource: DataTableLiveIdentityInput;
  readonly recordId?: DataTableLiveIdentityInput;
  readonly record?: TData;
  readonly revision?: string | number;
  readonly occurredAt?: string;
}

function normalizeRequiredIdentity(
  value: DataTableLiveIdentityInput,
  label: string,
): string {
  const normalized = String(value).trim();

  if (normalized.length === 0) {
    throw new Error(`${label} must not be empty.`);
  }

  return normalized;
}

export function normalizeDataTableLiveEventId(
  value: DataTableLiveIdentityInput,
): DataTableLiveEventId {
  return normalizeRequiredIdentity(value, "DataTable live eventId");
}

export function normalizeDataTableLiveResourceId(
  value: DataTableLiveIdentityInput,
): DataTableLiveResourceId {
  return normalizeRequiredIdentity(value, "DataTable live resource");
}

export function normalizeDataTableLiveRecordId(
  value: DataTableLiveIdentityInput,
): DataTableLiveRecordId {
  return normalizeRequiredIdentity(value, "DataTable live recordId");
}

/**
 * Create one normalized transport-independent event.
 *
 * This helper intentionally does not perform reconciliation or network work.
 * It is the boundary transport bridges use before handing live events to the
 * generic policy layer.
 */
export function createDataTableLiveEvent<TData extends RowData>(
  input: CreateDataTableLiveEventInput<TData>,
): DataTableLiveEvent<TData> {
  const base = {
    eventId: normalizeDataTableLiveEventId(input.eventId),
    resource: normalizeDataTableLiveResourceId(input.resource),
    ...(input.revision !== undefined
      ? { revision: input.revision }
      : {}),
    ...(input.occurredAt !== undefined
      ? { occurredAt: input.occurredAt }
      : {}),
  };

  if (input.type === "invalidate") {
    return {
      ...base,
      type: "invalidate",
      ...(input.recordId !== undefined
        ? {
            recordId: normalizeDataTableLiveRecordId(
              input.recordId,
            ),
          }
        : {}),
    };
  }

  if (input.recordId === undefined) {
    throw new Error(
      `DataTable live ${input.type} event requires recordId.`,
    );
  }

  const recordId = normalizeDataTableLiveRecordId(
    input.recordId,
  );

  if (input.type === "deleted") {
    return {
      ...base,
      type: "deleted",
      recordId,
    };
  }

  return {
    ...base,
    type: input.type,
    recordId,
    ...(input.record !== undefined
      ? { record: input.record }
      : {}),
  };
}

/**
 * Stable duplicate-event key.
 *
 * Resource identity is included so two providers/resources may safely reuse an
 * event identifier without colliding in a shared deduplication cache.
 */
export function getDataTableLiveEventDeduplicationKey<
  TData extends RowData,
>(
  event: DataTableLiveEvent<TData>,
): string {
  return `${event.resource}:${event.eventId}`;
}
