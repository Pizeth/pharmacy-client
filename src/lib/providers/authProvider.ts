// src/providers/authProvider.ts
"use client";

import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) {
      console.log("Login error: ", error);
      return {
        success: false,
        error: new Error(error.message),
        redirectTo: "/login",
      };
    }
    return { success: true, redirectTo: "/" };
  },
  logout: async () => {
    await authClient.signOut();
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (session) return { authenticated: true };
      return { authenticated: false };
    } catch (error) {
      // console.error("Error checking authentication: ", error);
      return { authenticated: false };
    }
    // const { data: session } = await authClient.useSession();
    // const { data: session } = await authClient.getSession();
    // console.log("Session data: ", session);
    // if (session) return { authenticated: true };
    // return { authenticated: false, redirectTo: "/login" };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const { data: session } = await authClient.useSession();
    return session?.user ?? null;
  },
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return { logout: true };
    }
    return { error };
  },
};

export default authProvider;
