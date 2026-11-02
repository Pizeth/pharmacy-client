import type { LiveEvent, LiveProvider } from "@refinedev/core";
import { API_URL } from "@/types/constants";
import { readEventStream } from "./eventStream";

export const productionRealtimeEnabled = process.env.NEXT_PUBLIC_REALTIME_ENABLED === "true";

/** Strict v1 identity-only wire decoder. The browser never receives a DB row. */
export function decodeLiveEvent(data: string): LiveEvent | undefined {
  try {
    const value: unknown = JSON.parse(data);
    if (!value || typeof value !== "object") return undefined;
    const event = value as Record<string, unknown>;
    if (event.version !== 1 || event.resource !== "translations" ||
      typeof event.eventId !== "string" || !/^[0-9a-f-]{36}$/i.test(event.eventId) ||
      typeof event.occurredAt !== "string" || !Number.isFinite(Date.parse(event.occurredAt)) ||
      !["created", "updated", "deleted", "invalidate"].includes(String(event.type)) ||
      (event.recordId !== undefined && (typeof event.recordId !== "string" || !/^\d+$/.test(event.recordId))) ||
      (event.type !== "invalidate" && event.recordId === undefined)) return undefined;
    return { channel: "resources/translations", type: String(event.type),
      date: new Date(event.occurredAt), payload: { eventId: event.eventId,
        ...(event.recordId !== undefined ? { id: event.recordId } : {}) } };
  } catch { return undefined; }
}

type Subscription = Parameters<LiveProvider["subscribe"]>[0];

/** One cookie-authenticated stream per browser provider, shared by list consumers. */
export function createProductionLiveProvider({ enabled = productionRealtimeEnabled,
  fetcher, url = `${API_URL.replace(/\/+$/, "")}/api/v1/live/translations`,
}: { enabled?: boolean; fetcher?: typeof fetch; url?: string } = {}): LiveProvider {
  const subscribers = new Set<Subscription>();
  let controller: AbortController | undefined;
  let retry: ReturnType<typeof setTimeout> | undefined;
  let attempts = 0;
  let terminal = false;
  const active = () => subscribers.size > 0;
  const connect = async () => {
    if (!active() || terminal) return;
    const current = new AbortController();
    controller = current;
    const openingTimeout = setTimeout(() => current.abort(), 45000);
    try {
      const response = await (fetcher ?? globalThis.fetch)(url, { credentials: "include", cache: "no-store",
        headers: { Accept: "text/event-stream" }, signal: current.signal });
      clearTimeout(openingTimeout);
      if (controller !== current || current.signal.aborted) {
        await response.body?.cancel();
        return;
      }
      if (response.status === 401 || response.status === 403) {
        terminal = true;
        await response.body?.cancel();
        return;
      }
      if (!response.ok || !response.body || !response.headers.get("content-type")?.includes("text/event-stream")) {
        await response.body?.cancel();
        throw new Error("Realtime stream unavailable.");
      }
      await readEventStream(response.body, current.signal, data => {
        const event = decodeLiveEvent(data);
        if (!event) return;
        attempts = 0;
        for (const subscription of [...subscribers]) {
          if (!subscription.types.includes("*") && !subscription.types.includes(event.type)) continue;
          try { subscription.callback(event); }
          catch { /* One consumer must not interrupt the other consumers or shared stream. */ }
        }
      });
    } catch { /* Network/idle failure: resync on the next authenticated connection. */ }
    finally {
      clearTimeout(openingTimeout);
      if (controller === current && active() && !terminal) {
        const delay = Math.min(30000, 1000 * 2 ** Math.min(attempts++, 5));
        retry = setTimeout(() => { void connect(); }, delay);
      }
    }
  };
  const recover = () => {
    if (terminal || !active() || document.visibilityState === "hidden") return;
    clearTimeout(retry);
    controller?.abort();
    controller = undefined;
    void connect();
  };
  return {
    subscribe(options) {
      if (!enabled || options.channel !== "resources/translations" || options.params?.subscriptionType !== "useList") return undefined;
      subscribers.add(options);
      if (subscribers.size === 1) {
        terminal = false;
        attempts = 0;
        window.addEventListener("online", recover);
        document.addEventListener("visibilitychange", recover);
        void connect();
      }
      return options;
    },
    unsubscribe(value: unknown) {
      subscribers.delete(value as Subscription);
      if (!active()) {
        clearTimeout(retry);
        controller?.abort();
        controller = undefined;
        window.removeEventListener("online", recover);
        document.removeEventListener("visibilitychange", recover);
      }
    },
  };
}
