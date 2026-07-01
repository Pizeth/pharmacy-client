// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  twoFactorClient,
  multiSessionClient,
  oneTapClient,
  // oneTap,
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
    // oneTapClient(),
  ],
});
