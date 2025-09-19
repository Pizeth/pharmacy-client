// lib/authProvider.ts
import { AuthTokens, User } from "@/interfaces/user.interface";
import { AuthProvider } from "react-admin";

class OidcAuthProvider implements AuthProvider {
  private readonly backendUrl: string;
  private readonly storageKeys = {
    user: "oidc_user",
    tokens: "oidc_tokens",
  };

  constructor(backendUrl?: string) {
    this.backendUrl =
      backendUrl ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:3000";
  }

  // Check if user is authenticated
  async checkAuth(): Promise<void> {
    const user = this.getStoredUser();
    const tokens = this.getStoredTokens();

    if (!user || !tokens) {
      throw new Error("Not authenticated");
    }

    // Check if token is expired
    if (tokens.expiresAt && Date.now() > tokens.expiresAt) {
      // Try to refresh token
      try {
        await this.refreshTokens();
      } catch (error) {
        console.log("Token refresh failed:", error);
        // Refresh failed, user needs to login again
        this.clearAuth();
        throw new Error("Token expired");
      }
    }
  }

  // Login - this is called when user is redirected back from OIDC provider
  async login({ token, ...params }: Request) {
    // If we have a token from URL params (callback), validate it with backend
    if (token) {
      try {
        const response = await fetch(`${this.backendUrl}/auth/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
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

    // Check if user is already authenticated (e.g., page refresh)
    const storedUser = this.getStoredUser();
    if (storedUser) {
      return storedUser;
    }

    // If no stored user and no token, user needs to login
    // This will redirect to login page
    return Promise.reject({
      redirectTo: "/auth/login",
      message: "Please log in to continue",
    });
  }

  // Logout
  async logout(): Promise<void | false | string> {
    const user = this.getStoredUser();

    // Clear local storage
    this.clearAuth();

    // If user was authenticated via OIDC, redirect to provider logout
    if (user?.provider) {
      try {
        // Call backend logout endpoint to handle OIDC provider logout
        const response = await fetch(
          `${this.backendUrl}/auth/${user.provider}/logout`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.redirected) {
          // Backend is redirecting to OIDC provider logout
          window.location.href = response.url;
          return false; // Prevent React Admin redirect
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    // Default redirect to login page
    return "/auth/login";
  }

  // Check error from API calls
  checkError(error: any): Promise<void> {
    const status = error.status;

    if (status === 401 || status === 403) {
      this.clearAuth();
      return Promise.reject({
        redirectTo: "/auth/login",
        message: "Session expired. Please log in again.",
      });
    }

    return Promise.resolve();
  }

  // Get permissions (optional - implement based on your needs)
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
  handleOAuthCallback(searchParams: URLSearchParams): Promise<User | null> {
    const authSuccess = searchParams.get("auth");
    const error = searchParams.get("error");

    if (error) {
      return Promise.reject(new Error(decodeURIComponent(error)));
    }

    if (authSuccess === "success") {
      // The backend should have set session cookies
      // We need to validate the session with the backend
      return this.validateSession();
    }

    return Promise.resolve(null);
  }

  private async validateSession(): Promise<User | null> {
    try {
      const response = await fetch(`${this.backendUrl}/auth/me`, {
        credentials: "include", // Important: include cookies
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
}

// Create and export the auth provider instance
export const authProvider = new OidcAuthProvider();

// Custom hook for handling OAuth callbacks in your app
export function useOAuthCallback() {
  const handleCallback = async (searchParams: URLSearchParams) => {
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
