"use client";
import { Tooltip } from "@mui/material";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Google from "@mui/icons-material/Google";
import GitHub from "@mui/icons-material/GitHub";
import Public from "@mui/icons-material/Public";
import ShareOutlined from "@mui/icons-material/ShareOutlined";
import Telegram from "@mui/icons-material/Telegram";
import Instagram from "@mui/icons-material/Instagram";
import TikTok from "@/components/icons/socials/tiktok";
import X from "@mui/icons-material/X";
import YouTube from "@mui/icons-material/YouTube";
import Meta from "@/components/icons/socials/meta";
import { safeSocialUrl, type SocialProfile } from "../social/api";
import * as S from "./styles";
const icons = { facebook: Meta, meta: Meta, telegram: Telegram, instagram: Instagram, tiktok: TikTok, x: X, twitter: X, youtube: YouTube, linkedin: LinkedIn, google: Google, github: GitHub, web: Public, website: Public };
export function SocialProfileLinks({ profiles }: { readonly profiles: readonly SocialProfile[] }) {
  return <S.ProfileSocialLinks aria-label="Social profile links">{profiles.map(profile => {
    const key = profile.provider.key.toLowerCase();
    const Icon = icons[key as keyof typeof icons] ?? ShareOutlined;
    const href = safeSocialUrl(profile.url);
    const label = `${profile.provider.name} profile${profile.handle ? `: ${profile.handle}` : ""}`;
    return <Tooltip key={profile.id} title={`${label}${!profile.provider.isEnabled ? " (provider disabled)" : ""}${!href ? " (no valid URL)" : ""}`}>
      {href ? <S.ProfileSocialLink component="a" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-provider={key}><Icon aria-hidden="true" /></S.ProfileSocialLink> : <span><S.ProfileSocialLink disabled aria-label={`${label} (no valid URL)`} data-provider={key}><Icon aria-hidden="true" /></S.ProfileSocialLink></span>}
    </Tooltip>;
  })}</S.ProfileSocialLinks>;
}
