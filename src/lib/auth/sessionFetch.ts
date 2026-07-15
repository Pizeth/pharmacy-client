// src/lib/auth/sessionFetch.ts
import { API_URL, COOKIE_TOKEN_KEY } from "@/types/constants";

export async function fetchSessionDirect(token?: string | null) {
  const res = await fetch(`${API_URL}/api/auth/get-session`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    credentials: token ? undefined : "include", // cookie fallback if no token
    cache: "no-store",
  });

  const jwt = res.headers.get(COOKIE_TOKEN_KEY);
  const session = await res.json();

  return { session, jwt };
}
