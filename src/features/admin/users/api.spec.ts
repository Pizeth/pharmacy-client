import { usersApi } from "./api";
jest.mock("@/lib/auth-client", () => ({ authClient: { admin: {} } }));
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; jest.restoreAllMocks(); });
it("sends combined filters and sorting through the shared server-query contract", async () => {
 const fetch = jest.fn<Promise<Response>, Parameters<typeof global.fetch>>().mockResolvedValue({ ok: true, json: async () => ({ users: [], total: 0 }) } as Response);
 global.fetch = fetch;
 await usersApi.list(2, 25, " Jane ", [{ id: "name", value: "Jane" }, { id: "role", value: "2" }, { id: "banned", value: "false" }], [{ id: "email", desc: true }]);
 const [url, init] = fetch.mock.calls[0];
 expect(String(url)).toContain("/api/v1/users/query"); expect(init?.method).toBe("POST");
 expect(JSON.parse(String(init?.body))).toEqual({ page: 3, pageSize: 25, search: { term: "Jane" }, sorting: [{ field: "email", direction: "desc" }], filters: [{ field: "name", operator: "contains", value: "Jane" }, { field: "role", operator: "equals", value: 2 }, { field: "banned", operator: "equals", value: false }] });
});
