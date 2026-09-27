"use client";

// src/components/DataTable/adapters/refine/live/useRefineDataTableLiveSubscription.ts

import {
  useSubscription,
  type BaseRecord,
  type LiveEvent,
} from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";
import {
  useCallback,
  useRef,
} from "react";

import {
  adaptRefineDataTableLiveEvent,
} from "./adaptRefineDataTableLiveEvent";
import type {
  UseRefineDataTableLiveSubscriptionOptions,
} from "./types";

/**
 * Refine LiveProvider -> generic DataTableLiveEvent subscription bridge.
 *
 * Refine owns only transport subscription here. Once an event arrives, it is
 * normalized immediately and handed to the generic live layer.
 *
 * This hook deliberately does not decide whether to refetch or reconcile.
 * That remains the responsibility of reconcileDataTableLiveEvent() plus the
 * consuming resource/controller.
 */
export function useRefineDataTableLiveSubscription<
  TData extends RowData & BaseRecord,
>(
  options: UseRefineDataTableLiveSubscriptionOptions<TData>,
): void {
  const {
    adapter,
    enabled = true,
    onEvent,
  } = options;

  /**
   * Refine's useSubscription currently establishes the subscription from an
   * effect keyed by enabled. Keep the callback stable while reading the latest
   * adapter/consumer callback so render-time callback changes do not leave a
   * stale event handler installed.
   *
   * Resource/channel identity itself is expected to remain stable for one
   * mounted resource controller.
   */
  const adapterRef = useRef(adapter);
  const onEventRef = useRef(onEvent);

  adapterRef.current = adapter;
  onEventRef.current = onEvent;

  const onLiveEvent = useCallback(
    (refineEvent: LiveEvent): void => {
      const event = adaptRefineDataTableLiveEvent({
        adapter: adapterRef.current,
        event: refineEvent,
      });

      if (event !== undefined) {
        onEventRef.current(
          event,
          refineEvent,
        );
      }
    },
    [],
  );

  useSubscription({
    channel:
      adapter.channel ??
      `resources/${adapter.resource}`,
    types: adapter.types
      ? [...adapter.types]
      : ["*"],
    enabled,
    params: {
      ...adapter.params,
      resource: adapter.resource,
      subscriptionType: "useList",
    },
    meta: adapter.meta,
    onLiveEvent,
  });
}
