/** @jest-environment node */
import { JSDOM } from "jsdom";
import { createSentinelClientPlugin } from "./sentinelClient";

/** Runs the real browser plugin with mocked ingestion; no fingerprints leave the test process. */
describe("Sentinel proxy-safe transport", () => {
  let dom: JSDOM;
  let plugin: ReturnType<typeof createSentinelClientPlugin>;
  let identified: { requestId: string; visitorId: string } | undefined;
  const original = new Map<string, PropertyDescriptor | undefined>();
  let fetchMock: jest.SpyInstance;
  beforeAll(() => {
    jest.useFakeTimers();
    dom = new JSDOM("<!doctype html><html><body></body></html>", {
      url: "https://app.example.test/login",
    });
    for (const name of ["window", "document", "navigator", "screen"]) {
      original.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
      Object.defineProperty(globalThis, name, {
        configurable: true,
        value: dom.window[name as keyof typeof dom.window],
      });
    }
    jest
      .spyOn(dom.window.HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(null);
    fetchMock = jest
      .spyOn(globalThis, "fetch")
      .mockImplementation((_url, options) => {
        if (String(_url).endsWith("/identify")) {
          identified = JSON.parse(String(options?.body)) as typeof identified;
          return Promise.resolve(
            new Response(JSON.stringify({ expiresAt: Date.now() + 600_000 }), {
              headers: { "Content-Type": "application/json" },
            }),
          );
        }
        return Promise.resolve(
          new Response("{}", {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );
      });
    plugin = createSentinelClientPlugin(
      "https://identify.example.test/api/v1/projects/test-project",
    );
  });
  afterAll(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    dom.window.close();
    for (const [name, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  });

  /** Applies the actual SDK request hook before gateway rewriting. */
  async function prepare() {
    const hook = plugin.fetchPlugins[0]?.hooks?.onRequest;
    if (!hook) throw new Error("Missing fingerprint hook");
    const context = {
      url: "https://api.example.test/api/auth/sign-in/social",
      method: "POST",
      headers: new Headers(),
      body: "{}",
    } as Parameters<typeof hook>[0];
    await hook(context);
    return context;
  }

  it("sends a verifiable modern lookup ID without using the gateway correlation header", async () => {
    const request = await prepare();
    expect(identified).toBeDefined();
    expect(request.headers?.get("X-Sentinel-Request-Id")).toBe(
      identified?.requestId,
    );
    expect(request.headers?.get("X-Sentinel-Visitor-Id")).toBe(
      identified?.visitorId,
    );
    expect(request.headers?.has("X-Request-Id")).toBe(false);
    expect(request.headers?.has("X-Visitor-Id")).toBe(false);
  });

  it.each(["X-PoW-Challenge", "X-Sentinel-PoW-Challenge"])(
    "preserves device headers and credentials when solving %s",
    async (challengeHeader) => {
      const request = await prepare();
      const hook = plugin.fetchPlugins[1]?.hooks?.onResponse;
      if (!hook) throw new Error("Missing challenge hook");
      const response = new Response("{}", {
        status: 423,
        headers: {
          [challengeHeader]: btoa(
            JSON.stringify({ nonce: "local-test-nonce", difficulty: 0 }),
          ),
        },
      });
      Object.defineProperty(response, "url", { value: String(request.url) });
      await hook({
        request: { ...request, _originalBody: "{}" },
        response,
      } as Parameters<typeof hook>[0]);
      const retry = fetchMock.mock.calls.at(-1)?.[1] as RequestInit | undefined;
      const headers = new Headers(retry?.headers);
      expect(headers.get("X-Sentinel-Request-Id")).toBe(identified?.requestId);
      expect(headers.get("X-Sentinel-Visitor-Id")).toBe(identified?.visitorId);
      expect(headers.has("X-Sentinel-PoW-Solution")).toBe(true);
      expect(headers.has("X-PoW-Solution")).toBe(false);
      expect(retry?.credentials).toBe("include");
      expect(retry?.body).toBe("{}");
    },
  );
});
