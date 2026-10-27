"use client";
import { useGetIdentity } from "@refinedev/core";
export function useAdminAccess() {
  const identity = useGetIdentity<{ id: string | number; name: string; role?: string }>();
  const roles = (identity.data?.role ?? "").toLowerCase().split(",").map(role => role.trim().replace(/_/g, "-"));
  return { ...identity, allowed: roles.some(role => ["admin", "sys-admin", "super-admin", "superadmin"].includes(role)) };
}
