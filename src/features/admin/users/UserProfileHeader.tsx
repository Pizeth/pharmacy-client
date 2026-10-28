"use client";
import { ResourceBadge as Chip, ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import { Link, Typography } from "@mui/material";
import MailOutline from "@mui/icons-material/MailOutline";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import { safeSocialUrl } from "../social/api";
import { RoleBadge } from "./UserIdentity";
import type { AdminUserDetail } from "./api";
import * as S from "./styles";
import { RecordPageActions } from "@/components/Tables/recordPageActions";
import { Badges } from "@/components/Tables/resourceRecordStyles";

export function UserProfileHeader({ user, isSelf }: { readonly user: AdminUserDetail; readonly isSelf: boolean }) {
  const image = safeSocialUrl(user.image) ?? (user.image?.startsWith("/") && !user.image.startsWith("//") ? user.image : undefined);
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join("").toUpperCase() || "?";
  const phone = user.profile?.phone;
  const telephone = phone?.replace(/[^+0-9]/g, "");
  return <S.ProfileHeader aria-label="Personal profile">
    <S.ProfileCover><RecordPageActions /></S.ProfileCover>
    <S.ProfileBody>
      <S.ProfileIdentity>
        <S.ProfileAvatar src={image} alt={`${user.name}'s profile photo`} role={!image ? "img" : undefined} aria-label={!image ? `${user.name}'s profile photo` : undefined}>{initials}</S.ProfileAvatar>
        <S.ProfileHeading>
          <Typography component="h1" variant="h4">{user.name}</Typography>
          {user.username && <Typography variant="body2" color="text.secondary">@{user.username}</Typography>}
          <Badges><RoleBadge role={user.userRole} fallback={user.role} /><ResourceStatusBadge active={!user.banned} inactiveLabel="Banned" inactiveColor="error" />{isSelf && <Chip size="small" color="info" variant="outlined" label="Your profile" />}</Badges>
        </S.ProfileHeading>
      </S.ProfileIdentity>
      <S.ProfileContact>
        <Link href={`mailto:${encodeURIComponent(user.email)}`} underline="hover"><MailOutline aria-hidden="true" /><span>{user.email}</span></Link>
        {phone && (telephone ? <Link href={`tel:${telephone}`} underline="hover"><PhoneOutlined aria-hidden="true" /><span>{phone}</span></Link> : <Typography variant="body2">{phone}</Typography>)}
      </S.ProfileContact>
    </S.ProfileBody>
  </S.ProfileHeader>;
}
