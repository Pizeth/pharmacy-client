"use client";

import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import TranslateOutlined from "@mui/icons-material/TranslateOutlined";
import { useTranslation } from "react-i18next";
import PaletteOutlined from "@mui/icons-material/PaletteOutlined";
import ThemeToggle from "@/components/effect/themes/themeToggle";
import { NavigationLanguage } from "./NavigationPreferences";
import { UserMenu } from "../UserSetting/Settings";
import { useNavigationAccount } from "../UserSetting/useNavigationAccount";
import * as S from "../styles/account.styles";
import { AccountAvatar, AccountButton, DrawerThemeLabel, DrawerThemeRow } from "../styles/drawer.styles";
export function DrawerAccount() {
  const {
    authenticated,
    authLoading,
    account
  } = useNavigationAccount();
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const closeMenu = () => setAnchor(null);
  return <S.Footer>
    <S.LegacyCard>
      <S.LegacyTitle variant="caption">Legacy version available</S.LegacyTitle>
      <S.LegacyDescription variant="body2">The legacy version of the App is available.</S.LegacyDescription>
      <S.LegacyLink variant="caption">Switch now →</S.LegacyLink>
    </S.LegacyCard>
    <DrawerThemeRow><DrawerThemeLabel variant="body2"><PaletteOutlined fontSize="small" />Theme</DrawerThemeLabel><ThemeToggle /></DrawerThemeRow>
    <DrawerThemeRow><DrawerThemeLabel variant="body2"><TranslateOutlined fontSize="small" />{t("navigation.language", { defaultValue: "Language" })}</DrawerThemeLabel><NavigationLanguage /></DrawerThemeRow>
    <AccountButton onClick={event => setAnchor(event.currentTarget)}>
      <AccountAvatar src={account?.avatar || "/static/images/otto.webp"} alt={account?.name ?? "Account"} fallback={account?.name?.charAt(0)} neumorphic />
      <S.AccountCopy>
        <S.AccountName variant="body2">{account?.name ?? (authLoading ? "Loading account…" : "Account")}</S.AccountName>
        <S.AccountDescription variant="caption" noWrap>{account?.email ?? "Settings and sign in"}</S.AccountDescription>
      </S.AccountCopy>
      <SettingsIcon fontSize="medium" data-account-gear />
    </AccountButton>
    <UserMenu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu} authenticated={authenticated} authLoading={authLoading} data={account} />
  </S.Footer>;
}
