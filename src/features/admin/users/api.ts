import type { ColumnFiltersState, SortingState } from "@tanstack/table-core";
import { z } from "zod";
import { API_URL, TOKEN_KEY } from "@/types/constants";
import { authClient } from "@/lib/auth-client";
export const userSchema = z.object({ id: z.coerce.string(), name: z.string(), email: z.string(), role: z.string().nullish(), banned: z.boolean().nullish(), emailVerified: z.boolean().optional(), image: z.string().nullish(), roleId: z.number().nullish(), username: z.string().nullish() });
export const roleSchema = z.object({ id: z.number(), name: z.string(), description: z.string().nullish(), icon: z.string().nullish(), color: z.string().nullish() });
export type UserRole = z.infer<typeof roleSchema>;
export const userDetailSchema = userSchema.extend({
  userRole: roleSchema.nullish(),
  profile: z.object({ firstName: z.string(), lastName: z.string(), phone: z.string().nullish(), email: z.string().nullish(), bio: z.string().nullish() }).nullish(),
  accounts: z.array(z.object({ id: z.coerce.string(), providerId: z.string(), createdAt: z.string().optional() })).default([]),
});
export type AdminUserDetail = z.infer<typeof userDetailSchema>;
async function displayRequest<T>(path: string, schema: z.ZodType<T>, signal?: AbortSignal, payload?: unknown): Promise<T> {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const origin = API_URL.replace(/\/(?:api(?:\/v1)?)?\/?$/, "").replace(/\/$/, "");
  const response = await fetch(`${origin}/api/v1/users/${path}`, { signal, credentials: "include", ...(payload ? { method: "POST", body: JSON.stringify(payload) } : {}), headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body && typeof body === "object" && "message" in body && typeof body.message === "string" ? body.message : "Could not load user details.");
    const data = body && typeof body === "object" && "data" in body ? body.data : body;
    if (data == null && path.endsWith("/admin-detail")) throw new Error("User not found.");
    return schema.parse(data);
}
export type AdminUser = z.infer<typeof userSchema>;
export type UserMode = "create" | "edit" | "delete";
export const userInputSchema = z.object({ name: z.string().trim().min(1).max(100), email: z.email(), password: z.string() });
function unwrap<T>(result: { data: T; error: null } | { data: null; error: { message?: string } }): NonNullable<T> {
  if (result.error) throw new Error(result.error.message || "User request failed.");
  if (result.data == null) throw new Error("The server returned an empty response.");
  return result.data as NonNullable<T>;
}
export const usersApi = {
  roles: (signal?: AbortSignal) => displayRequest("admin-roles", z.array(roleSchema), signal),
  detail: (id: string, signal?: AbortSignal) => displayRequest(`${encodeURIComponent(id)}/admin-detail`, userDetailSchema, signal),
  async list(pageIndex: number, pageSize: number, search: string, filters: ColumnFiltersState = [], sorting: SortingState = [], signal?: AbortSignal) {
    const query = {
      page: pageIndex + 1, pageSize,
      sorting: sorting.map(item => ({ field: item.id, direction: item.desc ? "desc" : "asc" })),
      filters: filters.filter(item => item.value !== "" && item.value != null).map(item => ({
        field: item.id, operator: item.id === "role" || item.id === "banned" ? "equals" : "contains",
        value: item.id === "role" ? Number(item.value) : item.id === "banned" ? item.value === "true" || item.value === true : item.value,
      })),
      ...(search.trim() ? { search: { term: search.trim() } } : {}),
    };
    return displayRequest("query", z.object({ users: z.array(userSchema), total: z.number().int().nonnegative() }), signal, query);
  },
  async get(id: string) { return userSchema.parse(unwrap(await authClient.admin.getUser({ query: { id } }))); },
  async save(mode: UserMode, input: z.infer<typeof userInputSchema>, record?: AdminUser) {
    if (mode === "delete") {
      if (!record) throw new Error("User not found.");
      unwrap(await authClient.admin.removeUser({ userId: record.id })); return record;
    }
    const fields = userInputSchema.parse(input);
    if (mode === "create") {
      if (fields.password.length < 8) throw new Error("Use a password with at least 8 characters.");
      const data = unwrap(await authClient.admin.createUser(fields)); return userSchema.parse(data.user);
    }
    if (!record) throw new Error("User not found.");
    const data = unwrap(await authClient.admin.updateUser({ userId: record.id, data: { name: fields.name, email: fields.email } }));
    return userSchema.parse(data);
  },
};
