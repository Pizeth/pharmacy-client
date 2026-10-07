"use client";

import { Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { HrdPageContainer } from "../../components/layout/HrdPageLayout";
import { hrdSlot } from "../../styles/styled";

export const Root = styled(HrdPageContainer, hrdSlot("ContactRoot"))(({ theme }) => ({
  margin: "auto",
  paddingBottom: "64px",
  color: `${(theme.vars ?? theme).palette.text.primary}`,
  "& a": {
    color: "inherit",
    textDecoration: "none",
  },
  "& a:hover": {
    textDecoration: "underline",
  },
  [theme.breakpoints.down(800.05)]: {
    paddingBottom: "40px",
  },
}));

export const Header = styled("header", hrdSlot("ContactHeader"))(({ theme }) => ({
  textAlign: "center",
  padding: "38px 0 44px",
  "& h1": {
    lineHeight: "1.8",
  },
  [theme.breakpoints.down(800.05)]: {
    padding: "24px 0 30px",
  },
}));

export const Accent = styled("span", hrdSlot("ContactAccent"))(({ theme }) => ({
  display: "block",
  width: "46px",
  height: "3px",
  background: "#d8b36c",
  margin: "16px auto",
}));

export const Layout = styled("div", hrdSlot("ContactLayout"))(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
  gap: "28px",
  alignItems: "start",
  [theme.breakpoints.down(800.05)]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));

export const Location = styled("section", hrdSlot("ContactLocation"))(({ theme }) => ({
  background: `${(theme.vars ?? theme).palette.background.paper}`,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  minWidth: "0",
}));

export const SectionHeader = styled("div", hrdSlot("ContactSectionHeader"))(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "24px",
  "& h2": {
    lineHeight: "1.9",
  },
  "& svg": {
    color: `${(theme.vars ?? theme).palette.primary.main}`,
    flexShrink: "0",
  },
}));

export const Map = styled("iframe", hrdSlot("ContactMap"))(({ theme }) => ({
  display: "block",
  width: "100%",
  height: "420px",
  border: "0",
  background: `${(theme.vars ?? theme).palette.action.hover}`,
  [theme.breakpoints.down(800.05)]: {
    height: "320px",
  },
}));

export const Address = styled("div", hrdSlot("ContactAddress"))(({ theme }) => ({
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  alignItems: "start",
  "& p": {
    lineHeight: "2",
  },
}));

export const Details = styled("section", hrdSlot("ContactDetails"))(({ theme }) => ({
  background: `${(theme.vars ?? theme).palette.background.paper}`,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  minWidth: "0",
  "& h2": {
    lineHeight: "1.9",
  },
  padding: "28px",
  [theme.breakpoints.down(800.05)]: {
    padding: "24px",
  },
}));

export const Description = styled(Typography, hrdSlot("ContactDescription"))<TypographyProps>(({ theme }) => ({
  lineHeight: "2",
  margin: "12px 0 24px",
}));

export const Line = styled("div", hrdSlot("ContactLine"))(({ theme }) => ({
  display: "flex",
  gap: "16px",
  borderTop: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  padding: "22px 0",
  "& > svg": {
    marginTop: "6px",
    flexShrink: "0",
    color: `${(theme.vars ?? theme).palette.primary.main}`,
  },
  "& > div": {
    minWidth: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: "8px",
    overflowWrap: "anywhere",
  },
  "& h3": {
    lineHeight: "1.9",
  },
  "& p": {
    lineHeight: "1.9",
  },
}));

export const Documents = styled("div", hrdSlot("ContactDocuments"))(({ theme }) => ({
  padding: "20px",
  background: `${(theme.vars ?? theme).palette.action.hover}`,
  borderInlineStart: "3px solid #d8b36c",
}));

