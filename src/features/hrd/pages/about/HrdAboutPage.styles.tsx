"use client";

import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HrdPageContainer } from "../../components/layout/HrdPageLayout";
import { hrdSlot } from "../../styles/styled";

export const Pending = styled(Typography, hrdSlot("AboutPending"))<TypographyProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "9px",
  color: `${(theme.vars ?? theme).palette.text.secondary}`,
  lineHeight: "1.9",
  "& svg": {
    flexShrink: "0",
  },
  [theme.breakpoints.down(700.05)]: {
    alignItems: "start",
    "& svg": {
      marginTop: "5px",
    },
  },
}));

export const Section = styled("section", hrdSlot("AboutSection"))(({ theme }) => ({
  borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  padding: "26px 0",
  "&:last-child": {
    paddingBottom: "0",
  },
  "& h2": {
    marginBottom: "16px",
  },
  "& h3": {
    marginBottom: "16px",
  },
}));

export const List = styled("ol", hrdSlot("AboutList"))(({ theme }) => ({
  "& li": {
    lineHeight: "2.1",
    whiteSpace: "pre-line",
  },
  paddingInlineStart: "24px",
  "& li + li": {
    marginTop: "12px",
  },
}));

export const Prose = styled(Typography, hrdSlot("AboutProse"))<TypographyProps>(({ theme }) => ({
  lineHeight: "2.1",
  whiteSpace: "pre-line",
}));

export const Portrait = styled("div", hrdSlot("AboutPortrait"))(({ theme }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  overflow: "hidden",
  background: `${(theme.vars ?? theme).palette.action.hover}`,
  color: `${(theme.vars ?? theme).palette.text.secondary}`,
  flexShrink: "0",
  "&[data-size=\"large\"]": {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    overflow: "hidden",
    background: `${(theme.vars ?? theme).palette.action.hover}`,
    color: `${(theme.vars ?? theme).palette.text.secondary}`,
    flexShrink: "0",
    width: "240px",
    height: "240px",
    border: `6px solid ${(theme.vars ?? theme).palette.background.paper}`,
    outline: `1px solid ${(theme.vars ?? theme).palette.divider}`,
    marginBottom: "8px",
  },
  width: "160px",
  height: "160px",
  "& img": {
    objectFit: "cover",
  },
  "&[data-size=\"large\"] img": {
    objectFit: "cover",
  },
  [theme.breakpoints.down(700.05)]: {
    "&[data-size=\"large\"]": {
      width: "200px",
      height: "200px",
    },
  },
}));

export const Root = styled(HrdPageContainer, hrdSlot("AboutRoot"))(({ theme }) => ({
  "--Hrd-about-raised-shadow": "-6px -6px 14px rgba(255,255,255,0.8), 7px 7px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45)",
  ...theme.applyStyles("dark", {
    "--Hrd-about-raised-shadow": "-6px -6px 14px rgba(255,255,255,0.05), 7px 7px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
  }),
  margin: "auto",
  paddingTop: theme.spacing(3),
  paddingBottom: "64px",
  color: `${(theme.vars ?? theme).palette.text.primary}`,
  [theme.breakpoints.down(700.05)]: {
    paddingBottom: "40px",
  },
}));

export const Header = styled("header", hrdSlot("AboutHeader"))(({ theme }) => ({
  textAlign: "center",
  paddingBottom: theme.spacing(3),
  "& h1": {
    lineHeight: "1.8",
  },
  [theme.breakpoints.down(700.05)]: {
    "& h1": {
      fontSize: "25px",
    },
  },
}));

export const Accent = styled("span", hrdSlot("AboutAccent"))(({ theme }) => ({
  display: "block",
  width: "46px",
  height: "3px",
  background: "linear-gradient(90deg, #F0C54C, #EDAC4C 50%, #EA9548)",
  margin: "16px auto",
}));

export const Layout = styled("div", hrdSlot("AboutLayout"))(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "260px minmax(0, 1fr)",
  gap: "28px",
  alignItems: "start",
  [theme.breakpoints.down(1000.05)]: {
    gridTemplateColumns: "220px minmax(0, 1fr)",
    gap: "20px",
  },
  [theme.breakpoints.down(700.05)]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));

