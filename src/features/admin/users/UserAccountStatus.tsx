import { ResourceBadge } from "@/components/Tables/ResourceBadge";
import type { AdminUser } from "./api";

export function UserAccountStatus({ user }: {
  readonly user: Pick<AdminUser, "banned" | "isLinked">;
}) {
  if (user.banned) return <ResourceBadge size="small" color="error" label="Banned" />;
  if (user.isLinked === false) return <ResourceBadge size="small" color="warning" label="Pending ID verification" />;
  if (user.isLinked === true) return <ResourceBadge size="small" color="success" label="Verified ID" />;
  return <ResourceBadge size="small" label="Not banned" />;
}
