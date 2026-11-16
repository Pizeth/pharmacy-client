"use client";
import { resourceFormStyles } from "@/components/forms/resourceFormStyles";
import { styled } from "@mui/material/styles";
import type { CSSInterpolation } from "@mui/system";
export type AdminRoleSlot =
  | "root"
  | "panel"
  | "form"
  | "actions"
  | "fields"
  | "permissions"
  | "permissionGroup"
  | "permissionList"
  | "facts"
  | "fact"
  | "colorPicker"
  | "colorSwatch"
  | "colorPanel"
  | "colorWheel"
  | "colorThumb";
function slot(name: Capitalize<AdminRoleSlot>) {
  const key = name.charAt(0).toLowerCase() + name.slice(1);
  return {
    name: "RazethAdminRoles",
    slot: name,
    overridesResolver: (_: unknown, styles: Record<string, CSSInterpolation>) =>
      styles[key],
  };
}
export const ColorPicker = styled("button", slot("ColorPicker"))(({ theme }) => ({
  width: 32,
  height: 32,
  padding: 2,
  flexShrink: 0,
  cursor: "pointer",
  borderRadius: "50%",
  position: "relative",
  display: "grid",
  placeItems: "center",
  color: "inherit",
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  background: "transparent",
  "&:focus-visible": { outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`, outlineOffset: 2 },
  "&:disabled": { cursor: "default", opacity: 0.5 },
}));
export const ColorSwatch = styled("span", slot("ColorSwatch"))({ position: "absolute", width: 10, height: 10, bottom: 0, right: 0, borderRadius: "50%", border: "1px solid currentColor" });
export const ColorPanel = styled("div", slot("ColorPanel"))(({ theme }) => ({ display: "grid", gap: theme.spacing(1), width: 280, maxWidth: "calc(100vw - 32px)", padding: theme.spacing(2.5), boxSizing: "border-box", color: (theme.vars ?? theme).palette.text.primary }));
export const ColorWheel = styled("div", slot("ColorWheel"))(({ theme }) => ({
  width: "calc(100% - 16px)", aspectRatio: "1", justifySelf: "center", marginBlock: theme.spacing(1), position: "relative", borderRadius: "50%", cursor: "crosshair", touchAction: "none",
  background: "radial-gradient(circle closest-side, white, transparent), conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
  boxShadow: "0 2px 10px rgb(0 0 0 / 20%)",
  "&:focus-visible": { outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`, outlineOffset: 4 },
}));
export const ColorThumb = styled("span", slot("ColorThumb"))({ position: "absolute", width: 14, height: 14, borderRadius: "50%", border: "2px solid white", boxShadow: "0 0 0 1px rgb(0 0 0 / 65%)", transform: "translate(-50%, -50%)", pointerEvents: "none" });
export const Root = styled(
  "div",
  slot("Root"),
)(({ theme }) => ({ display: "grid", gap: theme.spacing(3), minWidth: 0 }));
export const Panel = styled(
  "section",
  slot("Panel"),
)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(3),
  borderRadius: 20,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  color: (theme.vars ?? theme).palette.text.primary,
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
}));
export const Form = styled(
  "form",
  slot("Form"),
)(({ theme }) => resourceFormStyles(theme));
export const Actions = styled(
  "div",
  slot("Actions"),
)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));
export const Fields = styled(
  "div",
  slot("Fields"),
)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0,1fr)" },
}));
export const Permissions = styled(
  "div",
  slot("Permissions"),
)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2,minmax(0,1fr))",
  gap: theme.spacing(2),
  minWidth: 0,
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0,1fr)" },
}));
export const PermissionGroup = styled(
  "fieldset",
  slot("PermissionGroup"),
)(({ theme }) => ({
  margin: 0,
  minWidth: 0,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  borderRadius: 12,
  padding: theme.spacing(1, 2, 2),
  "& legend": {
    ...theme.typography.subtitle2,
    paddingInline: theme.spacing(0.5),
  },
  "& .MuiFormControlLabel-label": {
    ...theme.typography.body2,
    overflowWrap: "anywhere",
  },
}));
export const PermissionList = styled(
  "ul",
  slot("PermissionList"),
)(({ theme }) => ({
  margin: 0,
  paddingInlineStart: theme.spacing(2.5),
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.typography.body2,
  "& li": { marginBlock: theme.spacing(0.5) },
}));
export const Facts = styled(
  "dl",
  slot("Facts"),
)(({ theme }) => ({ display: "grid", gap: theme.spacing(1), margin: 0 }));
export const Fact = styled(
  "div",
  slot("Fact"),
)(({ theme }) => ({
  minWidth: 0,
  overflowWrap: "anywhere",
  "& dt, & dd": { display: "inline", margin: 0, ...theme.typography.body2 },
  "& dt": { fontWeight: 600 },
  "& dt::after": { content: '": "' },
}));