export const Sidebar = styled("aside", hrdSlot("AboutSidebar"))(({ theme }) => ({
  boxShadow: "var(--Hrd-about-raised-shadow)",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  background: `${(theme.vars ?? theme).palette.background.paper}`,
}));

export const NavTitle = styled(Typography, hrdSlot("AboutNavTitle"))<TypographyProps>(({ theme }) => ({
  padding: "18px 20px",
  background: "linear-gradient(90deg, #F0C54C, #EDAC4C 50%, #EA9548)",
  color: "#26247B",
  borderBottom: "3px solid transparent",
  borderImage: "linear-gradient(90deg, #F0C54C, #EDAC4C 50%, #EA9548) 1",
  [theme.breakpoints.down(700.05)]: {
    display: "none",
  },
}));

export const Navigation = styled("nav", hrdSlot("AboutNavigation"))(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  "& a": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "18px 20px",
    textDecoration: "none",
    color: "inherit",
    borderInlineStart: "3px solid transparent",
    borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  },
  "& a svg": {
    flexShrink: "0",
  },
  "& a:hover": {
    background: "#26247B",
    color: "#F0C54C",
    borderInlineStart: "3px solid transparent",
    borderImage: "linear-gradient(#F0C54C, #EDAC4C 50%, #EA9548) 1",
  },
  "& a[aria-current=\"page\"]": {
    background: "#26247B",
    color: "#F0C54C",
    borderInlineStart: "3px solid transparent",
    borderImage: "linear-gradient(#F0C54C, #EDAC4C 50%, #EA9548) 1",
  },
  [theme.breakpoints.down(700.05)]: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    "& a": {
      padding: "14px 12px",
    },
    "& a svg": {
      display: "none",
    },
  },
}));

export const Identity = styled("div", hrdSlot("AboutIdentity"))(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "28px 20px",
  color: `${(theme.vars ?? theme).palette.text.secondary}`,
  [theme.breakpoints.down(700.05)]: {
    display: "none",
  },
}));

export const Panel = styled("article", hrdSlot("AboutPanel"))(({ theme }) => ({
  borderRadius: theme.spacing(2),
  background: `${(theme.vars ?? theme).palette.background.paper}`,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  padding: "40px",
  minWidth: "0",
  "& h2": {
    lineHeight: "1.9",
  },
  "& h3": {
    lineHeight: "1.9",
  },
  "& h4": {
    lineHeight: "1.9",
  },
  [theme.breakpoints.down(1000.05)]: {
    padding: "28px",
  },
  [theme.breakpoints.down(700.05)]: {
    padding: "24px 18px",
  },
}));

export const Profile = styled("div", hrdSlot("AboutProfile"))(({ theme }) => ({
  containerType: "inline-size",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "16px",
  padding: "10px 0 36px",
}));

export const Introduction = styled("div", hrdSlot("AboutIntroduction"))(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "16px",
  padding: "10px 0 36px",
}));

export const Chart = styled("div", hrdSlot("AboutChart"))(({ theme }) => ({
  margin: "28px 0",
  "& img": {
    display: "block",
    width: "100%",
    height: "auto",
  },
}));

export const Empty = styled("div", hrdSlot("AboutEmpty"))(({ theme }) => ({
  borderRadius: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: "18px",
  minHeight: "300px",
  margin: "28px 0",
  padding: "32px 20px",
  border: `1px dashed ${(theme.vars ?? theme).palette.divider}`,
  background: `${(theme.vars ?? theme).palette.action.hover}`,
  "& > svg": {
    color: `${(theme.vars ?? theme).palette.text.secondary}`,
  },
  "& [data-pending]": {
    justifyContent: "center",
  },
}));

export const StaffGrid = styled("div", hrdSlot("AboutStaffGrid"))(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "32px 16px",
  marginTop: "24px",
  [theme.breakpoints.down(1000.05)]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  [theme.breakpoints.down(700.05)]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));

export const StaffCard = styled("div", hrdSlot("AboutStaffCard"))(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: "12px",
}));

