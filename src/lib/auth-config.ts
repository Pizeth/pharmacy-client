import { AuthProvidersConfig } from "@/interfaces/auth.interface";

export async function getAuthProvidersConfig(): Promise<AuthProvidersConfig> {
  // Check if running on server-side or client-side to determine base URL
  const isServer = typeof window === "undefined";

  // On server, use absolute URL. On client, use relative URL path to trigger the rewrite proxy.
  const fetchUrl = isServer
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth-info/providers`
    : "/api/auth-info/providers";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth-info/providers`,
      {
        next: { revalidate: 3600 }, // cache 1hr, since providers rarely change
      },
    );
    if (!res.ok) return { base: [], social: [], generic: [] };

    // 1. Await the full raw response object
    const result = await res.json();

    // 2. Unpack the nested data payload directly into your interface
    if (result && result.data) {
      return result.data as AuthProvidersConfig;
    }
    return result as AuthProvidersConfig;
  } catch (error) {
    return { base: [], social: [], generic: [] };
  }

  // return res.json() as Promise<{ social: string[]; generic: string[] }>;
}
