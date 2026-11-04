import { TextDecoder, TextEncoder } from "node:util";
import { ReadableStream } from "node:stream/web";
import { createProductionLiveProvider, decodeLiveEvent } from "./productionLiveProvider";
import { readEventStream } from "./eventStream";

Object.assign(globalThis, { TextDecoder, TextEncoder });
const wire = { version: 1, eventId: "12345678-1234-1234-1234-123456789abc", resource: "translations",
  type: "updated", recordId: "12", occurredAt: "2026-11-02T00:00:00.000Z", record: { secret: "discard" } };
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const subscription = (callback = jest.fn()) => ({ channel: "resources/translations", types: ["*"],
  params: { subscriptionType: "useList" as const }, callback });
function stream(data = `data: ${JSON.stringify(wire)}\n\n`) {
  return new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(new TextEncoder().encode(data)); } });
}
function response(body = stream(), status = 200) {
  return { status, ok: status === 200, body, headers: { get: () => "text/event-stream" } } as unknown as Response;
}
afterEach(() => { jest.useRealTimers(); });

it("decodes only versioned TranslationKey identity envelopes, discarding arbitrary payloads", () => {
  expect(decodeLiveEvent(JSON.stringify(wire))?.payload).toEqual({ eventId: wire.eventId, id: "12" });
  for (const changed of [{ version: 2 }, { resource: "documents" }, { type: "mystery" },
    { recordId: undefined }, { eventId: "" }, { occurredAt: "bad" }, { recordId: {} }]) {
    expect(decodeLiveEvent(JSON.stringify({ ...wire, ...changed }))).toBeUndefined();
  }
  expect(decodeLiveEvent(JSON.stringify({ ...wire, type: "invalidate", recordId: undefined }))).toBeDefined();
  expect(decodeLiveEvent("bad json")).toBeUndefined();
});

it("decodes split UTF-8 frames, CRLF, comments and multiple data lines with bounded input", async () => {
  const chunks = new TextEncoder().encode(": heartbeat\r\n\r\ndata: ខ្មែរ\r\ndata: second\r\n\r\n");
  const body = new ReadableStream<Uint8Array>({ start(controller) {
    for (const byte of chunks) controller.enqueue(Uint8Array.of(byte));
    controller.close();
  } });
  const onData = jest.fn();
  await readEventStream(body as unknown as globalThis.ReadableStream<Uint8Array>, new AbortController().signal, onData);
  expect(onData).toHaveBeenCalledTimes(1);
  expect(onData).toHaveBeenCalledWith("ខ្មែរ\nsecond");
  await expect(readEventStream(stream("x".repeat(65537)) as unknown as globalThis.ReadableStream<Uint8Array>,
    new AbortController().signal, onData)).rejects.toThrow("frame limit");
});

it("shares a credentialed stream, filters subscriptions, and aborts only after the last consumer leaves", async () => {
  const fetcher = jest.fn().mockResolvedValue(response());
  const provider = createProductionLiveProvider({ enabled: true, fetcher, url: "https://api.example/live" });
  const a = subscription(), b = subscription();
  const first = provider.subscribe(a), second = provider.subscribe(b);
  expect(provider.subscribe({ ...a, channel: "resources/documents" })).toBeUndefined();
  await flush();
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect(a.callback).toHaveBeenCalledTimes(1);
  expect(b.callback).toHaveBeenCalledTimes(1);
  const init = fetcher.mock.calls[0][1] as RequestInit;
  expect(init.credentials).toBe("include");
  expect(fetcher.mock.calls[0][0]).not.toContain("token");
  provider.unsubscribe(first);
  expect(init.signal?.aborted).toBe(false);
  provider.unsubscribe(second);
  expect(init.signal?.aborted).toBe(true);
  await flush();
});

it.each([401, 403])("stops retrying after HTTP %s until a new mount", async status => {
  jest.useFakeTimers();
  const fetcher = jest.fn().mockResolvedValue(response(stream(), status));
  const provider = createProductionLiveProvider({ enabled: true, fetcher });
  const handle = provider.subscribe(subscription());
  await flush();
  jest.advanceTimersByTime(60000);
  await flush();
  expect(fetcher).toHaveBeenCalledTimes(1);
  provider.unsubscribe(handle);
});

it("backs off network failures, recovers after visibility/network changes and cleans up retry", async () => {
  jest.useFakeTimers();
  const fetcher = jest.fn().mockRejectedValue(new Error("offline"));
  const provider = createProductionLiveProvider({ enabled: true, fetcher });
  const handle = provider.subscribe(subscription());
  await flush();
  jest.advanceTimersByTime(999); await flush();
  expect(fetcher).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(1); await flush();
  expect(fetcher).toHaveBeenCalledTimes(2);
  jest.advanceTimersByTime(1999); await flush();
  expect(fetcher).toHaveBeenCalledTimes(2);
  window.dispatchEvent(new Event("online")); await flush();
  expect(fetcher).toHaveBeenCalledTimes(3);
  provider.unsubscribe(handle);
  jest.advanceTimersByTime(120000); await flush();
  expect(fetcher).toHaveBeenCalledTimes(3);
});

it("does not open a connection when gated off", () => {
  const fetcher = jest.fn();
  const provider = createProductionLiveProvider({ enabled: false, fetcher });
  expect(provider.subscribe(subscription())).toBeUndefined();
  expect(fetcher).not.toHaveBeenCalled();
});

it("isolates throwing subscribers without dropping delivery or reconnecting the shared stream", async () => {
  const fetcher = jest.fn().mockResolvedValue(response());
  const provider = createProductionLiveProvider({ enabled: true, fetcher });
  const first = provider.subscribe(subscription(jest.fn(() => { throw new Error("broken consumer"); })));
  const healthy = subscription();
  const second = provider.subscribe(healthy);
  await flush();
  expect(healthy.callback).toHaveBeenCalledTimes(1);
  expect(fetcher).toHaveBeenCalledTimes(1);
  expect((fetcher.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(false);
  provider.unsubscribe(first); provider.unsubscribe(second);
  await flush();
});
