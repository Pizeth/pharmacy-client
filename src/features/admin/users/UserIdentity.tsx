"use client";
import { ShieldOutlined as Shield, VerifiedUserOutlined as ShieldCheck, PersonOutline as UserRound, WorkspacePremiumOutlined as Crown, SettingsOutlined as Settings, GroupsOutlined as Users, LockOutlined as Lock, VerifiedOutlined as BadgeCheck } from "@mui/icons-material";
import { Typography } from "@mui/material";
import type { AdminUser, UserRole } from "./api";
import * as S from "./styles";
const icons = { shield: Shield, "shield-check": ShieldCheck, user: UserRound, "user-round": UserRound, crown: Crown, settings: Settings, users: Users, lock: Lock, "badge-check": BadgeCheck };
export function RoleBadge({ role, fallback }: { role?: UserRole | null; fallback?: string | null }) {
  const Icon = role?.icon ? icons[role.icon as keyof typeof icons] : undefined;
  const primaryRole = [role?.name, fallback].some(name => ["super-admin", "superadmin", "sys-admin", "system-admin"].includes((name ?? "").trim().toLowerCase().replace(/[_\s]+/g, "-")));
  return <S.RoleBadge roleColor={role?.color ?? undefined} primaryRole={primaryRole} data-tone={primaryRole ? "primary" : role?.color ? "custom" : "neutral"}>
    {Icon && <Icon fontSize="inherit" aria-hidden="true" />}{role?.name || fallback || "user"}
  </S.RoleBadge>;
}
export function UserIdentity({ user }: { user: AdminUser }) {
  const source = user.image && /^(https?:\/\/|\/[^/])/.test(user.image) ? user.image : undefined;
  return <S.Identity><S.UserAvatar src={source} alt={user.name}>{user.name.trim().slice(0, 1).toUpperCase()}</S.UserAvatar><Typography variant="subtitle2">{user.name}</Typography></S.Identity>;
}
export function findRole(roles: readonly UserRole[] | undefined, name?: string | null, roleId?: number | null) {
  const normalize = (value: string) => value.toLowerCase().replace(/_/g, "-");
  return roles?.find(role => role.id === roleId) ?? roles?.find(role => normalize(role.name) === normalize(name ?? "user"));
}

export function getAccountProviderLabel(provider: string) {
  return provider === "credential" ? "Password sign-in" : `${provider.charAt(0).toUpperCase()}${provider.slice(1)}`;
}
