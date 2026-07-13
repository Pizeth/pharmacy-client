// providers/data-provider.ts
import dataProvider, { axiosInstance } from "@refinedev/nestjsx-crud";

// Attach better-auth session token to every request
export function setupAxiosAuth(token: string) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearAxiosAuth() {
  delete axiosInstance.defaults.headers.common["Authorization"];
}

export const nestjsDataProvider = dataProvider(
  process.env.NEXT_PUBLIC_API_URL!,
  axiosInstance,
);

// src/utils/clearAuthCookies.ts
export const clearAuthCookies = () => {
  if (typeof document === "undefined") return;

  const cookiesToClear = [
    "razeth.session_token",
    "__Secure-razeth.session_token",
    "razeth.session_token_multi",
    "__Secure-razeth.session_token_multi",
    "razeth.state",
    "__Secure-razeth.state",
    "better-auth.last_used_login_method",
  ];

  // Clear for current domain and all variations
  const domains = [
    undefined, // current domain
    "localhost",
    ".razeth.com",
    "razeth.com",
  ];

  const paths = ["/", "/api", "/api/auth"];

  cookiesToClear.forEach((name) => {
    domains.forEach((domain) => {
      paths.forEach((path) => {
        const domainStr = domain ? `;domain=${domain}` : "";
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}${domainStr}`;
      });
    });
  });
};
