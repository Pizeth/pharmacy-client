// src/components/DataTable/adapters/refine/live/adaptRefineDataTableLiveEvent.ts

import type {
  BaseRecord,
  LiveEvent,
} from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";

import {
  createDataTableLiveEvent,
} from "../../../mui/live";
import type {
  DataTableLiveEvent,
  DataTableLiveEventType,
} from "../../../mui/live";

import type {
  AdaptRefineDataTableLiveEventOptions,
} from "./types";

export function mapDefaultRefineDataTableLiveEventType(
  event: LiveEvent,
): DataTableLiveEventType | undefined {
  switch (event.type) {
    case "created":
    case "updated":
    case "deleted":
      return event.type;

    default:
      return undefined;
  }
}

/**
 * Normalize one Refine LiveProvider event into DataTable's transport-independent
 * live contract.
 *
 * This function performs no:
 *
 * - subscription,
 * - query invalidation,
 * - refetch,
 * - cache write,
 * - TanStack table-state mutation.
 *
 * Unsupported provider event names are ignored unless the resource adapter
 * explicitly maps them.
 */
export function adaptRefineDataTableLiveEvent<
  TData extends RowData & BaseRecord,
>(
  options: AdaptRefineDataTableLiveEventOptions<TData>,
): DataTableLiveEvent<TData> | undefined {
  const {
    adapter,
    event,
  } = options;

  const type =
    adapter.mapType?.(event) ??
    mapDefaultRefineDataTableLiveEventType(event);

  if (type === undefined) {
    return undefined;
  }

  const recordId = adapter.getRecordId(event);

  const record =
    type === "created" || type === "updated"
      ? adapter.readRecord?.(event)
      : undefined;

  const revision = adapter.getRevision?.(event);

  return createDataTableLiveEvent<TData>({
    type,
    eventId: adapter.getEventId(event),
    resource: adapter.resource,
    ...(recordId !== undefined
      ? { recordId }
      : {}),
    ...(record !== undefined
      ? { record }
      : {}),
    ...(revision !== undefined
      ? { revision }
      : {}),
    occurredAt: event.date.toISOString(),
  });
}
