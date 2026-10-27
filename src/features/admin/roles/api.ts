import { z } from "zod";
import { API_URL, TOKEN_KEY } from "@/types/constants";
export const permissionSchema = z.object({
  id: z.number().int(),
  action: z.string(),
  subject: z.string(),
  supported: z.boolean(),
});
export const roleSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  isEnabled: z.boolean(),
  objectVersionId: z.number().int().positive(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userCount: z.number().int().nonnegative(),
  isProtected: z.boolean(),
  permissions: z.array(permissionSchema),
});
export const roleInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_-]*$/,
      "Use letters, numbers and underscores; start with a letter.",
    )
    .transform((value) => value.toUpperCase().replaceAll("-", "_")),
  description: z.string().trim().max(255).nullable(),
  icon: z.string().nullable(),
  color: z
    .string()
    .regex(
      /^#[0-9a-fA-F]{6}$/,
      "Use a six-digit hex color, for example #1565c0.",
    )
    .nullable(),
  isEnabled: z.boolean(),
  permissionIds: z.array(z.number().int().positive()),
});
export const metadataSchema = z.object({
  canManage: z.boolean(),
  permissions: z.array(permissionSchema),
  icons: z.array(z.object({ value: z.string(), label: z.string() })),
});
export type ApplicationRole = z.infer<typeof roleSchema>;
export type RoleInput = z.infer<typeof roleInputSchema>;
export type RoleMetadata = z.infer<typeof metadataSchema>;
export type RoleMode = "create" | "edit" | "delete";
export class RoleRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "RoleRequestError";
  }
}
async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
) {
  const origin = API_URL.replace(/\/(?:api(?:\/v1)?)?\/?$/, "").replace(
    /\/$/,
    "",
  );
  const token =
    typeof window === "undefined" ? null : sessionStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${origin}/api/v1/roles${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok)
    throw new RoleRequestError(
      body &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
        ? body.message
        : `Role request failed (${response.status}).`,
      response.status,
      body &&
        typeof body === "object" &&
        "code" in body &&
        typeof body.code === "string"
        ? body.code
        : undefined,
    );
  return schema.parse(
    body && typeof body === "object" && "data" in body ? body.data : body,
  );
}
export const rolesApi = {
  metadata: (signal?: AbortSignal) =>
    request("/metadata", metadataSchema, { signal }),
  list: (signal?: AbortSignal) => request("", z.array(roleSchema), { signal }),
  get: (id: number, signal?: AbortSignal) =>
    request(`/${id}`, roleSchema, { signal }),
  save: (input: RoleInput, record?: ApplicationRole) =>
    request(record ? `/${record.id}` : "", roleSchema, {
      method: record ? "PATCH" : "POST",
      body: JSON.stringify({
        ...roleInputSchema.parse(input),
        ...(record ? { version: record.objectVersionId } : {}),
      }),
    }),
  remove: (record: ApplicationRole) =>
    request(`/${record.id}`, roleSchema, {
      method: "DELETE",
      body: JSON.stringify({ version: record.objectVersionId }),
    }),
};
