// src/providers/authProvider.ts
"use client";

import { AuthActionResponse, AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";
import {
  clearAuthCookies,
  clearAxiosAuth,
  setupAxiosAuth,
} from "./dataProvider";
import type { ClientUser } from "@/lib/auth-client";
import { SignInResult } from "@/types/auth";

// ── Helpers ───────────────────────────────────────────────────────────────────

const getCallbackUrl = (fallback: string): string => {
  if (typeof window === "undefined") return fallback;
  const params = new URLSearchParams(window.location.search);
  return params.get("callbackUrl") ?? fallback;
};

// ── Auth Provider ─────────────────────────────────────────────────────────────

export const authProvider: AuthProvider = {
  // ── Sign in ────────────────────────────────────────────────────────────────
  login: async ({ identifier, password, captchaToken }) => {
    const headers = captchaToken
      ? { "x-captcha-response": captchaToken }
      : undefined;

    // Try username first, fall back to email
    let result: SignInResult = await authClient.signIn.username({
      username: identifier,
      password,
      fetchOptions: { headers },
      /**
       * A URL to redirect to after the user verifies their email (optional)
       */
      callbackURL: "/dashboard",
      /**
       * remember the user session after the browser is closed.
       * @default true
       */
      rememberMe: false,
    });

    if (result.error?.status === 422 || result.error?.status === 404) {
      // Not a valid username — try as email
      result = await authClient.signIn.email({
        email: identifier,
        password,
        fetchOptions: { headers },
        /**
         * A URL to redirect to after the user verifies their email (optional)
         */
        callbackURL: "/dashboard",
        /**
         * remember the user session after the browser is closed.
         * @default true
         */
        rememberMe: false,
      });
    }

    const { data, error } = result;

    // const { data, error } = await authClient.signIn.username({
    //   username: identifier,
    //   password,
    // });

    // const { data, error } = isEmail
    //   ? await authClient.signIn.email({ email: identifier, password })
    //   : await authClient.signIn.username({ username: identifier, password });

    if (error || !data)
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.message || error.statusText || "Invalid credentials",
          statusCode: error?.status ?? 401,
        },
      };

    // Better Auth sessions are cookie-based — no token to store.
    // Only call setupAxiosAuth if your dataProvider uses Bearer tokens
    // via the JWT plugin. If you're using cookie-based auth, remove this.
    if (data.token) setupAxiosAuth(data.token);

    // Respect the callbackUrl if present
    // if (typeof window !== "undefined") {
    //   const params = new URLSearchParams(window.location.search);
    //   const callbackUrl = params.get("callbackUrl");
    //   if (callbackUrl) return { success: true, redirectTo: callbackUrl };
    // }

    return { success: true, redirectTo: getCallbackUrl("/dashboard") };
  },

  // logout: async () => {
  //   await authClient.signOut();
  //   clearAxiosAuth();
  //   return { success: true, redirectTo: "/login" };
  // },

  // ── Sign out ───────────────────────────────────────────────────────────────
  logout: async (): Promise<AuthActionResponse> => {
    const { error } = await authClient.signOut({
      fetchOptions: {
        // credentials: "include",
        // Override baseURL just for this call
        // baseURL: process.env.NEXT_PUBLIC_API_URL,
        onSuccess: () => {
          // handled by Refine's redirectTo below
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          name: "LogoutError",
          message: error.message ?? "Logout failed",
          statusCode: error.status ?? 500,
        },
      };
    }

    // Clear all auth-related cookies
    clearAuthCookies();
    clearAxiosAuth();
    return { success: true, redirectTo: "/login" };
  },

  // ── Session check (called on every route) ─────────────────────────────────
  check: async () => {
    try {
      // const session = await authClient.getSession();
      const { data: session, error } = await authClient.getSession();
      if (error || !session)
        return {
          authenticated: false,
          redirectTo: "/login",
          error: {
            name: "Unauthorized",
            message: "No active session",
            statusCode: 401,
          },
        };
      console.log("Session data:", session);
      return { authenticated: true };
    } catch (error) {
      console.error("Error occurred while checking authentication:", error);
      return {
        authenticated: false,
        redirectTo: "/login",
        error: {
          name: "SessionError",
          message:
            error instanceof Error ? error.message : "Session check failed",
          statusCode: 401,
        },
        // redirectTo: "/login",
        // error: error as Error,
      };
    }
  },

  // ── Register ───────────────────────────────────────────────────────────────
  register: async (params): Promise<AuthActionResponse> => {
    // async (
    //   payload: {
    //     email: string;
    //     username: string;
    //     password: string;
    //     name: string;
    //   },
    //   redirectPath?: string,
    // ) => {
    // Refine passes whatever you call register() with — cast to your shape
    const { email, username, password, name } = params as {
      email: string;
      username: string;
      password: string;
      name: string;
    };

    const { data, error } = await authClient.signUp.email({
      email,
      username,
      password,
      name,
    });

    // const { data, error } = await authClient.signUp.email(payload);

    if (error || !data)
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: error.message || error.statusText || "Registration failed",
          statusCode: error?.status ?? 400,
          // message: error.message || error.statusText || "Login failed",
          // statusCode: error.status,
          // name: "Invalid Credentials",
        },
      };

    return {
      success: true,
      // Stay on login so user verifies email before entering the app
      redirectTo: "/login",
      // redirectTo: redirectPath || "/login",
      // error,
      successNotification: {
        message: "Registration Successful",
        description: `Welcome, ${data.user.name}! Please check your email to verify your account.`,
      },
    };
  },

  // ── Identity (used by useGetIdentity / <ThemedLayoutV2>) ──────────────────
  getIdentity: async () => {
    try {
      const { data: session, error } = await authClient.getSession();

      if (error || !session?.user) return null;
      const user = session.user as ClientUser;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.image ?? undefined,
        role: user.role, // ✅ now typed correctly
      };
    } catch {
      return null;
    }

    // const session = await authClient.getSession();
    // if (!session.data?.user) return null;
    // return {
    //   id: session.data.user.id,
    //   name: session.data.user.name,
    //   avatar: session.data.user.image,
    // };
  },

  // ── Permissions (wire up CASL here later) ─────────────────────────────────
  getPermissions: async () => {
    try {
      const { data: session } = await authClient.getSession();
      // return session?.user?.role ?? null;
      return (session?.user as ClientUser | undefined)?.role ?? null;
    } catch {
      return null;
    }
  },

  // ── Error handler ──────────────────────────────────────────────────────────
  onError: async (error) => {
    // Refine uses statusCode, not status
    const statusCode = error?.statusCode ?? error?.status;
    if (statusCode === 401 || statusCode === 403) {
      return { logout: true, redirectTo: "/login" };
    }
    // if (error?.status === 401 || error.status === 403) return { logout: true };
    return { error };
  },
};

export default authProvider;
