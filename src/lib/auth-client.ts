// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  twoFactorClient,
  multiSessionClient,
  oneTapClient,
  adminClient, // 👈 add this — it adds role to the inferred type
} from "better-auth/client/plugins";

import { passkeyClient } from "@better-auth/passkey/client";

export const authClient = createAuthClient({
  // 👆 Just the origin — Better Auth appends /api/auth internally
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  plugins: [
    usernameClient(),
    twoFactorClient(),
    passkeyClient(),
    multiSessionClient(),
    adminClient(), // 👈 this is what adds role to the session type
    // oneTapClient(),
  ],
});

export type ClientSession = typeof authClient.$Infer.Session;
export type ClientUser = ClientSession["user"];
