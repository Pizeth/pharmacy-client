import { ResourceBadge } from "@/components/Tables/ResourceBadge";
import type { AdminUser } from "./api";

export function UserAccountStatus({ user }: {
  readonly user: Pick<AdminUser, "banned" | "isLinked">;
}) {
  return <>
    {user.banned && <ResourceBadge size="small" color="error" label="Banned" />}
    {user.isLinked === false && <ResourceBadge size="small" color="warning" label="Pending ID verification" />}
    {user.isLinked === true && <ResourceBadge size="small" color="success" label="Verified ID" />}
    {typeof user.isLinked !== "boolean" && <ResourceBadge size="small" label="ID status unavailable" />}
  </>;
}
