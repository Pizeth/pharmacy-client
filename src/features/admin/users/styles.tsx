"use client";
import { Avatar } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import type { CSSInterpolation } from "@mui/system";
export type AdminUserSlot = "identity" | "avatar" | "roleBadge" | "details" | "detailHero" | "detailSection" | "detailHeading" | "detailFields" | "detailField" | "accountList";
function slot(name: Capitalize<AdminUserSlot>) {
  const key = name.charAt(0).toLowerCase() + name.slice(1);
  return { name: "RazethAdminUsers", slot: name, overridesResolver: (_: unknown, styles: Record<string, CSSInterpolation>) => styles[key] };
}
export const Identity = styled("div", slot("Identity"))(({ theme }) => ({ display: "flex", alignItems: "center", gap: theme.spacing(1.5), minWidth: 0 }));
export const UserAvatar = styled(Avatar, slot("Avatar"))(({ theme }) => ({ width: 40, height: 40, flexShrink: 0, boxShadow: (theme.vars ?? theme).palette.customShadows?.neumorphic ?? theme.shadows[1] }));
export const RoleBadge = styled("span", { ...slot("RoleBadge"), shouldForwardProp: prop => prop !== "roleColor" && prop !== "primaryRole" && prop !== "tone" })<{ roleColor?: string; primaryRole?: boolean; tone?: "success" | "warning" | "error" }>(({ theme, roleColor, primaryRole, tone }) => {
  const palette = (theme.vars ?? theme).palette;
  const tint = (color: string, opacity: number) => theme.alpha ? theme.alpha(color, opacity) : alpha(color, opacity);
  const customColor = roleColor && /^#[0-9a-f]{6}$/i.test(roleColor) ? roleColor : undefined;
  const main = primaryRole ? palette.primary.main : tone ? palette[tone].main : customColor;
  const base = {
    display: "inline-flex", alignItems: "center", gap: theme.spacing(0.5), maxWidth: "100%",
    fontSize: "0.6875rem", fontWeight: 700, lineHeight: 1.5,
    padding: "1px 6px", borderRadius: 999, fontFamily: "monospace",
    "& svg": { width: 14, height: 14, flexShrink: 0, color: "inherit" },
    '&[data-icon-only="true"]': { width: 20, height: 20, padding: 0, borderRadius: "50%", boxSizing: "border-box", justifyContent: "center", flexShrink: 0 },
  };
  if (!main) return { ...base, color: palette.text.secondary, backgroundColor: tint(palette.text.primary, 0.08), border: `1px solid ${tint(palette.text.primary, 0.2)}` };
  return {
    ...base, color: `color-mix(in srgb, ${main} 60%, black)`,
    backgroundColor: tint(main, 0.12), border: `1px solid ${tint(main, 0.4)}`,
    ...theme.applyStyles("dark", { color: `color-mix(in srgb, ${main} 60%, white)` }),
  };
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
