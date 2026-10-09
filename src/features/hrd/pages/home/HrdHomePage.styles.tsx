"use client";

import Link from "next/link";
import { Button, IconButton, Typography } from "@mui/material";
import type { ButtonProps, TypographyProps } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { HrdPageContainer } from "../../components/layout/HrdPageLayout";
import { hrdSlot } from "../../styles/styled";

const gridDrift = keyframes({ to: { backgroundPosition: "48px 48px" } });
const scan = keyframes({ from: { transform: "translateY(-100%)" }, to: { transform: "translateY(420px)" } });
const titleGlow = keyframes({ "50%": { filter: "drop-shadow(0 0 10px var(--Hrd-effect-accent))" } });

export const Root = styled(HrdPageContainer, hrdSlot("HomeRoot"))(({ theme }) => ({
  "--Hrd-effect-accent": (theme.vars ?? theme).palette.secondary.main,
  "& a[data-effect-card]": { position: "relative", overflow: "hidden", transition: "box-shadow 350ms ease, translate 350ms ease, border-color 350ms ease",
    "&::after": { content: '""', position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `linear-gradient(110deg, transparent 25%, ${theme.alpha((theme.vars ?? theme).palette.secondary.main, 0.16)} 50%, transparent 75%)`,
      transform: "translateX(-100%)", transition: "transform 700ms ease" },
    "&:hover, &:focus-visible": { translate: "0 -5px", borderColor: (theme.vars ?? theme).palette.secondary.main,
      boxShadow: `0 8px 28px ${theme.alpha((theme.vars ?? theme).palette.secondary.main, 0.24)}, 0 0 0 1px ${(theme.vars ?? theme).palette.secondary.main}`,
      "&::after": { transform: "translateX(100%)" } },
  },
  "--Hrd-blue": "#08477f",
  "--Hrd-gold": "#d8b36c",
  "--Hrd-surface": `${(theme.vars ?? theme).palette.background.paper}`,
  "--Hrd-text": `${(theme.vars ?? theme).palette.text.primary}`,
  margin: "0 auto",
  color: "var(--Hrd-text)",
  paddingBottom: "40px",
  "& [data-scroll-reveal]": {
    transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1)",
  },
  "& [data-reveal-state=waiting]": {
    opacity: 0,
    transform: "translateY(32px)",
  },
  "& [data-scroll-reveal=flip-left][data-reveal-state=waiting]": {
    transform: "perspective(1200px) rotateY(12deg)",
  },
  "& [data-scroll-reveal=flip-up][data-reveal-state=waiting]": {
    transform: "perspective(1200px) rotateX(18deg)",
  },
  "& [data-scroll-reveal=zoom-in][data-reveal-state=waiting]": {
    transform: "scale(0.94)",
  },
  "& [data-scroll-reveal=fade][data-reveal-state=waiting]": {
    transform: "none",
  },
  "& [data-reveal-state=visible]": { opacity: 1, transform: "none" },
  "& [data-reveal-state=static]": { opacity: 1, transform: "none", transition: "none" },
  "& [data-scroll-reveal]:focus-within": {
    opacity: 1,
    transform: "none",
  },
  "@media (prefers-reduced-motion: reduce)": {
    "& *, & *::before, & *::after": { animation: "none !important", transition: "none !important" },
    "& a[data-effect-card]:hover, & a[data-effect-card]:focus-visible": { translate: "none" },
    "& [data-scroll-reveal]": { transition: "none", transform: "none", opacity: 1 },
  },
  [theme.breakpoints.down(700.05)]: {
    paddingBottom: "25px",
  },
}));

export const Identity = styled("header", hrdSlot("HomeIdentity"))(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "24px",
  padding: "12px 0 30px",
  [theme.breakpoints.down(700.05)]: {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "8px",
    paddingBottom: "22px",
  },
}));

export const Kicker = styled(Typography, hrdSlot("HomeKicker"))<TypographyProps>(({ theme }) => ({
  color: `${(theme.vars ?? theme).palette.text.secondary}`,
}));

export const English = styled(Typography, hrdSlot("HomeEnglish"))<TypographyProps>(({ theme }) => ({
  letterSpacing: ".14em",
  fontSize: "11px",
  color: `${(theme.vars ?? theme).palette.text.secondary}`,
}));

export const Feature = styled("section", hrdSlot("HomeFeature"))(({ theme }) => ({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  minHeight: "390px",
  background: "var(--Hrd-blue)",
  color: "#fff",
  overflow: "hidden",
  [theme.breakpoints.down(700.05)]: {
    gridTemplateColumns: "1fr",
  },
}));

export const FeatureVisual = styled("div", hrdSlot("HomeFeatureVisual"))(({ theme }) => ({
  position: "relative",
  minHeight: "390px",
  background: "#ecf2f6",
  "& img": {
    objectFit: "cover",
  },
  [theme.breakpoints.down(700.05)]: {
    minHeight: "250px",
  },
}));

