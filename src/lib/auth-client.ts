// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // If your Next.js and NestJS are on different domains:
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});
