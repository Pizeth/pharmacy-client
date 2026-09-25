import { LANDING_PAGE } from "@/types/constants";

/**
 * Synthetic origin used only for parsing relative application URLs.
 *
 * It is deliberately not a real application/domain origin.
 */
const INTERNAL_REDIRECT_ORIGIN = "https://redirect.razeth.invalid";

/**
 * Refine and this application use these query keys only to transport an
 * authentication destination.
 *
 * They must not become durable application state after authentication.
 */
const AUTH_REDIRECT_QUERY_KEYS = ["to", "callbackUrl"] as const;

export const LOGIN_PATH = "/login";

export interface AuthSearchParams {
  readonly get: (name: string) => string | null;
}

/**
 * Parse one value as an application-internal URL.
 *
 * Accepted:
 *
 *   /admin/i18n
 *   /admin/i18n?page=2
 *   /admin/i18n?page=2#translations
 *
 * Rejected:
 *
 *   https://evil.example
 *   //evil.example
 *   javascript:...
 *
 * Besides correctness, keeping callback destinations internal avoids
 * introducing an open-redirect surface through callbackUrl/to.
 */
function parseInternalRedirectTarget(
  value: string | null | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  /**
   * Internal application destinations must begin with exactly one
   * logical path slash.
   */
  if (!value.startsWith("/") || value.startsWith("//")) {
    return undefined;
  }

  try {
    const url = new URL(value, INTERNAL_REDIRECT_ORIGIN);

    /**
     * URL parsing also protects us from slash/backslash tricks that can
     * otherwise be interpreted as a different origin by a browser.
     */
    if (url.origin !== INTERNAL_REDIRECT_ORIGIN) {
      return undefined;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return undefined;
  }
}

/**
 * Return a safe internal destination.
 *
 * The fallback is normalized through exactly the same contract. If an
 * environment variable accidentally supplies an external/invalid
 * LANDING_PAGE, "/" remains the final safe fallback.
 */
export function normalizeInternalRedirectTarget(
  value: string | null | undefined,
  fallback: string = LANDING_PAGE,
): string {
  return (
    parseInternalRedirectTarget(value) ??
    parseInternalRedirectTarget(fallback) ??
    "/"
  );
}

/**
 * Remove authentication-only transport parameters from a destination.
 *
 * Why this is separate from normalizeInternalRedirectTarget():
 *
 * - normalizeInternalRedirectTarget is a generic internal-URL safety helper
 *   and must preserve ordinary query state exactly.
 * - this helper is used only at authentication boundaries, where Refine's
 *   "to" and our "callbackUrl" are transport metadata rather than page state.
 *
 * This also repairs stale URLs produced by an older flow, for example:
 *
 *   /admin/i18n?to=/admin/i18n
 *
 * becomes:
 *
 *   /admin/i18n
 *
 * before it is captured as the next callback destination.
 */
function normalizeAuthRedirectTarget(
  value: string | null | undefined,
  fallback: string = LANDING_PAGE,
): string {
  const normalized = normalizeInternalRedirectTarget(value, fallback);
  const url = new URL(normalized, INTERNAL_REDIRECT_ORIGIN);

  for (const key of AUTH_REDIRECT_QUERY_KEYS) {
    url.searchParams.delete(key);
  }

  const search = url.searchParams.toString();

  return `${url.pathname}${search ? `?${search}` : ""}${url.hash}`;
}

/**
 * Resolve the destination carried by a login/auth URL.
 *
 * Preserve the existing Refine compatibility policy:
 *
 *   to
 *      ↓
 *   callbackUrl
 *      ↓
 *   LANDING_PAGE
 *
 * The resolved target is then canonicalized so auth transport parameters
 * never leak into the protected route after a successful login.
 */
export function getAuthRedirectTarget(
  searchParams: AuthSearchParams | null | undefined,
  fallback: string = LANDING_PAGE,
): string {
  const candidate = searchParams?.get("to") ?? searchParams?.get("callbackUrl");

  return normalizeAuthRedirectTarget(candidate, fallback);
}

/**
 * Browser version used by credential login.
 */
export function getBrowserAuthRedirectTarget(
  fallback: string = LANDING_PAGE,
): string {
  if (typeof window === "undefined") {
    return normalizeAuthRedirectTarget(undefined, fallback);
  }

  return getAuthRedirectTarget(
    new URLSearchParams(window.location.search),
    fallback,
  );
}

/**
 * Current application location before authentication redirects away.
 *
 * Preserve real application state:
 *
 * - pathname
 * - non-auth query string
 * - hash
 *
 * Auth-only "to" and "callbackUrl" parameters are intentionally removed.
 */
export function getCurrentBrowserTarget(
  fallback: string = LANDING_PAGE,
): string {
  if (typeof window === "undefined") {
    return normalizeAuthRedirectTarget(undefined, fallback);
  }

  return normalizeAuthRedirectTarget(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
    fallback,
  );
}

/**
 * Build the login URL carrying one exact internal callback target.
 *
 * The login URL itself owns the single callbackUrl transport parameter.
 * Protected-page query state is nested inside that value only after auth
 * transport parameters have been stripped.
 */
export function createLoginRedirect(
  target: string,
  fallback: string = LANDING_PAGE,
): string {
  const callbackUrl = normalizeAuthRedirectTarget(target, fallback);

  const params = new URLSearchParams({
    callbackUrl,
  });

  return `${LOGIN_PATH}?${params.toString()}`;
}

/**
 * Redirect requested by authProvider.check().
 *
 * IMPORTANT:
 *
 * Auth itself calls useIsAuthenticated() while already on /login.
 *
 * Returning another /login redirect from check() while on /login would
 * create a self-redirect loop and could recursively wrap callbackUrl.
 *
 * Therefore:
 *
 * protected route
 *      → /login?callbackUrl=<route>
 *
 * login route
 *      → undefined
 */
export function getUnauthenticatedLoginRedirect(
  fallback: string = LANDING_PAGE,
): string | undefined {
  if (typeof window === "undefined") {
    return LOGIN_PATH;
  }

  const pathname = window.location.pathname;

  if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
    return undefined;
  }

  return createLoginRedirect(getCurrentBrowserTarget(fallback), fallback);
}