export const VisualCaption = styled("div", hrdSlot("HomeVisualCaption"))(({ theme }) => ({
  position: "absolute",
  bottom: "0",
  insetInline: "0",
  padding: "20px 35px",
  color: "#fff",
  background: "linear-gradient(transparent, #103757e6)",
}));

export const GoldLine = styled("span", hrdSlot("HomeGoldLine"))(({ theme }) => ({
  display: "block",
  width: "36px",
  height: "3px",
  background: "var(--Hrd-gold)",
  marginBottom: "10px",
}));

export const FeatureCopy = styled("div", hrdSlot("HomeFeatureCopy"))(({ theme }) => ({
  position: "relative", isolation: "isolate", overflow: "hidden",
  "&::before": { content: '""', position: "absolute", inset: 0, zIndex: -1, pointerEvents: "none",
    backgroundImage: `linear-gradient(${theme.alpha((theme.vars ?? theme).palette.secondary.light, 0.12)} 1px, transparent 1px), linear-gradient(90deg, ${theme.alpha((theme.vars ?? theme).palette.secondary.light, 0.12)} 1px, transparent 1px)`,
    backgroundSize: "48px 48px", animation: `${gridDrift} 16s linear infinite` },
  "&::after": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: 2, pointerEvents: "none",
    backgroundImage: `linear-gradient(90deg, transparent, ${(theme.vars ?? theme).palette.secondary.light}, transparent)`,
    opacity: 0.5, animation: `${scan} 6s linear infinite` },
  alignSelf: "center",
  padding: "44px 55px",
  [theme.breakpoints.down(1000.05)]: {
    padding: "30px 40px",
  },
  [theme.breakpoints.down(700.05)]: {
    padding: "30px 36px",
  },
}));

export const FeatureEyebrow = styled(Typography, hrdSlot("HomeFeatureEyebrow"))<TypographyProps>(({ theme }) => ({
  color: "#e5c589",
  letterSpacing: ".03em",
}));

export const FeatureTitle = styled(Typography, hrdSlot("HomeFeatureTitle"))<TypographyProps>(({ theme }) => ({
  animation: `${titleGlow} 4s ease-in-out infinite`,
  lineHeight: "1.9",
  fontSize: "clamp(21px, 2.1vw, 30px)",
  margin: "12px 0 18px",
  [theme.breakpoints.down(700.05)]: {
    fontSize: "22px",
  },
}));

export const FeatureDescription = styled(Typography, hrdSlot("HomeFeatureDescription"))<TypographyProps>(({ theme }) => ({
  lineHeight: "1.9",
  opacity: ".85",
}));

export const HeroButton = styled(Button, hrdSlot("HomeHeroButton"))<ButtonProps>(({ theme }) => ({
  color: "#fff",
  marginTop: "22px",
  padding: "8px 0",
  borderBottom: "1px solid #d8b36c",
  borderRadius: "0",
}));

export const CarouselArrow = styled(IconButton, hrdSlot("HomeCarouselArrow"))(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#fff",
  background: "#002d56a6",
  borderRadius: "2px",
  "&:hover": {
    background: "#002d56",
  },
  "&[data-direction=\"previous\"]": {
    left: "10px",
  },
  "&[data-direction=\"next\"]": {
    right: "10px",
  },
  [theme.breakpoints.down(700.05)]: {
    top: "125px",
  },
}));

export const Pagination = styled("div", hrdSlot("HomePagination"))(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: "9px",
  padding: "17px",
}));

export const Dot = styled("button", hrdSlot("HomeDot"))(({ theme }) => ({
  padding: "0",
  width: "10px",
  height: "10px",
  border: "1px solid #8495a8",
  background: "transparent",
  borderRadius: "50%",
  cursor: "pointer",
  "&[aria-pressed=\"true\"]": {
    background: "#08477f",
    borderColor: "#08477f",
  },
  "&:focus-visible": {
    outline: "2px solid #d8b36c",
    outlineOffset: "4px",
  },
}));

export const Section = styled("section", hrdSlot("HomeSection"))(({ theme }) => ({
  padding: "32px 0",
  scrollMarginTop: "220px",
}));

export const SectionHeading = styled("div", hrdSlot("HomeSectionHeading"))(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "25px",
  paddingBottom: "17px",
  borderBottom: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  "& h2": {
    lineHeight: "1.7",
  },
  "& h2::after": {
    content: "\"\"",
    display: "block",
    width: "45px",
    height: "3px",
    background: "var(--Hrd-gold)",
    marginTop: "12px",
  },
  [theme.breakpoints.down(700.05)]: {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "10px",
  },
}));

export const DocumentGrid = styled("div", hrdSlot("HomeDocumentGrid"))(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "28px",
  [theme.breakpoints.down(1000.05)]: {
    gap: "18px",
  },
  [theme.breakpoints.down(700.05)]: {
    gridTemplateColumns: "1fr",
  },
}));

