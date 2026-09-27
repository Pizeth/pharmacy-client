// src/components/DataTable/adapters/refine/live/types.ts

import type {
  BaseRecord,
  LiveEvent,
} from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";

import type {
  DataTableLiveEvent,
  DataTableLiveEventType,
  DataTableLiveIdentityInput,
} from "../../../mui/live";

/**
 * Refine-specific normalization contract.
 *
 * The bridge deliberately does NOT assume a universal Refine LiveProvider
 * payload shape beyond Refine's own LiveEvent envelope. Providers/resources
 * must explicitly identify:
 *
 * - stable event identity,
 * - stable record identity,
 * - optional normalized row payload,
 * - optional custom event-type mapping.
 */
export interface RefineDataTableLiveEventAdapter<
  TData extends RowData & BaseRecord,
> {
  /**
   * Stable Refine/DataTable resource identity.
   */
  readonly resource: string;

  /**
   * Refine's built-in list hooks subscribe to:
   *
   *   resources/<resource>
   *
   * by convention. Custom providers can override that channel explicitly.
   */
  readonly channel?: string;

  /**
   * Refine live event types requested from the provider.
   *
   * Default: ["*"].
   */
  readonly types?: readonly LiveEvent["type"][];

  /**
   * Extra subscription parameters passed to Refine.
   *
   * The bridge still owns resource/subscriptionType so callers cannot
   * accidentally turn this list bridge into a different subscription kind.
   */
  readonly params?: Readonly<Record<string, unknown>>;

  /**
   * Refine live-provider metadata such as dataProviderName.
   */
  readonly meta?: LiveEvent["meta"];

  /**
   * Refine LiveEvent has no universal event-id field.
   *
   * A provider/resource bridge must therefore extract a real stable event
   * identity from its own envelope/payload. The generic layer never fabricates
   * one from timestamps or record IDs.
   */
  readonly getEventId: (
    event: LiveEvent,
  ) => DataTableLiveIdentityInput;

  /**
   * Extract the affected record ID.
   *
   * Returning undefined is valid only for an invalidate event. The generic
   * createDataTableLiveEvent() contract rejects missing IDs for
   * created/updated/deleted events.
   */
  readonly getRecordId: (
    event: LiveEvent,
  ) => DataTableLiveIdentityInput | undefined;

  /**
   * Decode a provider payload into the canonical DataTable row shape.
   *
   * Optional because identity-only events remain valid and conservatively
   * refetch through the generic reconciliation policy.
   */
  readonly readRecord?: (
    event: LiveEvent,
  ) => TData | undefined;

  /**
   * Override provider-specific event names.
   *
   * Returning undefined ignores an event at this transport bridge.
   *
   * Without this callback, exact Refine "created" / "updated" / "deleted"
   * event names map directly and every other type is ignored.
   */
  readonly mapType?: (
    event: LiveEvent,
  ) => DataTableLiveEventType | undefined;

  /**
   * Optional provider-specific ordering/version value.
   *
   * The generic live contract retains this as a hint only.
   */
  readonly getRevision?: (
    event: LiveEvent,
  ) => string | number | undefined;
}

export interface AdaptRefineDataTableLiveEventOptions<
  TData extends RowData & BaseRecord,
> {
  readonly adapter: RefineDataTableLiveEventAdapter<TData>;
  readonly event: LiveEvent;
}

export interface UseRefineDataTableLiveSubscriptionOptions<
  TData extends RowData & BaseRecord,
> {
  readonly adapter: RefineDataTableLiveEventAdapter<TData>;

  /**
   * Default: true.
   */
  readonly enabled?: boolean;

  /**
   * Receives only normalized generic events.
   *
   * The original Refine event is included for diagnostics/resource-specific
   * logging, not for generic reconciliation semantics.
   */
  readonly onEvent: (
    event: DataTableLiveEvent<TData>,
    refineEvent: LiveEvent,
  ) => void;
}
