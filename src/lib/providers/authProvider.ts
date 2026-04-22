// src/providers/authProvider.ts
"use client";

import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";
import { clearAxiosAuth, setupAxiosAuth } from "./dataProvider";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error)
      return {
        success: false,
        error: {
          message: error.message || error.statusText || "Login failed",
          statusCode: error.status,
          name: "Invalid Credentials",
        },
      };

    setupAxiosAuth(data.token);

    // Respect the callbackUrl if present
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get("callbackUrl");
      if (callbackUrl) return { success: true, redirectTo: callbackUrl };
    }

    return { success: true, redirectTo: "/admin" };
  },

  logout: async () => {
    await authClient.signOut();
    clearAxiosAuth();
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    try {
      const session = await authClient.getSession();
      if (!session.data)
        return {
          authenticated: false,
          redirectTo: "/login",
          error: {
            statusCode: 401,
            message: "Check failed",
            name: "Unauthorized",
          },
        };
      return { authenticated: true };
    } catch (error) {
      return { authenticated: false, redirectTo: "/login" };
    }
  },

  getPermissions: async () => null,
  getIdentity: async () => {
    const session = await authClient.getSession();
    if (!session.data?.user) return null;
    return {
      id: session.data.user.id,
      name: session.data.user.name,
      avatar: session.data.user.image,
    };
  },

  onError: async (error) => {
    if (error?.status === 401 || error.status === 403) return { logout: true };
    return { error };
  },
};

export default authProvider;
