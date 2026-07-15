// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  twoFactorClient,
  multiSessionClient,
  oneTapClient,
  adminClient,
  jwtClient, // 👈 add this — it adds role to the inferred type
} from "better-auth/client/plugins";

import { passkeyClient } from "@better-auth/passkey/client";
import { API_URL, COOKIE_TOKEN_KEY, TOKEN_KEY } from "@/types/constants";

export const authClient = createAuthClient({
  // 👆 Just the origin — Better Auth appends /api/auth internally
  baseURL: API_URL, // 👈 talk directly to NestJS, not through the proxy
  // baseURL:
  //   typeof window !== "undefined"
  //     ? window.location.origin // 👈 same origin as Next.js
  //     : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8080",
  // // 👆 Now points to Next.js itself — cookies land on localhost:8080
  cookiePolicy: "cross-origin",
  fetchOptions: {
    credentials: "include", // 👈 always send cookies cross-origin
    // 👇 Auto-capture token from every response
    onSuccess: (ctx) => {
      const authToken =
        ctx.response.headers.get(COOKIE_TOKEN_KEY) ||
        ctx.response.headers.get("set-auth-token");
      if (authToken) {
        sessionStorage.setItem(TOKEN_KEY, authToken);
      }
    },
    // 👇 Auto-attach token to every request
    auth: {
      type: "Bearer",
      token: () => sessionStorage.getItem(TOKEN_KEY) || "",
    },
  },
  plugins: [
    usernameClient(),
    jwtClient(),
    twoFactorClient(),
    passkeyClient(),
    multiSessionClient(),
    adminClient(), // 👈 this is what adds role to the session type
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      // Optional client configuration:
      autoSelect: false,
      cancelOnTapOutside: true,
      context: "signin",
      additionalOptions: {
        // Pass the mandatory FedCM flag to the underlying Google initializer
        use_fedcm_for_prompt: true,
        // Any extra options for the Google initialize method
      },
      // Configure prompt behavior and exponential backoff:
      promptOptions: {
        baseDelay: 1000, // Base delay in ms (default: 1000)
        maxAttempts: 5, // Maximum number of attempts before triggering onPromptNotification (default: 5)
      },
    }),
  ],
});

export type ClientSession = typeof authClient.$Infer.Session;
export type ClientUser = ClientSession["user"];
