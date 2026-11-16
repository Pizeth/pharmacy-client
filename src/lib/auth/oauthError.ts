import { createLoginRedirect, normalizeInternalRedirectTarget } from "./redirectTarget";

/** Keep OAuth failures in the initiating application and preserve a safe retry destination. */
export function createOAuthErrorCallback(origin: string, destination: string): string {
  const url = new URL("/auth/error", origin);
  url.searchParams.set("callbackUrl", normalizeInternalRedirectTarget(destination));
  return url.toString();
}

export function createOAuthErrorLoginRedirect(destination?: string): string {
  return `${createLoginRedirect(destination ?? "/")}&authError=1`;
}
