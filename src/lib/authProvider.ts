// lib/authProvider.ts
import AppError from "@/exceptions/app.exception";
import { AuthTokens, LoginParams } from "@/interfaces/auth.interface";
import { User } from "@/interfaces/user.interface";
import { StatusCodes } from "http-status-codes";
import { AuthProvider } from "react-admin";

class OidcAuthProvider implements AuthProvider {
  private readonly context = OidcAuthProvider.name;
  private readonly backendUrl: string;
  private readonly storageKeys = {
    user: "oidc_user",
    tokens: "oidc_tokens",
  };

  constructor(backendUrl?: string) {
    this.backendUrl =
      backendUrl ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000/api/v1";
  }

  // Check if user is authenticated
  async checkAuth(): Promise<void> {
    const user = this.getStoredUser();
    const tokens = this.getStoredTokens();

    if (!user || !tokens) {
      throw new AppError(
        "razeth.auth.not_authenticated",
        StatusCodes.UNAUTHORIZED,
        this.context,
        { cause: "No user or tokens found in storage" }
      );
    }

    // Check if token is expired
    if (tokens.expiresAt && Date.now() > tokens.expiresAt) {
      try {
        await this.refreshTokens();
      } catch (error) {
        console.error("Token refresh failed:", error);
        this.clearAuth();
        throw new AppError(
          "Token expired",
          StatusCodes.UNAUTHORIZED,
          this.context,
          { cause: "Token refresh failed" }
        );
      }
    }
  }

  // Login - handles both form login and OIDC callback
  async login(params: LoginParams) {
    // Handle OIDC callback with token
    if (params.token) {
      try {
        const response = await fetch(`${this.backendUrl}/auth/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${params.token}`,
          },
          body: JSON.stringify({ token: params.token }),
        });

        if (response.ok) {
          const data = await response.json();
          this.storeAuth(data.user, data.tokens);
          return data.user;
        }
      } catch (error) {
        console.error("Token validation failed:", error);
      }
    }

    // Handle form login
    if (params.email && params.password) {
      try {
        const response = await fetch(`${this.backendUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: params.email,
            password: params.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          this.storeAuth(data.user, data.tokens || {});
          return data.user;
        } else {
          throw new Error(data.message || "Login failed");
        }
      } catch (error) {
        throw error instanceof Error ? error : new Error("Login failed");
      }
    }

    // Check if user is already authenticated (e.g., page refresh)
    const storedUser = this.getStoredUser();
    if (storedUser) {
      return storedUser;
    }

    // If no stored user and no valid login params, user needs to login
    return Promise.reject({
      redirectTo: "/auth/login",
      message: "Please log in to continue",
    });
  }

  // Logout
  async logout(): Promise<void | false | string> {
    const user = this.getStoredUser();

    // Clear local storage first
    this.clearAuth();

    // If user was authenticated via OIDC, redirect to provider logout
    if (user?.provider && user.provider !== "local") {
      try {
        const response = await fetch(
          `${this.backendUrl}/auth/${user.provider}/logout`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.redirected) {
          window.location.href = response.url;
          return false; // Prevent React Admin redirect
        }
      } catch (error) {
        console.error("OIDC logout error:", error);
      }
    } else {
      // For local auth, call logout endpoint
      try {
        await fetch(`${this.backendUrl}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    return "/auth/login";
  }

  // Check error from API calls
  checkError(error: unknown): Promise<void> {
    const status = error instanceof AppError ? error.statusCode : undefined;

    if (status === 401 || status === 403) {
      this.clearAuth();
      return Promise.reject({
        redirectTo: "/auth/login",
        message: "Session expired. Please log in again.",
      });
    }

    return Promise.resolve();
  }

  // Get permissions
  async getPermissions(): Promise<string[]> {
    const user = this.getStoredUser();
    return user?.roles || [];
  }

  // Get current user identity
  async getIdentity(): Promise<{
    id: string;
    fullName: string;
    avatar?: string;
  }> {
    const user = this.getStoredUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    return {
      id: user.id,
      fullName: user.name || user.email,
      avatar: user.avatar,
    };
  }

  // Helper methods
  private getStoredUser(): User | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(this.storageKeys.user);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private getStoredTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(this.storageKeys.tokens);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private storeAuth(user: User, tokens: AuthTokens): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
    localStorage.setItem(this.storageKeys.tokens, JSON.stringify(tokens));
  }

  private clearAuth(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.storageKeys.user);
    localStorage.removeItem(this.storageKeys.tokens);
  }

  private async refreshTokens(): Promise<void> {
    const tokens = this.getStoredTokens();

    if (!tokens?.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${this.backendUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: tokens.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    const user = this.getStoredUser();

    if (user) {
      this.storeAuth(user, data.tokens);
    }
  }

  // Method to handle successful OAuth callback
  handleOAuthCallback(
    searchParams: Record<string, string>
  ): Promise<User | null> {
    // If you need URLSearchParams, reconstruct it:
    const urlParams = new URLSearchParams(searchParams);
    const authSuccess = urlParams.get("auth");
    const error = urlParams.get("error");

    if (error) {
      return Promise.reject(new Error(decodeURIComponent(error)));
    }

    if (authSuccess === "success") {
      return this.validateSession();
    }

    return Promise.resolve(null);
  }

  // Validate session after OAuth callback
  private async validateSession(): Promise<User | null> {
    try {
      const response = await fetch(`${this.backendUrl}/auth/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.storeAuth(data.user, data.tokens || {});
        return data.user;
      }
    } catch (error) {
      console.error("Session validation failed:", error);
    }

    return null;
  }

  // Check if user is authenticated for initial load
  async checkInitialAuth(): Promise<User | null> {
    // First check local storage
    const storedUser = this.getStoredUser();
    if (storedUser) {
      try {
        await this.checkAuth();
        return storedUser;
      } catch {
        // Token expired or invalid, try to validate session
        try {
          return await this.validateSession();
        } catch {
          this.clearAuth();
          return null;
        }
      }
    }

    // If no stored user, try to validate session (in case of fresh OAuth callback)
    try {
      return await this.validateSession();
    } catch {
      return null;
    }
  }
}

// Create and export the auth provider instance
export const authProvider = new OidcAuthProvider();

// Custom hook for handling OAuth callbacks
export function useOAuthCallback() {
  const handleCallback = async (searchParams: Record<string, string>) => {
    try {
      const user = await authProvider.handleOAuthCallback(searchParams);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      };
    }
  };

  return { handleCallback };
}
