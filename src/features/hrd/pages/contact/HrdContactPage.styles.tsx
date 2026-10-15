"use client";

import Image from "next/image";
import { styled } from "@mui/material/styles";
import { HrdPageContainer } from "../../components/layout/HrdPageLayout";
import { SocialIconsRoot } from "@/components/icons/components/socials";
import { hrdSlot } from "../../styles/styled";

export const Root = styled(HrdPageContainer, hrdSlot("ContactRoot"))(({ theme }) => ({
  paddingBottom: theme.spacing(8),
  color: (theme.vars ?? theme).palette.text.primary,
}));
export const Header = styled("header", hrdSlot("ContactHeader"))(({ theme }) => ({
  paddingBlock: theme.spacing(4),
  textAlign: "center",
  marginBottom: theme.spacing(3),
  "& h1": { lineHeight: 1.8 },
}));
export const Layout = styled("section", hrdSlot("ContactLayout"))(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.spacing(2),
  alignItems: "start",
}));
export const Card = styled("article", hrdSlot("ContactCard"))(({ theme }) => ({
  padding: theme.spacing(2.5),
  minWidth: 0,
  width: "100%",
  maxWidth: 460,
  boxSizing: "border-box",
  borderRadius: 14,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  borderTop: "2px solid #d8b36c",
  backgroundImage: "linear-gradient(135deg, rgba(216,179,108,0.06), transparent 55%)",
  boxShadow: "0 14px 30px rgba(0,0,0,0.16), 0 3px 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.16)",
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
}));
export const CardHeader = styled("div", hrdSlot("ContactCardHeader"))(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(1.5), marginBottom: theme.spacing(2.5),
  "& h2": {
    fontFamily: "var(--font-mef2), var(--font-moul), serif",
    fontWeight: 400,
    fontSize: "clamp(1.125rem, 1.5vw, 1.35rem)",
    lineHeight: 1.9,
    color: "#edad54", // Matches the PulseLoader message text.
  },
}));
export const Logo = styled(Image, hrdSlot("ContactLogo"))({ flexShrink: 0, objectFit: "contain", width: 64, height: 64 });
export const CardBody = styled("div", hrdSlot("ContactCardBody"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "144px minmax(0, 1fr)", gap: theme.spacing(2), alignItems: "start",
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "minmax(90px, 0.7fr) minmax(0, 1fr)", gap: theme.spacing(1.5) },
}));
export const Portrait = styled(Image, hrdSlot("ContactPortrait"))({ width: "100%", height: "auto", aspectRatio: "144 / 166", objectFit: "cover", objectPosition: "center top", borderRadius: 4 });
export const Copy = styled("div", hrdSlot("ContactCopy"))(({ theme }) => ({
  minWidth: 0, display: "flex", flexDirection: "column", gap: theme.spacing(1),
  "& h3": { fontWeight: 700, lineHeight: 1.8 },
}));
export const Role = styled("div", hrdSlot("ContactRole"))(({ theme }) => ({ display: "flex", flexWrap: "wrap", columnGap: theme.spacing(1.5), rowGap: theme.spacing(0.5) }));
export const ContactRow = styled("div", hrdSlot("ContactRow"))(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(1), minWidth: 0,
  "& > svg": { flexShrink: 0, color: "#b7791f", ...theme.applyStyles("dark", { color: "#e5bd70" }) },
}));
export const ContactLink = styled("a", hrdSlot("ContactLink"))(({ theme }) => ({
  ...theme.typography.body2, color: "inherit", textDecoration: "none", overflowWrap: "anywhere",
  "&:hover": { textDecoration: "underline" },
  "&:focus-visible": { outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`, outlineOffset: 3 },
}));
export const Socials = styled(SocialIconsRoot, hrdSlot("ContactSocials"))(({ theme }) => ({
  justifyContent: "flex-start", flexWrap: "wrap", gap: theme.spacing(1.5), marginTop: theme.spacing(1),
  "&& .MuiIconButton-root": {
    margin: 0,
    width: 40,
    height: 40,
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
    boxShadow: "-4px -4px 9px rgba(255,255,255,0.8), 4px 4px 9px rgba(0,0,0,0.14)",
    ...theme.applyStyles("dark", {
      boxShadow: "-4px -4px 9px rgba(255,255,255,0.06), 4px 4px 9px rgba(0,0,0,0.4)",
    }),
    "&:active": { boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.08)" },
  },
}));

export const PageGrid = styled("div", hrdSlot("ContactPageGrid"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "minmax(0, 460px) minmax(0, 1fr)", gap: theme.spacing(3), alignItems: "start",
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0, 1fr)" },
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(1.5), gap: theme.spacing(2) },
}));
export const Details = styled("div", hrdSlot("ContactDetails"))(({ theme }) => ({ minWidth: 0, display: "grid", gap: theme.spacing(2.5) }));
export const Location = styled("section", hrdSlot("ContactLocation"))(({ theme }) => ({
  minWidth: 0, overflow: "hidden", borderRadius: 8, backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`, boxShadow: theme.shadows[1],
}));
export const SectionHeader = styled("div", hrdSlot("ContactSectionHeader"))(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(1.5), padding: theme.spacing(2.5),
  "& svg": { color: "#b7791f", flexShrink: 0, ...theme.applyStyles("dark", { color: "#e5bd70" }) },
  "& h2": { lineHeight: 1.8 },
}));
export const Map = styled("iframe", hrdSlot("ContactMap"))(({ theme }) => ({
  display: "block", width: "100%", height: 320, border: 0,
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
  [theme.breakpoints.down("sm")]: { height: 260 },
}));
export const Address = styled("div", hrdSlot("ContactAddress"))(({ theme }) => ({
  padding: theme.spacing(2.5), display: "flex", flexDirection: "column", alignItems: "flex-start", gap: theme.spacing(2),
  "& p": { lineHeight: 1.9 },
}));
export const Hours = styled("div", hrdSlot("ContactHours"))(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(1.5), padding: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
  "& > svg": { flexShrink: 0, color: (theme.vars ?? theme).palette.text.secondary },
}));
export const Documents = styled("div", hrdSlot("ContactDocuments"))(({ theme }) => ({
  padding: theme.spacing(2.5), borderRadius: 6, borderInlineStart: "3px solid #d8b36c",
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  "& p": { marginBottom: theme.spacing(1) },
}));
