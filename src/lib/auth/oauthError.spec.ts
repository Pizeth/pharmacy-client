import { createOAuthErrorCallback, createOAuthErrorLoginRedirect } from "./oauthError";

it("preserves an internal OAuth retry destination on the initiating origin", () => {
  const callback = new URL(createOAuthErrorCallback("https://app.example.test", "/admin/i18n?page=2"));
  expect(callback.origin).toBe("https://app.example.test");
  expect(callback.pathname).toBe("/auth/error");
  expect(callback.searchParams.get("callbackUrl")).toBe("/admin/i18n?page=2");
  expect(createOAuthErrorLoginRedirect("/admin/i18n?page=2")).toBe("/login?callbackUrl=%2Fadmin%2Fi18n%3Fpage%3D2&authError=1");
});

it.each(["https://evil.example", "//evil.example", "/\\evil.example"])("rejects external retry destinations: %s", (destination) => {
  const url = new URL(createOAuthErrorLoginRedirect(destination), "https://app.example.test");
  expect(url.pathname).toBe("/login");
  expect(url.searchParams.get("callbackUrl")).not.toContain("evil.example");
});
