import { ResourceBadge } from "@/components/Tables/ResourceBadge";
import type { AdminUser } from "./api";

export function UserAccountStatus({ user }: {
  readonly user: Pick<AdminUser, "banned" | "emailVerified" | "isLinked" | "role">;
}) {
  if (user.banned) {
    return <ResourceBadge size="small" color="error" label="Banned" />;
  }
  if (user.role !== "sys-admin" && user.emailVerified === false) {
    return <ResourceBadge size="small" color="error" label="Email not verified" />;
  }
  if (user.role !== "sys-admin" && user.isLinked === false) {
    return <ResourceBadge size="small" color="warning" label="Pending ID verification" />;
  }
  return <ResourceBadge size="small" color="success" label="Active" />;
}
