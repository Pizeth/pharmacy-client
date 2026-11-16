"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useDataTableLiveServerResult, useRefineDataTableLiveSubscription,
  removeDataTableLiveRecordFromTableState } from "@/components/DataTable";
import type { DataTableLiveEvent, DataTableServerQueryState,
  DataTableServerResultLifecycle, MuiDataTableInstance, RefineDataTableLiveEventAdapter } from "@/components/DataTable";
import { productionRealtimeEnabled } from "@/lib/realtime/productionLiveProvider";
import type { TranslationKey } from "../schemas";

const adapter: RefineDataTableLiveEventAdapter<TranslationKey> = {
  resource: "translations",
  getEventId: event => event.payload.eventId as string,
  getRecordId: event => event.payload.id as string | undefined,
  mapType: event => ["created", "updated", "deleted", "invalidate"].includes(event.type)
    ? event.type as DataTableLiveEvent<TranslationKey>["type"] : undefined,
};

/** Bounded burst batching with a trailing refresh after an in-flight request. */
export function useTranslationKeyLiveResult(query: DataTableServerQueryState,
  server: DataTableServerResultLifecycle<TranslationKey>, refresh: () => void) {
  const latest = useRef({ server, refresh });
  useLayoutEffect(() => { latest.current = { server, refresh }; }, [server, refresh]);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const schedule = useCallback(() => {
    dirty.current = true;
    if (timer.current !== undefined) return;
    timer.current = setTimeout(() => {
      timer.current = undefined;
      if (!dirty.current || latest.current.server.isFetching) return;
      dirty.current = false;
      latest.current.refresh();
    }, 250);
  }, []);
  useEffect(() => {
    if (!server.isFetching && dirty.current) schedule();
  }, [server.isFetching, schedule]);
  useEffect(() => () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  }, []);
  return useDataTableLiveServerResult({ resource: "translations", query, server,
    refresh: schedule, getRowId: row => row.id });
}

export function useTranslationKeyLiveSubscription(table: MuiDataTableInstance<TranslationKey>,
  onEvent: (event: DataTableLiveEvent<TranslationKey>) => unknown) {
  useRefineDataTableLiveSubscription({ adapter, enabled: productionRealtimeEnabled,
    onEvent: event => {
      const result = onEvent(event);
      // Only authenticated known deletion is evidence of global nonexistence.
      if (event.type === "deleted" && result && typeof result === "object" &&
        "status" in result && result.status !== "ignored") {
        removeDataTableLiveRecordFromTableState({ table, recordId: event.recordId });
      }
    } });
}
