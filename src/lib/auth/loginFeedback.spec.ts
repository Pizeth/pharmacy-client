import {
  beginLoginAttempt, hasLoginAttempt, isLoginRequest, reportLoginFailure,
  reportLoginResponse, shouldReportLoginError, takeLoginNotice,
} from "./loginFeedback";

beforeEach(() => sessionStorage.clear());
afterEach(() => jest.useRealTimers());

it("does not show Sentinel challenges or username-to-email retries as failed logins", () => {
  expect(shouldReportLoginError("/api/auth/one-tap/callback", 423)).toBe(false);
  expect(shouldReportLoginError("/api/auth/sign-in/username", 422)).toBe(false);
  expect(shouldReportLoginError("/api/auth/sign-in/username", 404)).toBe(false);
  expect(shouldReportLoginError("/api/auth/one-tap/callback", 401)).toBe(true);
  expect(shouldReportLoginError("/api/auth/sign-in/social", 403)).toBe(true);
  expect(shouldReportLoginError("/api/auth/sign-in/email", 422)).toBe(true);
});

it.each(["sign-in/email", "sign-in/username", "sign-in/social", "one-tap/callback", "two-factor/verify-totp"])(
  "recognizes %s without treating ordinary session checks as attempts", (path) => {
    expect(isLoginRequest(`https://api.example.test/api/auth/${path}`)).toBe(true);
    expect(isLoginRequest("/api/auth/get-session")).toBe(false);
    expect(isLoginRequest("/api/auth/sign-out")).toBe(false);
  },
);

it("announces a completed sign-in only once, across subsequent session checks", () => {
  beginLoginAttempt();
  reportLoginResponse({ user: { id: "1" }, token: "test-session" });
  expect(takeLoginNotice()?.severity).toBe("success");
  reportLoginResponse({ user: { id: "1" }, session: { id: "session" } });
  expect(takeLoginNotice()).toBeNull();
});

it("waits for an authenticated session after an OAuth redirect or second-factor step", () => {
  beginLoginAttempt();
  reportLoginResponse({ url: "https://accounts.example.test", redirect: true });
  reportLoginResponse({ user: { id: "1" }, twoFactorRedirect: true });
  expect(takeLoginNotice()).toBeNull();
  expect(hasLoginAttempt()).toBe(true);
  reportLoginResponse({ user: { id: "1" }, session: { id: "session" } });
  expect(takeLoginNotice()?.severity).toBe("success");
});

it("does not announce an existing session without a recent login attempt", () => {
  reportLoginResponse({ user: { id: "1" }, session: { id: "session" } });
  expect(takeLoginNotice()).toBeNull();
  jest.useFakeTimers();
  beginLoginAttempt();
  jest.advanceTimersByTime(10 * 60 * 1000);
  expect(hasLoginAttempt()).toBe(false);
});

it("preserves API errors as plain text and clears the pending attempt", () => {
  beginLoginAttempt();
  reportLoginFailure("Anonymous connections are not allowed.");
  expect(takeLoginNotice()).toMatchObject({ severity: "error", message: "Anonymous connections are not allowed." });
  expect(hasLoginAttempt()).toBe(false);
});

it("expires queued notices rather than showing stale feedback after a later visit", () => {
  jest.useFakeTimers();
  reportLoginFailure();
  jest.advanceTimersByTime(60_000);
  expect(takeLoginNotice()).toBeNull();
});
