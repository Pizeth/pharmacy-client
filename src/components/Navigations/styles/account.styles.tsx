"use client";

import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { navigationSlot } from "./slots";
export const Footer = styled("div", navigationSlot("RazethDrawer", "Footer"))(({
  theme
}) => ({
  marginTop: "auto",
  padding: theme.spacing(1.5),
  borderTop: "1px solid #404040"
}));
export const LegacyCard = styled("div", navigationSlot("RazethDrawer", "LegacyCard"))(({
  theme
}) => ({
  backgroundColor: theme.vars.palette.card,
  padding: theme.spacing(2),
  borderRadius: typeof theme.shape.borderRadius === "number" ? theme.shape.borderRadius * 2 : `calc(${theme.shape.borderRadius} * 2)`,
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.05)}`,
  boxShadow: theme.vars.palette.customShadows.neumorphic
}));
export const LegacyTitle = styled(Typography, navigationSlot("RazethDrawer", "LegacyTitle"))(({
  theme
}) => ({
  color: theme.vars.palette.text.primary,
  fontWeight: 600
}));
export const LegacyDescription = styled(Typography, navigationSlot("RazethDrawer", "LegacyDescription"))(({
  theme
}) => ({
  color: theme.alpha(theme.vars.palette.text.primary, 0.7),
  fontSize: "0.75rem",
  marginTop: theme.spacing(0.5)
}));
export const LegacyLink = styled(Typography, navigationSlot("RazethDrawer", "LegacyLink"))(({
  theme
}) => ({
  color: theme.vars.palette.info.main,
  marginTop: theme.spacing(1),
  display: "block",
  cursor: "pointer"
}));
export const AccountCopy = styled("div", navigationSlot("RazethDrawer", "AccountCopy"))({
  flexGrow: 1,
  overflow: "hidden"
});
export const AccountName = styled(Typography, navigationSlot("RazethDrawer", "AccountName"))(({
  theme
}) => ({
  color: theme.vars.palette.text.primary,
  fontWeight: 500,
  lineHeight: 1.2
}));
export const AccountDescription = styled(Typography, navigationSlot("RazethDrawer", "AccountDescription"))(({
  theme
}) => ({
  color: theme.alpha(theme.vars.palette.text.primary, 0.5),
  display: "block"
}));
