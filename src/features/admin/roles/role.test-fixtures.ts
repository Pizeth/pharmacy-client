import type { ApplicationRole, RoleMetadata } from "./api";
export const permission = {
  id: 1,
  action: "read",
  subject: "TranslationKey",
  supported: true,
};
export const roleMetadata: RoleMetadata = {
  canManage: true,
  permissions: [
    permission,
    { id: 2, action: "fly", subject: "Legacy", supported: false },
  ],
  icons: [
    { value: "shield", label: "Shield" },
    { value: "badge-check", label: "Badge check" },
  ],
};
export const applicationRole: ApplicationRole = {
  id: 5,
  name: "EDITOR",
  description: "Edit application content",
  icon: "shield",
  color: "#1565c0",
  isEnabled: true,
  objectVersionId: 2,
  createdAt: "2026-10-27T00:00:00Z",
  updatedAt: "2026-10-27T00:00:00Z",
  userCount: 0,
  isProtected: false,
  permissions: [permission],
};
