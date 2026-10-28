"use client";
import { ResourceStatusBadge, ResourceBadge } from "@/components/Tables/ResourceBadge";
import { formatAdminDate } from "@/lib/utils/adminDate";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, LinearProgress, Typography } from "@mui/material";
import { VerifiedUserOutlined as ShieldCheck, Fingerprint, PersonOutline as UserRound, VerifiedOutlined as BadgeCheck, ErrorOutline as CircleAlert } from "@mui/icons-material";
import { usersApi, type AdminUser, type AdminUserDetail } from "./api";
import { RoleBadge, UserIdentity, getAccountProviderLabel } from "./UserIdentity";
import * as S from "./styles";
function Field({ label, children, wide, center }: { label: string; children: ReactNode; wide?: boolean; center?: boolean }) {
  return <S.DetailField data-wide={wide || undefined} data-centered={center || undefined}><dt>{label}</dt><dd>{children}</dd></S.DetailField>;
}
export function UserDetailPanel({ user, view = "table" }: { user: AdminUser; view?: "table" | "card" }) {
  const detail = useQuery({ queryKey: ["admin-users", "detail", user.id], queryFn: ({ signal }) => usersApi.detail(user.id, signal) });
  if (detail.isLoading) return <LinearProgress aria-label="Loading user details" />;
  if (detail.error) return <Alert severity="error" action={<Button onClick={() => detail.refetch()}>Retry</Button>}>{detail.error.message}</Alert>;
  if (!detail.data) return null;
  return <UserDetailContent data={detail.data} view={view} />;
}
export function UserDetailContent({ data, view = "table" }: { data: AdminUserDetail; view?: "table" | "card" }) {
  return <S.Details data-view={view}>
    {view === "table" && <S.DetailHero><UserIdentity user={data} /></S.DetailHero>}
    <S.DetailSection aria-label="User role">
      <S.DetailHeading><ShieldCheck aria-hidden="true" /><div><Typography component="h3" variant="subtitle2">Role & access</Typography><Typography variant="caption" color="text.secondary">Assigned permissions</Typography></div></S.DetailHeading>
      <S.DetailFields><Field label="Assigned role" center><RoleBadge role={data.userRole} fallback={data.role} /></Field><Field label="Account status" center><ResourceStatusBadge active={!data.banned} inactiveLabel="Banned" inactiveColor="error" /></Field><Field label="Description">{data.userRole?.description || "No role description."}</Field></S.DetailFields>
    </S.DetailSection>
    <S.DetailSection aria-label="User accounts">
      <S.DetailHeading><Fingerprint aria-hidden="true" /><div><Typography component="h3" variant="subtitle2">Account & sign-in</Typography><Typography variant="caption" color="text.secondary">Identity and linked providers</Typography></div></S.DetailHeading>
      <S.DetailFields><Field label="Email">{data.email}</Field><Field label="Email verification" center><S.RoleBadge data-icon-only="true" tone={data.emailVerified ? "success" : "warning"} role="img" aria-label={data.emailVerified ? "Email verified" : "Email not verified"} title={data.emailVerified ? "Email verified" : "Email not verified"}>{data.emailVerified ? <BadgeCheck aria-hidden="true" /> : <CircleAlert aria-hidden="true" />}</S.RoleBadge></Field><Field label="Username">{data.username || "Not set"}</Field>
        <Field label="Linked accounts" wide>{data.accounts.length === 0 ? "No linked accounts." : `${data.accounts.length} connected ${data.accounts.length === 1 ? "provider" : "providers"}`}
        {data.accounts.length > 0 && <S.AccountList aria-label="Linked sign-in providers">{data.accounts.map(account => <li key={account.id}><ResourceBadge color="info" size="small" label={getAccountProviderLabel(account.providerId)} /><Typography variant="caption" color="text.secondary">{account.createdAt && !Number.isNaN(Date.parse(account.createdAt)) ? `Connected ${formatAdminDate(account.createdAt, false)}` : "Connected"}</Typography></li>)}</S.AccountList>}</Field>
      </S.DetailFields>
    </S.DetailSection>
    <S.DetailSection aria-label="User profile">
      <S.DetailHeading><UserRound aria-hidden="true" /><div><Typography component="h3" variant="subtitle2">Profile</Typography><Typography variant="caption" color="text.secondary">Personal and contact details</Typography></div></S.DetailHeading>
      <S.DetailFields>{data.profile ? <><Field label="Full name">{data.profile.firstName} {data.profile.lastName}</Field><Field label="Phone">{data.profile.phone || "Not set"}</Field><Field label="Profile email">{data.profile.email || "Not set"}</Field><Field label="Bio" wide>{data.profile.bio || "Not set"}</Field></> : <Field label="Profile" wide>No profile linked to this user.</Field>}</S.DetailFields>
    </S.DetailSection>
  </S.Details>;
}
