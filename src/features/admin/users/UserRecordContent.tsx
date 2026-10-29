"use client";
import { ResourceBadge as Chip, ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Link, Typography } from "@mui/material";
import { PersonOutline, AccountCircleOutlined, VpnKeyOutlined, LoginOutlined, Fingerprint, VerifiedOutlined, ErrorOutline, BadgeOutlined, ShareOutlined, DeleteOutline, LinkOutlined, LinkOffOutlined } from "@mui/icons-material";
import { RecordCard, RecordFacts } from "@/components/Tables/ResourceRecordPage";
import * as S from "@/components/Tables/resourceRecordStyles";
import { formatAdminDate } from "@/lib/utils/adminDate";
import { socialApi } from "../social/api";
import { RoleBadge, getAccountProviderLabel } from "./UserIdentity";
import { SocialProfileLinks } from "./SocialProfileLinks";
import { UserProfileHeader } from "./UserProfileHeader";
import * as U from "./styles";
import { usersApi, type AdminUserDetail } from "./api";

export function UserRecordContent({ user, isSelf, canManageRole }: { readonly user: AdminUserDetail; readonly isSelf: boolean; readonly canManageRole: boolean }) {
  const metadata = useQuery({ queryKey: ["admin-users", "record-metadata", user.id], queryFn: () => usersApi.get(user.id), retry: false });
  const numericId = Number(user.id);
  const profiles = useQuery({ queryKey: ["admin-social", "user-profiles", user.id], queryFn: ({ signal }) => socialApi.profiles(numericId, signal), enabled: Number.isSafeInteger(numericId) && numericId > 0, retry: false });
  const verified = <U.RoleBadge role="img" data-icon-only="true" tone={user.emailVerified ? "success" : "warning"} aria-label={user.emailVerified ? "Email verified" : "Email not verified"}>{user.emailVerified ? <VerifiedOutlined aria-hidden="true" /> : <ErrorOutline aria-hidden="true" />}</U.RoleBadge>;
  const createdAt = metadata.data?.createdAt ?? user.createdAt;
  const updatedAt = metadata.data?.updatedAt ?? user.updatedAt;
  const banReason = metadata.data?.banReason ?? user.banReason;
  const banExpires = metadata.data?.banExpires ?? user.banExpires;
  const name = user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : null;
  return <>
    <UserProfileHeader user={user} isSelf={isSelf} />
    <RecordCard title="Account overview" icon={<AccountCircleOutlined />}><RecordFacts inline items={[{ label: "Connected sign-in accounts", value: user.accounts.length }, { label: "Email verification", value: verified }, { label: "Profile", value: <Chip size="small" color={user.profile ? "info" : "default"} icon={user.profile ? <LinkOutlined /> : <LinkOffOutlined />} label={user.profile ? "Linked" : "Not linked"} /> }]} /></RecordCard>
    <S.Layout><S.Main>
      <RecordCard title="Account identity" icon={<Fingerprint />} description="Account identity and sign-in status."><RecordFacts items={[{ label: "Username", value: user.username || "Not set" }, { label: "Display name", value: user.name }, { label: "Email address", value: <Link href={`mailto:${encodeURIComponent(user.email)}`}>{user.email}</Link> }, { label: "Account status", value: <ResourceStatusBadge active={!user.banned} inactiveLabel="Banned" inactiveColor="error" /> }]} /></RecordCard>
      <RecordCard title="Profile & contact" icon={<PersonOutline />} description="Personal details attached to the account.">
        {user.profile ? <><RecordFacts items={[{ label: "Full name", value: name || "Not set" }, { label: "Phone", value: user.profile.phone || "Not set" }, { label: "Profile email", value: user.profile.email || "Not set" }]} /><div><Typography component="h3" variant="subtitle2">Biography</Typography><S.Prose variant="body2" color="text.secondary">{user.profile.bio || "No biography has been provided."}</S.Prose></div></> : <Alert severity="info">No profile linked to this user.</Alert>}
      </RecordCard>
      <RecordCard title="Connected sign-in accounts" icon={<VpnKeyOutlined />} description="Registered authentication connections. Passwords and provider tokens are never shown here.">
        {user.accounts.length ? <S.List>{user.accounts.map(account => <S.ListItem key={account.id}><S.Badges><Chip color="info" size="small" icon={<LoginOutlined />} label={getAccountProviderLabel(account.providerId)} /></S.Badges><RecordFacts items={[{ label: "Connected", value: account.createdAt ? formatAdminDate(account.createdAt) : "Date not provided" }]} /></S.ListItem>)}</S.List> : <Typography color="text.secondary">No linked accounts.</Typography>}
      </RecordCard>
      <RecordCard title="Social profiles" icon={<ShareOutlined />} description="Public profile links associated with this account, separate from sign-in connections.">
        {profiles.isLoading ? <Typography color="text.secondary">Loading social profiles...</Typography> : profiles.error ? <Alert severity="warning" action={<Button onClick={() => profiles.refetch()}>Retry</Button>}>Social profiles could not be loaded.</Alert> : profiles.data?.length ? <SocialProfileLinks profiles={profiles.data} /> : <Typography color="text.secondary">No social profiles recorded.</Typography>}
      </RecordCard>
    </S.Main><S.Aside data-record-sidebar>
      <RecordCard title="Role & access" icon={<BadgeOutlined />}><S.Badges><RoleBadge role={user.userRole} fallback={user.role} /></S.Badges><S.Prose variant="body2" color="text.secondary">{user.userRole?.description || "No role description is available."}</S.Prose><RecordFacts items={[{ label: "Authentication role", value: user.role || "Not specified" }]} />{canManageRole && user.userRole && <Button component={NextLink} href={`/admin/roles/${user.userRole.id}`}>View role & permissions</Button>}</RecordCard>
      <RecordCard title="Account administration"><Typography variant="body2" color="text.secondary">{isSelf ? "You are viewing your own account. Self-deletion is unavailable here." : "Deleting an account requires a separate confirmation. Review its profile and connected accounts first."}</Typography>{!isSelf && <Button component={NextLink} href={`/admin/users/delete/${encodeURIComponent(user.id)}`} color="primary" startIcon={<DeleteOutline />}>Delete user</Button>}</RecordCard>
      <RecordCard title="Record information"><RecordFacts items={[{ label: "Created", value: createdAt ? formatAdminDate(createdAt) : "Date not provided" }, { label: "Last updated", value: updatedAt ? formatAdminDate(updatedAt) : "Date not provided" }]} />{metadata.isLoading && <Typography variant="caption" color="text.secondary">Loading account metadata...</Typography>}{metadata.error && <Alert severity="warning" action={<Button onClick={() => metadata.refetch()}>Retry</Button>}>Additional account metadata could not be loaded.</Alert>}{user.banned && <RecordFacts items={[{ label: "Ban reason", value: banReason || "Not provided" }, { label: "Ban expires", value: banExpires ? formatAdminDate(banExpires) : "No expiry recorded" }]} />}</RecordCard>
    </S.Aside></S.Layout>
  </>;
}
