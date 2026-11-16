import { authProvider } from "./authProvider";
import { authClient } from "@/lib/auth-client";
import { clearAuthCookies, clearAxiosAuth } from "./dataProvider";
import { TOKEN_KEY } from "@/types/constants";

jest.mock("@/lib/auth-client", () => ({ authClient: {
  signOut: jest.fn(),
  signIn: { username: jest.fn(), email: jest.fn() },
} }));
jest.mock("./dataProvider", () => ({
  clearAuthCookies: jest.fn(), clearAxiosAuth: jest.fn(), setupAxiosAuth: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});
afterEach(() => window.history.replaceState({}, "", "/"));

it("returns to the original route after logout and a subsequent login", async () => {
  window.history.replaceState({}, "", "/admin/i18n?category=auth&page=2#translations");
  sessionStorage.setItem(TOKEN_KEY, "test-token");
  jest.mocked(authClient.signOut).mockResolvedValue({ data: { success: true }, error: null });
  const result = await authProvider.logout!({});
  expect(result).toEqual({ success: true, redirectTo: "/login?callbackUrl=%2Fadmin%2Fi18n%3Fcategory%3Dauth%26page%3D2%23translations" });
  expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  expect(clearAuthCookies).toHaveBeenCalledTimes(1);
  expect(clearAxiosAuth).toHaveBeenCalledTimes(1);

  window.history.replaceState({}, "", result.redirectTo!);
  jest.mocked(authClient.signIn.username).mockResolvedValue({ data: { token: "new-token", user: {} }, error: null } as Awaited<ReturnType<typeof authClient.signIn.username>>);
  const login = await authProvider.login!({ identifier: "member", password: "test-password" });
  expect(login.redirectTo).toBe("/admin/i18n?category=auth&page=2#translations");
  expect(authClient.signIn.username).toHaveBeenCalledWith(expect.objectContaining({ callbackURL: login.redirectTo }));
});

it("captures the destination before sign-out can change the browser route", async () => {
  window.history.replaceState({}, "", "/hrd/documents?category=law");
  jest.mocked(authClient.signOut).mockImplementation(async () => {
    window.history.replaceState({}, "", "/login");
    return { data: { success: true }, error: null };
  });
  expect(await authProvider.logout!({})).toEqual({ success: true, redirectTo: "/login?callbackUrl=%2Fhrd%2Fdocuments%3Fcategory%3Dlaw" });
});

it("keeps the user signed in when sign-out fails", async () => {
  sessionStorage.setItem(TOKEN_KEY, "test-token");
  jest.mocked(authClient.signOut).mockResolvedValue({ data: null, error: { message: "Unavailable", status: 503, statusText: "Unavailable" } });
  const result = await authProvider.logout!({});
  expect(result.success).toBe(false);
  expect(result.redirectTo).toBeUndefined();
  expect(sessionStorage.getItem(TOKEN_KEY)).toBe("test-token");
  expect(clearAuthCookies).not.toHaveBeenCalled();
  expect(clearAxiosAuth).not.toHaveBeenCalled();
});