export const DocumentCard = styled(Link, hrdSlot("HomeDocumentCard"))(({ theme }) => ({
  display: "block",
  color: "inherit",
  textDecoration: "none",
  background: "var(--Hrd-surface)",
  "&:hover h3": {
    color: `${(theme.vars ?? theme).palette.primary.main}`,
  },
}));

export const DocumentCover = styled("div", hrdSlot("HomeDocumentCover"))(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "13px",
  minHeight: "225px",
  padding: "25px",
  color: "#fff",
  textAlign: "center",
  borderTop: "5px solid var(--Hrd-gold)",
  background: "radial-gradient(circle at 90% 10%, #ffffff17, transparent 55%), #08477f",
  "& h6": {
    lineHeight: "1.8",
  },
  "&[data-cover=\"1\"]": {
    backgroundColor: "#136f9b",
  },
  "&[data-cover=\"2\"]": {
    backgroundColor: "#164c70",
  },
  [theme.breakpoints.down(700.05)]: {
    minHeight: "200px",
  },
}));

export const CardCopy = styled("div", hrdSlot("HomeCardCopy"))(({ theme }) => ({
  padding: "24px",
  "& h3": {
    lineHeight: "1.9",
    margin: "8px 0 12px",
  },
}));

export const Category = styled(Typography, hrdSlot("HomeCategory"))<TypographyProps>(({ theme }) => ({
  color: `${(theme.vars ?? theme).palette.primary.main}`,
}));

export const Secondary = styled(Typography, hrdSlot("HomeSecondary"))<TypographyProps>(({ theme }) => ({
  color: `${(theme.vars ?? theme).palette.text.secondary}`,
  lineHeight: "1.8",
}));

export const Welcome = styled("section", hrdSlot("HomeWelcome"))(({ theme }) => ({
  margin: "30px 0",
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  background: "var(--Hrd-surface)",
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  [theme.breakpoints.down(700.05)]: {
    gridTemplateColumns: "1fr",
  },
}));

export const WelcomeSymbol = styled("div", hrdSlot("HomeWelcomeSymbol"))(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "25px",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "300px",
  padding: "25px",
  color: "#08477f",
  background: "#edf3f8",
  textAlign: "center",
  [theme.breakpoints.down(700.05)]: {
    minHeight: "190px",
  },
}));

export const WelcomeCopy = styled("div", hrdSlot("HomeWelcomeCopy"))(({ theme }) => ({
  padding: "38px 42px",
  "& h2": {
    lineHeight: "1.8",
    margin: "8px 0 18px",
  },
  "& p": {
    marginBottom: "14px",
    lineHeight: "2",
  },
  [theme.breakpoints.down(700.05)]: {
    padding: "28px 24px",
  },
}));

export const QuickLinks = styled("section", hrdSlot("HomeQuickLinks"))(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "22px",
  padding: "20px 0",
  "& a": {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    background: "#08477f",
    color: "#fff",
    padding: "28px",
    textDecoration: "none",
    borderBottom: "3px solid var(--Hrd-gold)",
  },
  "& a > svg:last-child": {
    marginLeft: "auto",
    flexShrink: "0",
  },
  "& a:hover": {
    background: "#063963",
  },
  [theme.breakpoints.down(1000.05)]: {
    gap: "14px",
    "& a": {
      padding: "22px 18px",
      gap: "10px",
    },
  },
  [theme.breakpoints.down(700.05)]: {
    gridTemplateColumns: "1fr",
  },
}));

export const ResourceGrid = styled("div", hrdSlot("HomeResourceGrid"))(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "20px",
  [theme.breakpoints.down(1000.05)]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  [theme.breakpoints.down(700.05)]: {
    gap: "12px",
  },
}));

export const ResourceCard = styled(Link, hrdSlot("HomeResourceCard"))(({ theme }) => ({
  "&:hover h3": {
    color: `${(theme.vars ?? theme).palette.primary.main}`,
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "18px",
  textDecoration: "none",
  color: "inherit",
  background: "var(--Hrd-surface)",
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  padding: "28px 24px",
  "& > svg": {
    color: `${(theme.vars ?? theme).palette.primary.main}`,
  },
  "& h3": {
    lineHeight: "1.9",
    flex: "1",
  },
  [theme.breakpoints.down(700.05)]: {
    padding: "20px 16px",
  },
}));

export const Contact = styled("section", hrdSlot("HomeContact"))(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "28px",
  padding: "35px",
  marginTop: "25px",
  background: "var(--Hrd-surface)",
  borderInlineStart: "4px solid var(--Hrd-gold)",
  scrollMarginTop: "220px",
  "& h2": {
    marginBottom: "12px",
    lineHeight: "1.8",
  },
  [theme.breakpoints.down(700.05)]: {
    alignItems: "flex-start",
    flexDirection: "column",
    padding: "25px",
  },
}));

