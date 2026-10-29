import { adminSocialLinks, profileInputSchema, providerInputSchema, socialApi, socialApiUrl } from "./api";
import { TOKEN_KEY } from "@/types/constants";

const provider = { id: 1, key: "telegram", name: "Telegram", websiteUrl: "https://t.me", icon: "telegram", isEnabled: true };
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; sessionStorage.clear(); });

it("uses versioned endpoints, cookies and the current bearer token and unwraps envelopes", async () => {
  sessionStorage.setItem(TOKEN_KEY, "test-token");
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ requestStatus: "SUCCESS", data: [provider] }) });
  expect(await socialApi.providers()).toEqual([provider]);
  expect(global.fetch).toHaveBeenCalledWith(socialApiUrl("social-providers"), expect.objectContaining({ credentials: "include", headers: expect.objectContaining({ Authorization: "Bearer test-token" }) }));
  expect(socialApiUrl("social-providers")).toMatch(/\/api\/v1\/social-providers$/);
});

it("preserves server conflict messages and rejects unsafe or malformed input", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 409, json: async () => ({ message: "Provider is in use" }) });
  await expect(socialApi.deleteProvider(1)).rejects.toThrow("Provider is in use");
  expect(providerInputSchema.safeParse({ ...provider, key: "bad key" }).success).toBe(false);
  expect(profileInputSchema.safeParse({ providerId: 1, handle: "admin", url: "javascript:alert(1)" }).success).toBe(false);
});

it("uses user-scoped profile paths and validates returned records", async () => {
  const profile = { id: 5, providerId: 1, handle: "admin", url: "https://t.me/admin", provider };
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: profile }) });
  await socialApi.saveProfile(12, { providerId: 1, handle: "admin", url: profile.url }, 5);
  expect(global.fetch).toHaveBeenCalledWith(socialApiUrl("users/12/social-profiles/5"), expect.objectContaining({ method: "PATCH" }));
});

it("only publishes enabled profiles with safe explicit URLs", () => {
  const profile = { id: 5, providerId: 1, handle: "admin", url: "https://t.me/admin", provider };
  const links = adminSocialLinks({ name: "Admin", socialProfiles: [profile, { ...profile, id: 6, provider: { ...provider, isEnabled: false } }, { ...profile, id: 7, url: "javascript:alert(1)" }, { ...profile, id: 8, url: null }] });
  expect(links).toHaveLength(1);
  expect(links[0]).toMatchObject({ id: 5, href: "https://t.me/admin" });
  expect(adminSocialLinks(null)).toEqual([]);
});

it("retains provider timestamps supplied by the existing list endpoint", async () => {
 const stored = { ...provider, createdAt: "2026-10-27T00:00:00Z", updatedAt: "2026-10-28T00:00:00Z" };
 global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [stored] }) });
 expect(await socialApi.providers()).toEqual([stored]);
});
