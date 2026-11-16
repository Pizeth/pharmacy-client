import { usersApi, userSchema } from "./api";
import { authClient } from "@/lib/auth-client";
jest.mock("@/lib/auth-client", () => ({ authClient: { admin: { createUser: jest.fn() } } }));
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; jest.restoreAllMocks(); });
it("sends the validated username through Better Auth's additional data", async () => {
 const user = { id: "12", name: "Jane", email: "jane@example.com" };
 const create = jest.mocked(authClient.admin.createUser).mockResolvedValue({ data: { user }, error: null } as Awaited<ReturnType<typeof authClient.admin.createUser>>);
 await usersApi.save("create", { name: "Jane", username: "Jane1", email: user.email, password: "12345678" });
 expect(create).toHaveBeenCalledWith({ name: "Jane", email: user.email, password: "12345678", data: { username: "jane1", displayUsername: "Jane1" } });
});
it("shows a readable not-found message for an empty detail response", async () => {
 global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => null } as Response);
 await expect(usersApi.detail("123")).rejects.toThrow("User not found.");
});
it("sends combined filters and sorting through the shared server-query contract", async () => {
 const fetch = jest.fn<Promise<Response>, Parameters<typeof global.fetch>>().mockResolvedValue({ ok: true, json: async () => ({ users: [], total: 0 }) } as Response);
 global.fetch = fetch;
 await usersApi.list(2, 25, " Jane ", [{ id: "name", value: "Jane" }, { id: "role", value: "2" }, { id: "banned", value: "false" }], [{ id: "email", desc: true }]);
 const [url, init] = fetch.mock.calls[0];
 expect(String(url)).toContain("/api/v1/users/query"); expect(init?.method).toBe("POST");
 expect(JSON.parse(String(init?.body))).toEqual({ page: 3, pageSize: 25, search: { term: "Jane" }, sorting: [{ field: "email", direction: "desc" }], filters: [{ field: "name", operator: "contains", value: "Jane" }, { field: "role", operator: "equals", value: 2 }, { field: "banned", operator: "equals", value: false }] });
});

it("retains safe account timestamps and ban metadata for dedicated details", () => {
 const data = userSchema.parse({ id: 12, name: "Jane", email: "jane@example.com", createdAt: new Date("2026-10-27T00:00:00Z"), updatedAt: "2026-10-28T00:00:00Z", banReason: "Review required", banExpires: null, passwordHash: "must-not-be-returned" });
 expect(data).toMatchObject({ createdAt: "2026-10-27T00:00:00.000Z", updatedAt: "2026-10-28T00:00:00Z", banReason: "Review required", banExpires: null });
 expect(data).not.toHaveProperty("passwordHash");
});
