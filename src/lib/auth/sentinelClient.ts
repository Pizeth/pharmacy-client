import { sentinelClient } from "@better-auth/infra/client";

/** Keep device identifiers separate from request IDs rewritten by the API gateway. */
export function createSentinelClientPlugin(
  identifyUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_IDENTIFY_URL,
) {
  return sentinelClient({
    identifyUrl,
    sentinelHeaders: "modern",
    autoSolveChallenge: true,
    identifyOptions: {
      timeout: 2000,
      retry: { attempts: 2, baseDelay: 400, maxDelay: 1000 },
    },
  });
}
