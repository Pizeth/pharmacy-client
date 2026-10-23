/** Shared by Better Auth and the application shell, including OAuth reloads. */
const ATTEMPT_KEY = "razeth.auth.login-attempt";
const NOTICE_KEY = "razeth.auth.login-notice";
export const LOGIN_FEEDBACK_EVENT = "razeth:login-feedback";
export const LOGIN_ATTEMPT_EVENT = "razeth:login-attempt";
const ATTEMPT_TTL = 10 * 60 * 1000;

export interface LoginNotice {
  severity: "success" | "error";
  message: string;
  createdAt: number;
}

export function isLoginRequest(url: string): boolean {
  const path = new URL(url, "https://auth.invalid").pathname;
  return /\/(sign-in\/[^/]+|one-tap\/callback|two-factor\/verify-(totp|otp|backup-code)|magic-link\/verify)$/.test(path);
}

export function shouldReportLoginError(url: string, status: number): boolean {
  if (!isLoginRequest(url) || status === 423) return false;
  // The password provider retries these username responses as an email login.
  return !(/\/sign-in\/username$/.test(new URL(url, "https://auth.invalid").pathname) &&
    (status === 422 || status === 404));
}

export function beginLoginAttempt(): void {
  try { sessionStorage.setItem(ATTEMPT_KEY, String(Date.now())); } catch { /* Storage can be unavailable. */ }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LOGIN_ATTEMPT_EVENT));
}

export function hasLoginAttempt(): boolean {
  try {
    const value = sessionStorage.getItem(ATTEMPT_KEY);
    const age = value ? Date.now() - Number(value) : Infinity;
    return age >= 0 && age < ATTEMPT_TTL;
  } catch { return false; }
}

function announce(severity: LoginNotice["severity"], message: string): void {
  if (typeof window === "undefined") return;
  const notice: LoginNotice = { severity, message, createdAt: Date.now() };
  try {
    sessionStorage.removeItem(ATTEMPT_KEY);
    sessionStorage.setItem(NOTICE_KEY, JSON.stringify(notice));
  } catch { /* The event still works without browser storage. */ }
  window.dispatchEvent(new CustomEvent(LOGIN_FEEDBACK_EVENT, { detail: notice }));
}

export function reportLoginFailure(message?: string): void {
  announce("error", message || "មិនអាចចូលប្រើបានទេ។ សូមសាកល្បងម្តងទៀត។");
}

/** An OAuth redirect or a request for a second factor is not a signed-in session. */
export function reportLoginResponse(data: unknown): void {
  if (!hasLoginAttempt() || !data || typeof data !== "object") return;
  const response = data as Record<string, unknown>;
  if (response.twoFactorRedirect || !response.user) return;
  if (!response.session && typeof response.token !== "string") return;
  announce("success", "ចូលប្រើប្រាស់បានជោគជ័យ។");
}

export function takeLoginNotice(): LoginNotice | null {
  try {
    const value = sessionStorage.getItem(NOTICE_KEY);
    sessionStorage.removeItem(NOTICE_KEY);
    if (!value) return null;
    const notice = JSON.parse(value) as LoginNotice;
    const age = Date.now() - notice.createdAt;
    return age >= 0 && age < 60_000 &&
      (notice.severity === "success" || notice.severity === "error") &&
      typeof notice.message === "string" ? notice : null;
  } catch { return null; }
}
