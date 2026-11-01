"use client";

import { Avatar, Button, Paper, type ButtonProps, type PaperProps } from "@mui/material";
import { styled, type CSSInterpolation } from "@mui/material/styles";
import { resourceNeumorphicStyles } from "@/components/buttons/resourceNeumorphicStyles";
import { SIGNATURE_BLUE, SIGNATURE_GOLD } from "@/theme/brandColors";

export type DashboardSlot = "root" | "welcome" | "identity" | "avatar" | "layout" | "panel" | "quickLinks" | "quickLink" | "icon" | "facts" | "fact" | "actions";
const slot = (name: Capitalize<DashboardSlot>) => ({
  name: "RazethDashboard", slot: name,
  overridesResolver: (_props: unknown, styles: Record<string, CSSInterpolation>) => styles[name.charAt(0).toLowerCase() + name.slice(1)],
});

export const Root = styled("div", slot("Root"))(({ theme }) => ({
  display: "grid", gap: theme.spacing(3), minWidth: 0,
  color: (theme.vars ?? theme).palette.text.primary,
}));
export const Panel = styled(Paper, slot("Panel"))<PaperProps>(({ theme }) => ({
  padding: theme.spacing(3), borderRadius: 24, minWidth: 0,
  backgroundImage: "none", backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  boxShadow: (theme.vars ?? theme).palette.customShadows?.neumorphic ?? theme.shadows[2],
  backdropFilter: "blur(12px)",
  '& h2': { marginBottom: theme.spacing(2) },
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
}));
export const Welcome = styled(Panel, slot("Welcome"))(({ theme }) => ({
  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing(3),
  backgroundImage: `linear-gradient(120deg, color-mix(in srgb, ${SIGNATURE_BLUE} 12%, transparent), color-mix(in srgb, ${SIGNATURE_GOLD} 7%, transparent))`,
}));
export const Identity = styled("div", slot("Identity"))(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(2), minWidth: 0,
  '& > div:last-child': { minWidth: 0, overflowWrap: "anywhere" },
}));
export const UserAvatar = styled(Avatar, slot("Avatar"))(({ theme }) => ({
  width: 88, height: 88, flexShrink: 0,
  color: (theme.vars ?? theme).palette.info.contrastText,
  backgroundColor: (theme.vars ?? theme).palette.info.main,
  border: `3px solid color-mix(in srgb, ${SIGNATURE_GOLD} 55%, transparent)`,
  boxShadow: theme.shadows[2],
  [theme.breakpoints.down("sm")]: { width: 64, height: 64 },
}));
export const Layout = styled("div", slot("Layout"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: theme.spacing(3), alignItems: "start",
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
export const QuickLinks = styled("div", slot("QuickLinks"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
export const QuickLink = styled(Button, slot("QuickLink"))<ButtonProps>(({ theme }) => ({
  ...resourceNeumorphicStyles(theme), width: "100%", minWidth: 0, minHeight: 148,
  borderRadius: 20, padding: theme.spacing(2), display: "flex", flexDirection: "column",
  alignItems: "flex-start", justifyContent: "flex-start", gap: theme.spacing(1),
  textAlign: "left", textTransform: "none", color: (theme.vars ?? theme).palette.text.primary,
  '& > span': { overflowWrap: "anywhere" },
}));
export const Icon = styled("span", slot("Icon"))(({ theme }) => ({
  display: "inline-flex", alignItems: "center", justifyContent: "center", padding: theme.spacing(1), borderRadius: 12,
  backgroundColor: "color-mix(in srgb, currentColor 10%, transparent)",
  color: (theme.vars ?? theme).palette.info.main,
  '&[data-tone=secondary]': { color: (theme.vars ?? theme).palette.secondary.main },
  '&[data-tone=success]': { color: (theme.vars ?? theme).palette.success.main },
  '&[data-tone=warning]': { color: (theme.vars ?? theme).palette.warning.main },
}));
export const Facts = styled("dl", slot("Facts"))({ margin: 0, minWidth: 0 });
export const Fact = styled("div", slot("Fact"))(({ theme }) => ({
  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing(1), paddingBlock: theme.spacing(1.75),
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  '&:last-child': { borderBottom: 0 },
  '& dt': { display: "flex", alignItems: "center", gap: theme.spacing(1), ...theme.typography.body2, color: (theme.vars ?? theme).palette.text.secondary },
  '& dd': { margin: 0, ...theme.typography.body2, overflowWrap: "anywhere", minWidth: 0 },
}));
export const Actions = styled("div", slot("Actions"))(({ theme }) => ({
  display: "flex", alignItems: "center", flexWrap: "wrap", gap: theme.spacing(1.5),
  '& .MuiButton-root': { ...resourceNeumorphicStyles(theme), textTransform: "none" },
}));
