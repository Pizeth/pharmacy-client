import {
  createLoginRedirect,
  getAuthRedirectTarget,
  getCurrentBrowserTarget,
  getUnauthenticatedLoginRedirect,
  normalizeInternalRedirectTarget,
} from "./redirectTarget";

describe("auth redirect target", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("preserves an internal pathname, search and hash", () => {
    expect(
      normalizeInternalRedirectTarget(
        "/admin/i18n?category=auth&page=2#translations",
        "/dashboard",
      ),
    ).toBe("/admin/i18n?category=auth&page=2#translations");
  });

  it("rejects absolute external redirects", () => {
    expect(
      normalizeInternalRedirectTarget(
        "https://evil.example/steal",
        "/dashboard",
      ),
    ).toBe("/dashboard");
  });

  it("rejects protocol-relative redirects", () => {
    expect(
      normalizeInternalRedirectTarget("//evil.example/steal", "/dashboard"),
    ).toBe("/dashboard");
  });

  it("prefers Refine's to parameter over callbackUrl", () => {
    const params = new URLSearchParams();

    params.set("to", "/fts");

    params.set("callbackUrl", "/admin/i18n");

    expect(getAuthRedirectTarget(params, "/dashboard")).toBe("/fts");
  });

  it("uses callbackUrl when to is absent", () => {
    const params = new URLSearchParams();

    params.set("callbackUrl", "/admin/i18n?category=auth");

    expect(getAuthRedirectTarget(params, "/dashboard")).toBe(
      "/admin/i18n?category=auth",
    );
  });

  it("removes nested auth transport params from the resolved destination", () => {
    const params = new URLSearchParams();

    params.set(
      "callbackUrl",
      "/admin/i18n?category=auth&to=%2Fadmin%2Fi18n&callbackUrl=%2Ffts",
    );

    expect(getAuthRedirectTarget(params, "/dashboard")).toBe(
      "/admin/i18n?category=auth",
    );
  });

  it("builds a login URL which carries the complete protected destination", () => {
    expect(
      createLoginRedirect("/admin/i18n?category=auth&page=2", "/dashboard"),
    ).toBe("/login?callbackUrl=%2Fadmin%2Fi18n%3Fcategory%3Dauth%26page%3D2");
  });

  it("builds exactly one clean callbackUrl even from a stale protected URL", () => {
    expect(
      createLoginRedirect(
        "/admin/i18n?category=auth&to=%2Fadmin%2Fi18n&callbackUrl=%2Ffts",
        "/dashboard",
      ),
    ).toBe("/login?callbackUrl=%2Fadmin%2Fi18n%3Fcategory%3Dauth");
  });

  it("captures the complete current browser target", () => {
    window.history.replaceState(
      {},
      "",
      "/admin/i18n?category=auth&page=2#translations",
    );

    expect(getCurrentBrowserTarget("/dashboard")).toBe(
      "/admin/i18n?category=auth&page=2#translations",
    );
  });

  it("removes stale auth transport params while preserving real page state", () => {
    window.history.replaceState(
      {},
      "",
      "/admin/i18n?category=auth&to=%2Fadmin%2Fi18n&callbackUrl=%2Ffts#translations",
    );

    expect(getCurrentBrowserTarget("/dashboard")).toBe(
      "/admin/i18n?category=auth#translations",
    );
  });

  it("preserves a protected route when authentication fails", () => {
    window.history.replaceState({}, "", "/admin/i18n?category=auth&page=2");

    expect(getUnauthenticatedLoginRedirect("/dashboard")).toBe(
      "/login?callbackUrl=%2Fadmin%2Fi18n%3Fcategory%3Dauth%26page%3D2",
    );
  });

  it("does not recursively redirect the login route back to itself", () => {
    window.history.replaceState({}, "", "/login?callbackUrl=%2Fadmin%2Fi18n");

    expect(getUnauthenticatedLoginRedirect("/dashboard")).toBeUndefined();
  });
});
