import { z } from "zod";
import { API_URL, TOKEN_KEY } from "@/types/constants";

export const providerSchema = z.object({
  id: z.number(), key: z.string(), name: z.string(), websiteUrl: z.string().nullable(),
  icon: z.string().nullable(), isEnabled: z.boolean(),
});
export const providerInputSchema = z.object({
  key: z.string().trim().toLowerCase().min(1).max(50).regex(/^[a-z][a-z0-9_-]*$/),
  name: z.string().trim().min(1).max(100),
  websiteUrl: z.url({ protocol: /^https?$/ }).max(2048).nullable(),
  icon: z.string().trim().min(1).max(255).nullable(), isEnabled: z.boolean(),
});
export const profileSchema = z.object({
  id: z.number(), providerId: z.number(), handle: z.string(), url: z.string().nullable(), provider: providerSchema,
});
export const profileInputSchema = z.object({
  providerId: z.number().int().positive(), handle: z.string().trim().min(1).max(255),
  url: z.url({ protocol: /^https?$/ }).max(2048).nullable(),
});
export const adminContactSchema = z.object({
  name: z.string(), email: z.string().nullable().optional(), phone: z.string().nullable().optional(),
  socialProfiles: z.array(profileSchema).default([]),
}).nullable();
export type SocialProvider = z.infer<typeof providerSchema>;
export type SocialProfile = z.infer<typeof profileSchema>;
export type AdminContact = z.infer<typeof adminContactSchema>;
export type ProviderInput = z.infer<typeof providerInputSchema>;
export type ProfileInput = z.infer<typeof profileInputSchema>;

export function socialApiUrl(path: string) {
  return `${API_URL.replace(/\/(?:api(?:\/v1)?)?\/?$/, "").replace(/\/$/, "")}/api/v1/${path}`;
}

async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  const token = typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);
  const response = await fetch(socialApiUrl(path), {
    ...init, credentials: "include",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body && typeof body === "object" && "message" in body ? body.message : null;
    throw new Error(typeof message === "string" ? message : `Request failed (${response.status})`);
  }
  const data = body && typeof body === "object" && "data" in body ? body.data : body;
  return schema.parse(data);
}

export const socialApi = {
  providers: (signal?: AbortSignal) => request("social-providers", z.array(providerSchema), { signal }),
  saveProvider: (data: ProviderInput, id?: number) => request(`social-providers${id ? `/${id}` : ""}`, providerSchema, { method: id ? "PATCH" : "POST", body: JSON.stringify(providerInputSchema.parse(data)) }),
  deleteProvider: (id: number) => request(`social-providers/${id}`, providerSchema, { method: "DELETE" }),
  profiles: (userId: number, signal?: AbortSignal) => request(`users/${userId}/social-profiles`, z.array(profileSchema), { signal }),
  saveProfile: (userId: number, data: ProfileInput, id?: number) => request(`users/${userId}/social-profiles${id ? `/${id}` : ""}`, profileSchema, { method: id ? "PATCH" : "POST", body: JSON.stringify(profileInputSchema.parse(data)) }),
  deleteProfile: (userId: number, id: number) => request(`users/${userId}/social-profiles/${id}`, profileSchema, { method: "DELETE" }),
  contact: (signal?: AbortSignal) => request("users/contact/super-admin", adminContactSchema, { signal }),
};

export function safeSocialUrl(url: string | null | undefined): string | undefined {
  try { const parsed = new URL(url ?? ""); return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : undefined; }
  catch { return undefined; }
}

export function adminSocialLinks(contact: AdminContact) {
  return (contact?.socialProfiles ?? []).flatMap(profile => {
    const href = safeSocialUrl(profile.url);
    return profile.provider.isEnabled && href ? [{ id: profile.id, key: profile.provider.key, icon: profile.provider.icon, name: profile.provider.name, href }] : [];
  });
}
