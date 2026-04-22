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
