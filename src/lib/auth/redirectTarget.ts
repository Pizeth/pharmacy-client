import { LANDING_PAGE } from "@/types/constants";

/**
 * Synthetic origin used only for parsing relative application URLs.
 *
 * It is deliberately not a real application/domain origin.
 */
const INTERNAL_REDIRECT_ORIGIN = "https://redirect.razeth.invalid";

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
 * Resolve the destination carried by a login/auth URL.
 *
 * Preserve the existing Refine compatibility policy:
 *
 *   to
 *      ↓
 *   callbackUrl
 *      ↓
 *   LANDING_PAGE
 */
export function getAuthRedirectTarget(
  searchParams: AuthSearchParams | null | undefined,
  fallback: string = LANDING_PAGE,
): string {
  const candidate = searchParams?.get("to") ?? searchParams?.get("callbackUrl");

  return normalizeInternalRedirectTarget(candidate, fallback);
}

/**
 * Browser version used by credential login.
 */
export function getBrowserAuthRedirectTarget(
  fallback: string = LANDING_PAGE,
): string {
  if (typeof window === "undefined") {
    return normalizeInternalRedirectTarget(undefined, fallback);
  }

  return getAuthRedirectTarget(
    new URLSearchParams(window.location.search),
    fallback,
  );
}

/**
 * Current application location before authentication redirects away.
 *
 * Preserve:
 *
 * - pathname
 * - query string
 * - hash
 */
export function getCurrentBrowserTarget(
  fallback: string = LANDING_PAGE,
): string {
  if (typeof window === "undefined") {
    return normalizeInternalRedirectTarget(undefined, fallback);
  }

  return normalizeInternalRedirectTarget(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
    fallback,
  );
}

/**
 * Build the login URL carrying one exact internal callback target.
 */
export function createLoginRedirect(
  target: string,
  fallback: string = LANDING_PAGE,
): string {
  const callbackUrl = normalizeInternalRedirectTarget(target, fallback);

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
