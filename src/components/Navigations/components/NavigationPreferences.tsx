"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Notifications from "@mui/icons-material/Notifications";
import { IconButton, Menu, MenuItem, Popover, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HEADER_ICON_GOLD, HEADER_ICON_SHADOW, HEADER_ICON_STROKE } from "../styles/headerGlyphStyles";
import { navigationSlot } from "../styles/slots";

const UtilityButton = styled(IconButton, navigationSlot("RazethDrawer", "UtilityButton"))({
  padding: 0,
  width: 44,
  height: 44,
  flexShrink: 0,
  backgroundColor: "transparent",
  boxShadow: "none",
  "&:hover, &.Mui-focusVisible, &:active": {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  "& > svg, & > img": { filter: `var(--Navigation-utility-stroke,) ${HEADER_ICON_SHADOW.idle}` },
  "& > svg": { color: HEADER_ICON_GOLD, "--Navigation-utility-stroke": HEADER_ICON_STROKE },
  "&:hover > svg, &:hover > img, &.Mui-focusVisible > svg, &.Mui-focusVisible > img": {
    filter: `var(--Navigation-utility-stroke,) ${HEADER_ICON_SHADOW.hover}`,
  },
  "&:active > svg, &:active > img": { filter: `var(--Navigation-utility-stroke,) ${HEADER_ICON_SHADOW.pressed}` },
  "&:focus-visible": { outline: `2px solid ${HEADER_ICON_GOLD}`, outlineOffset: 2 },
});

const NotificationContent = styled("div", navigationSlot("RazethDrawer", "NotificationContent"))(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  maxWidth: 280,
}));

const locales = {
  km: { label: "ខ្មែរ", flag: "/static/svg/flags/kh.svg" },
  en: { label: "English", flag: "/static/svg/flags/gb.svg" },
} as const;

const FlagImage = styled(Image, navigationSlot("RazethDrawer", "LanguageFlag"))({
  display: "block",
  borderRadius: 3,
  flexShrink: 0,
});

const LanguageMenu = styled(Menu, navigationSlot("RazethDrawer", "LanguageMenu"))(({ theme }) => ({
  "& .MuiMenu-paper": {
    backgroundColor: theme.alpha(theme.vars.palette.background.paper, 0.7),
    backgroundImage: "none",
    backdropFilter: "blur(20px) saturate(180%)",
    border: `1px solid ${theme.alpha(theme.vars.palette.divider, 0.1)}`,
  },
}));

const LanguageOption = styled(MenuItem, navigationSlot("RazethDrawer", "LanguageOption"))(({ theme }) => ({
  gap: theme.spacing(1.25),
  "&[lang=km]": { fontFamily: "var(--font-interkhmerloopless), sans-serif" },
}));

function LocaleFlag({ locale }: { readonly locale: keyof typeof locales }) {
  return <FlagImage src={(locale === "en" ? locales.en : locales.km).flag} alt="" width={24} height={18} loading="eager" />;
}

export function NavigationLanguage() {
  const { i18n, t } = useTranslation();
  const label = t("navigation.language", { defaultValue: "Language" });
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const locale = i18n.language?.split("-")[0] === "en" ? "en" : "km";

  return <>
    <Tooltip title={anchor ? "" : label}>
      <UtilityButton color="inherit" aria-label={label} aria-haspopup="menu"
        aria-expanded={Boolean(anchor)} onClick={(event) => { setAnchor(event.currentTarget); }}>
        <LocaleFlag locale={locale} />
      </UtilityButton>
    </Tooltip>
    <LanguageMenu anchorEl={anchor} open={Boolean(anchor)} onClose={() => { setAnchor(null); }}
      slotProps={{ list: { "aria-label": label } }}>
      {(["km", "en"] as const).map((code) => (
        <LanguageOption key={code} lang={code} role="menuitemradio" aria-checked={locale === code}
          selected={locale === code} onClick={() => {
            setAnchor(null);
            i18n.changeLanguage(code).catch(() => undefined);
          }}>
          <LocaleFlag locale={code} />{(code === "en" ? locales.en : locales.km).label}
        </LanguageOption>
      ))}
    </LanguageMenu>
  </>;
}

export function NavigationNotifications() {
  const { i18n, t } = useTranslation();
  const english = i18n.language?.split("-")[0] === "en";
  const label = t("navigation.notifications", {
    defaultValue: english ? "Notifications" : "ការជូនដំណឹង",
  });
  const unavailable = t("navigation.notificationsUnavailable", {
    defaultValue: english
      ? "The notification feed is not available yet."
      : "បញ្ជីការជូនដំណឹងមិនទាន់អាចប្រើបានទេ។",
  });
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return <>
    <Tooltip title={label}>
      <UtilityButton color="inherit" aria-label={label} aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)} onClick={(event) => { setAnchor(event.currentTarget); }}>
        <Notifications />
      </UtilityButton>
    </Tooltip>
    <Popover anchorEl={anchor} open={Boolean(anchor)} onClose={() => { setAnchor(null); }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{ paper: { role: "dialog", "aria-label": label } }}>
      <NotificationContent>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography variant="body2" color="text.secondary">{unavailable}</Typography>
      </NotificationContent>
    </Popover>
  </>;
}
