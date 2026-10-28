"use client";
import { Avatar, IconButton, type IconButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { resourceBadgeStyles } from "@/components/Tables/resourceBadgeStyles";
import type { CSSInterpolation } from "@mui/system";
export type AdminUserSlot = "profileSocialLinks" | "profileSocialLink" | "profileHeader" | "profileCover" | "profileBody" | "profileIdentity" | "profileAvatar" | "profileHeading" | "profileContact" | "identity" | "avatar" | "roleBadge" | "details" | "detailHero" | "detailSection" | "detailHeading" | "detailFields" | "detailField" | "accountList";
function slot(name: Capitalize<AdminUserSlot>) {
  const key = name.charAt(0).toLowerCase() + name.slice(1);
  return { name: "RazethAdminUsers", slot: name, overridesResolver: (_: unknown, styles: Record<string, CSSInterpolation>) => styles[key] };
}
export const Identity = styled("div", slot("Identity"))(({ theme }) => ({ display: "flex", alignItems: "center", gap: theme.spacing(1.5), minWidth: 0 }));
export const UserAvatar = styled(Avatar, slot("Avatar"))(({ theme }) => ({ width: 40, height: 40, flexShrink: 0, boxShadow: (theme.vars ?? theme).palette.customShadows?.neumorphic ?? theme.shadows[1] }));
export const RoleBadge = styled("span", { ...slot("RoleBadge"), shouldForwardProp: prop => prop !== "roleColor" && prop !== "primaryRole" && prop !== "tone" })<{ roleColor?: string; primaryRole?: boolean; tone?: "success" | "warning" | "error" }>(({ theme, roleColor, primaryRole, tone }) => {
  const palette = (theme.vars ?? theme).palette;
  const customColor = roleColor && /^#[0-9a-f]{6}$/i.test(roleColor) ? roleColor : undefined;
  const main = customColor ?? (primaryRole ? palette.primary.main : tone ? palette[tone].main : undefined);
  return resourceBadgeStyles(theme, main);
});
export const Details = styled("div", slot("Details"))(({ theme }) => ({
  display: "grid", minWidth: 0, overflowWrap: "anywhere", color: (theme.vars ?? theme).palette.text.primary,
  border: "1px solid " + (theme.vars ?? theme).palette.divider, borderRadius: 16, overflow: "hidden",
  '&[data-view="card"]': { border: 0, borderRadius: 0 },
}));
export const DetailHero = styled("header", slot("DetailHero"))(({ theme }) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing(2), padding: theme.spacing(2.5), backgroundColor: (theme.vars ?? theme).palette.action.hover }));
export const DetailSection = styled("section", slot("DetailSection"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "220px minmax(0, 1fr)", minWidth: 0,
  borderTop: "1px solid " + (theme.vars ?? theme).palette.divider,
  '&:first-child': { borderTop: 0 },
  '[data-view="card"] &': { gridTemplateColumns: "minmax(0, 1fr)" },
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
export const DetailHeading = styled("header", slot("DetailHeading"))(({ theme }) => ({
  display: "flex", alignItems: "flex-start", gap: theme.spacing(1), padding: theme.spacing(2.5),
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
  '& > svg': { width: 20, height: 20, flexShrink: 0, color: (theme.vars ?? theme).palette.text.secondary, marginTop: 2 },
  '[data-view="card"] &': { padding: theme.spacing(1.5, 0), backgroundColor: "transparent" },
}));
export const DetailFields = styled("dl", slot("DetailFields"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", alignContent: "start", gap: theme.spacing(2.5), margin: 0, padding: theme.spacing(2.5), minWidth: 0,
  '[data-view="card"] &': { gridTemplateColumns: "minmax(0, 1fr)", gap: theme.spacing(1.5), padding: theme.spacing(0, 0, 2) },
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
export const DetailField = styled("div", slot("DetailField"))(({ theme }) => ({
  minWidth: 0, '& dt': { ...theme.typography.caption, color: (theme.vars ?? theme).palette.text.secondary, marginBottom: theme.spacing(0.5) },
  '& dd': { ...theme.typography.body2, color: (theme.vars ?? theme).palette.text.primary, margin: 0, whiteSpace: "pre-wrap" },
  '&[data-wide="true"]': { gridColumn: "1 / -1" },
  '&[data-centered="true"]': { textAlign: "center", '& dd': { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 24 } },
  '[data-view="card"] &': {
    display: "block", textAlign: "left",
    '& dt': { ...theme.typography.body2, display: "inline", marginBottom: 0, '&::after': { content: '": "' } },
    '& dd': { display: "inline", whiteSpace: "normal" },
    '&[data-centered="true"]': { textAlign: "left", '& dd': { display: "inline-flex", justifyContent: "flex-start" } },
  },
}));
export const AccountList = styled("ul", slot("AccountList"))(({ theme }) => ({
  gridColumn: "1 / -1", listStyle: "none", padding: theme.spacing(2, 0, 1), margin: 0, display: "grid", gap: theme.spacing(1),
  '& li': { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: theme.spacing(1), padding: theme.spacing(1, 1.5), borderRadius: 10, backgroundColor: (theme.vars ?? theme).palette.action.hover },
}));


export const ProfileHeader = styled("header", slot("ProfileHeader"))(({ theme }) => ({
  overflow: "hidden", minWidth: 0, borderRadius: 24,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  boxShadow: (theme.vars ?? theme).palette.customShadows?.neumorphic ?? theme.shadows[1],
}));
export const ProfileCover = styled("div", slot("ProfileCover"))(({ theme }) => ({
  height: 136, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", boxSizing: "border-box", padding: theme.spacing(2.5), color: (theme.vars ?? theme).palette.text.primary,
  background: `radial-gradient(ellipse at 85% 10%, ${theme.alpha((theme.vars ?? theme).palette.info.main, 0.22)}, transparent 65%), linear-gradient(125deg, ${theme.alpha((theme.vars ?? theme).palette.primary.main, 0.18)}, ${theme.alpha((theme.vars ?? theme).palette.primary.main, 0.04)})`,
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  [theme.breakpoints.down("sm")]: { height: 104 },
}));
export const ProfileBody = styled("div", slot("ProfileBody"))(({ theme }) => ({
  position: "relative", display: "grid", gap: theme.spacing(2.5), minWidth: 0,
  marginTop: -80, padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: { marginTop: -60, padding: theme.spacing(2.5), gap: theme.spacing(2) },
}));
export const ProfileIdentity = styled("div", slot("ProfileIdentity"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "144px minmax(0, 1fr)", alignItems: "start", gap: theme.spacing(3), minWidth: 0,
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "112px minmax(0, 1fr)", gap: theme.spacing(2) },
  [theme.breakpoints.down(360)]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
export const ProfileAvatar = styled(Avatar, slot("ProfileAvatar"))(({ theme }) => ({
  width: 144, height: 144, boxSizing: "border-box", border: `6px solid ${(theme.vars ?? theme).palette.background.paper}`,
  outline: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  boxShadow: (theme.vars ?? theme).palette.customShadows?.neumorphic ?? theme.shadows[2],
  backgroundColor: (theme.vars ?? theme).palette.primary.main, color: (theme.vars ?? theme).palette.primary.contrastText,
  fontSize: "2.5rem", fontWeight: 600,
  [theme.breakpoints.down("sm")]: { width: 112, height: 112, fontSize: "2rem", borderWidth: 5 },
}));
export const ProfileHeading = styled("div", slot("ProfileHeading"))(({ theme }) => ({
  display: "grid", gap: theme.spacing(1), minWidth: 0, paddingTop: 64, overflowWrap: "anywhere",
  '& h1': { fontSize: "clamp(1.5rem, 2vw, 2rem)", lineHeight: 1.25, fontWeight: 600 },
  [theme.breakpoints.down("sm")]: { paddingTop: 42, '& h1': { fontSize: "1.5rem", lineHeight: 1.4 } },
  [theme.breakpoints.down(360)]: { paddingTop: 0 },
}));
export const ProfileContact = styled("div", slot("ProfileContact"))(({ theme }) => ({
  display: "flex", flexWrap: "wrap", alignItems: "center", gap: theme.spacing(1.5, 3), minWidth: 0,
  paddingTop: theme.spacing(2), borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  '& a': { display: "inline-flex", alignItems: "center", gap: theme.spacing(1), minWidth: 0, overflowWrap: "anywhere", color: (theme.vars ?? theme).palette.text.primary, '&:hover': { color: (theme.vars ?? theme).palette.primary.main } },
  '& svg': { width: 18, height: 18, flexShrink: 0, color: (theme.vars ?? theme).palette.text.secondary },
  '& a > span': { minWidth: 0 },
}));

export const ProfileSocialLinks = styled("div", slot("ProfileSocialLinks"))(({ theme }) => ({ display: "flex", alignItems: "center", flexWrap: "wrap", gap: theme.spacing(1.5) }));
export const ProfileSocialLink = styled(IconButton, slot("ProfileSocialLink"))<IconButtonProps<"a">>(({ theme }) => ({
  width: 44, height: 44, borderRadius: "50%", color: (theme.vars ?? theme).palette.info.main,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  boxShadow: (theme.vars ?? theme).palette.customShadows?.neumorphic ?? theme.shadows[1],
  '&[data-provider="facebook"], &[data-provider="linkedin"]': { color: "#1877f2" },
  '&[data-provider="telegram"]': { color: "#229ed9" },
  '&[data-provider="instagram"]': { color: "#e1306c" },
  '&[data-provider="youtube"]': { color: "#f33" },
  '& svg': { width: 26, height: 26 },
  '&:hover': { backgroundColor: (theme.vars ?? theme).palette.action.hover },
}));
