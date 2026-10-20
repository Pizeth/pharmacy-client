"use client";

import Image from "next/image";
import { Button } from "@mui/material";
import { keyframes, styled } from "@mui/material/styles";
import { HrdPageContainer } from "../../components/layout/HrdPageLayout";
import { SocialIconsRoot } from "@/components/icons/components/socials";
import { hrdSlot } from "../../styles/styled";

export const Root = styled(HrdPageContainer, hrdSlot("ContactRoot"))(({ theme }) => ({
  "--Hrd-contact-section-radius": theme.spacing(2),
  display: "grid", gap: theme.spacing(4),
  paddingTop: theme.spacing(2),
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
  "& > h2": { lineHeight: 1.8, margin: 0 },
}));
export const Card = styled("article", hrdSlot("ContactCard"))(({ theme }) => ({
  "--Hrd-contact-brand": "#26247B",
  "--Hrd-contact-gold": "#edad54",
  "--Hrd-contact-card-radius": "20px",
  "--Hrd-contact-footer-height": "24px",
  "--Hrd-contact-raised-shadow": "-6px -6px 14px rgba(255,255,255,0.8), 7px 7px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45)",
  ...theme.applyStyles("dark", {
    "--Hrd-contact-raised-shadow": "-6px -6px 14px rgba(255,255,255,0.05), 7px 7px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
  }),
  position: "relative", isolation: "isolate", overflow: "hidden", containerType: "inline-size",
  padding: theme.spacing(2),
  paddingBottom: `calc(var(--Hrd-contact-footer-height) + ${theme.spacing(1.5)})`,
  aspectRatio: "7 / 4", display: "grid", gridTemplateRows: "auto minmax(0, 1fr)",
  minWidth: 0,
  minHeight: 290,
  width: "100%",
  maxWidth: 460,
  boxSizing: "border-box",
  borderRadius: "var(--Hrd-contact-card-radius)",
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  borderTop: `2px solid ${theme.alpha((theme.vars ?? theme).palette.warning.main, 0.65)}`,
  backgroundImage: "linear-gradient(135deg, color-mix(in srgb, var(--Hrd-contact-brand) 5%, transparent), transparent 55%)",
  boxShadow: "var(--Hrd-contact-raised-shadow)",
  "&::before": {
    content: '""', position: "absolute", inset: "auto 0 0",
    height: "var(--Hrd-contact-footer-height)", backgroundColor: "#fff", pointerEvents: "none",
  },
  "&::after": {
    content: '""', position: "absolute", inset: "auto 0 var(--Hrd-contact-footer-height)", height: 3,
    backgroundColor: "var(--Hrd-contact-brand)",
    pointerEvents: "none",
  },
  transition: theme.transitions.create(["box-shadow", "border-color"], { duration: 350 }),
  "@media (hover: hover) and (pointer: fine)": {
    '&:hover [data-contact-shape="true"]': { translate: "-24px -18px" },
    '&:hover [data-contact-shape="true"]:nth-child(even)': { translate: "32px 22px" },
    '&:hover [data-contact-shape="true"]:nth-child(2)': { translate: "8px -20px" },
  },
  '&:focus-within [data-contact-shape="true"]': { translate: "-24px -18px" },
  '&:focus-within [data-contact-shape="true"]:nth-child(2)': { translate: "8px -20px" },
  "@media (prefers-reduced-motion: reduce)": { "&, & *": { transition: "none !important", translate: "none !important" } },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    paddingBottom: `calc(var(--Hrd-contact-footer-height) + ${theme.spacing(1)})`,
    "--Hrd-contact-card-radius": "14px",
    "--Hrd-contact-footer-height": "20px", minHeight: 224,
  },
}));
// Lower business card's overlapping diamonds, with kind-panther-93's sliding motion.
export const CardArt = styled("div", hrdSlot("ContactCardArt"))({
  position: "absolute", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none",
});
export const CardShape = styled("span", hrdSlot("ContactCardShape"))(({ theme }) => ({
  position: "absolute", width: "34%", aspectRatio: "1", borderRadius: 18,
  right: "-22%", bottom: "8%", transform: "rotate(45deg)",
  backgroundColor: `color-mix(in srgb, var(--Hrd-contact-gold) 30%, ${(theme.vars ?? theme).palette.background.paper})`,
  backgroundImage: `linear-gradient(135deg, color-mix(in srgb, #E8B841 45%, ${(theme.vars ?? theme).palette.background.paper}), color-mix(in srgb, #D38944 25%, ${(theme.vars ?? theme).palette.background.paper}))`,
  boxShadow: "inset 1px 1px 8px rgba(0,0,0,0.15)",
  border: "1px solid color-mix(in srgb, var(--Hrd-contact-gold) 18%, transparent)",
  transition: "translate 400ms ease-out",
  "&::before": { content: '""', position: "absolute", inset: 12, borderRadius: 14, border: "1px solid color-mix(in srgb, var(--Hrd-contact-gold) 12%, transparent)" },
  "&::after": {
    content: '""', position: "absolute", inset: 14, borderRadius: 12,
    backgroundColor: "#fff",
    maskImage: 'url("/static/svg/patterns/red-pattern.svg")', maskSize: "104px 104px", maskRepeat: "repeat",
    opacity: 0.32,
  },
  "&:nth-child(2)": { right: "auto", left: "-18%", bottom: "-69%", width: "54%" },
  "&:nth-child(3)": { right: "-18%", bottom: "48%", width: "27%" },
  "&:nth-child(4)": { right: "-5%", bottom: "-38%", width: "42%", backgroundImage: "none" },
}));
export const CardHeader = styled("div", hrdSlot("ContactCardHeader"))(({ theme }) => ({
  position: "relative", isolation: "isolate", overflow: "hidden", display: "grid", gridTemplateColumns: "48px minmax(0, 1fr) 48px", alignItems: "center", gap: theme.spacing(1),
  margin: theme.spacing(-2, -2, 1.5), padding: theme.spacing(1.5),
  backgroundColor: "var(--Hrd-contact-brand)",
  borderBottom: "3px solid transparent",
  borderImage: "linear-gradient(90deg, #F0C54C, #EDAC4C 50%, #EA9548) 1",
  [theme.breakpoints.down("sm")]: { margin: theme.spacing(-1.5, -1.5, 1), padding: theme.spacing(1), gridTemplateColumns: "32px minmax(0, 1fr) 32px", gap: theme.spacing(0.5) },
  "& h2": {
    position: "relative", zIndex: 1, gridColumn: 2, gridRow: 1, textAlign: "center", minWidth: 0,
    fontFamily: "var(--font-mef2), var(--font-moul), serif",
    fontWeight: 400,
    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
    lineHeight: 1.9,
    color: "var(--Hrd-contact-gold)",
    [theme.breakpoints.down("sm")]: { fontSize: "0.8rem", lineHeight: 1.7 },
  },
}));
export const HeaderPattern = styled("span", hrdSlot("ContactHeaderPattern"))({
  position: "absolute", inset: "0 0 0 auto", width: "48%", pointerEvents: "none", zIndex: 0,
  maskImage: "linear-gradient(to right, transparent, black 75%)", opacity: 0.2,
  "&::before": {
    content: '""', position: "absolute", inset: 0, backgroundColor: "var(--Hrd-contact-gold)",
    maskImage: 'url("/static/svg/patterns/rumduol.svg")', maskSize: "104px 104px", maskRepeat: "repeat", maskPosition: "right center",
  },
});
export const Logo = styled(Image, hrdSlot("ContactLogo"))(({ theme }) => ({ position: "relative", zIndex: 1, gridColumn: 1, gridRow: 1, flexShrink: 0, objectFit: "contain", width: 48, height: 48, filter: `drop-shadow(0 2px 4px ${theme.alpha((theme.vars ?? theme).palette.common.black, 0.2)})`, [theme.breakpoints.down("sm")]: { width: 32, height: 32 } }));
export const CardBody = styled("div", hrdSlot("ContactCardBody"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "104px minmax(0, 1fr)", gap: theme.spacing(2), alignItems: "stretch", alignContent: "center", minHeight: 0,
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "72px minmax(0, 1fr)", gap: theme.spacing(1) },
}));
export const Portrait = styled(Image, hrdSlot("ContactPortrait"))(({ theme }) => ({
  width: "100%", height: 0, minHeight: "100%", objectFit: "cover", objectPosition: "center top",
  boxSizing: "border-box", borderRadius: 12,
  border: "2px solid transparent",
  backgroundImage: `linear-gradient(${(theme.vars ?? theme).palette.background.paper}, ${(theme.vars ?? theme).palette.background.paper}), linear-gradient(145deg, #F0C54C, #EDAC4C 50%, #EA9548)`,
  backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box",
  boxShadow: `0 8px 18px ${theme.alpha((theme.vars ?? theme).palette.common.black, 0.12)}`,
}));
export const Copy = styled("div", hrdSlot("ContactCopy"))(({ theme }) => ({
  minWidth: 0, display: "flex", flexDirection: "column", gap: theme.spacing(0.5),
  "& h3": { fontWeight: 700, lineHeight: 1.8 },
  [theme.breakpoints.down("sm")]: { gap: theme.spacing(0.25), "& .MuiTypography-root, & a": { fontSize: "0.7rem", lineHeight: 1.5 }, "& h3": { fontSize: "0.8rem", lineHeight: 1.6 }, "& svg": { width: 14, height: 14 } },
}));
export const Role = styled("div", hrdSlot("ContactRole"))(({ theme }) => ({ display: "flex", alignItems: "center", gap: theme.spacing(1), "& > svg": { flexShrink: 0, color: "#D38944" } }));
export const ContactRow = styled("div", hrdSlot("ContactRow"))(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(1), minWidth: 0,
  "& > svg": { flexShrink: 0, color: "#D38944" },
}));
export const ContactLink = styled("a", hrdSlot("ContactLink"))(({ theme }) => ({
  ...theme.typography.body2, color: "inherit", textDecoration: "none", overflowWrap: "anywhere",
  "&:hover": { textDecoration: "underline" },
  "&:focus-visible": { outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`, outlineOffset: 3 },
}));
export const Socials = styled(SocialIconsRoot, hrdSlot("ContactSocials"))(({ theme }) => ({
  justifyContent: "flex-start", flexWrap: "wrap", gap: theme.spacing(1.5), marginTop: theme.spacing(0.5),
  "&& .MuiIconButton-root": {
    margin: 0,
    width: 32,
    height: 32,
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
    boxShadow: "-4px -4px 9px rgba(255,255,255,0.8), 4px 4px 9px rgba(0,0,0,0.14)",
    ...theme.applyStyles("dark", {
      boxShadow: "-4px -4px 9px rgba(255,255,255,0.06), 4px 4px 9px rgba(0,0,0,0.4)",
    }),
    "&:active": { boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.08)" },
  },
  [theme.breakpoints.down("sm")]: { marginTop: 0, gap: theme.spacing(1), "&& .MuiIconButton-root": { width: 26, height: 26 } },
}));

export const PageGrid = styled("div", hrdSlot("ContactPageGrid"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "minmax(0, 460px) minmax(0, 1fr)", gap: theme.spacing(4), alignItems: "start",
  [theme.breakpoints.down("md")]: { gridTemplateColumns: "minmax(0, 1fr)" },
  [theme.breakpoints.down("sm")]: { gap: theme.spacing(2) },
}));
export const Details = styled("div", hrdSlot("ContactDetails"))(({ theme }) => ({ minWidth: 0, display: "grid", gap: theme.spacing(2.5) }));
export const Location = styled("section", hrdSlot("ContactLocation"))(({ theme }) => ({
  minWidth: 0, overflow: "hidden", borderRadius: "var(--Hrd-contact-section-radius)", backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`, boxShadow: theme.shadows[1],
}));
export const SectionHeader = styled("div", hrdSlot("ContactSectionHeader"))(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(1.5), padding: theme.spacing(2.5),
  "& svg": { color: "#b7791f", flexShrink: 0, ...theme.applyStyles("dark", { color: "#e5bd70" }) },
  "& h2": { lineHeight: 1.8 },
}));
export const Map = styled("iframe", hrdSlot("ContactMap"))(({ theme }) => ({
  display: "block", width: "100%", height: 440, border: 0,
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
  [theme.breakpoints.down("sm")]: { height: 260 },
}));
export const MapCanvas = styled("div", hrdSlot("ContactMapCanvas"))(({ theme }) => ({
  position: "relative", isolation: "isolate", width: "100%", height: 440,
  backgroundColor: (theme.vars ?? theme).palette.background.default,
  "& img[data-hrd-map-marker]": { width: 48, height: "auto", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))" },
  [theme.breakpoints.down("sm")]: { height: 260 },
}));

export const FormSection = styled("section", hrdSlot("ContactFormSection"))(({ theme }) => ({
  display: "grid", gap: theme.spacing(2), minWidth: 0,
  "& > h2": { lineHeight: 1.8, margin: 0 },
}));
export const Form = styled("form", hrdSlot("ContactForm"))(({ theme }) => ({
  display: "grid", gap: theme.spacing(2.5), padding: theme.spacing(3), borderRadius: "var(--Hrd-contact-section-radius)",
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  "& h2": { lineHeight: 1.8 },
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
}));
export const SendButton = styled(Button, hrdSlot("ContactSendButton"))({
  borderRadius: "50px",
});
export const Fields = styled("div", hrdSlot("ContactFields"))(({ theme }) => ({
  display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: { gridTemplateColumns: "minmax(0, 1fr)" },
}));
const carouselZoomOut = keyframes({
  "0%": { transform: "scale(1.12)", opacity: 0 },
  "8%": { opacity: 1 },
  "100%": { transform: "scale(1)", opacity: 1 },
});
export const Carousel = styled("section", hrdSlot("ContactCarousel"))(({ theme }) => ({
  position: "relative", overflow: "hidden", borderRadius: "var(--Hrd-contact-section-radius)",
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  height: "clamp(220px, 32vw, 480px)",
}));
export const CarouselImage = styled(Image, hrdSlot("ContactCarouselImage"))({
  display: "block", width: "100%", height: "100%", objectFit: "cover",
  animation: `${carouselZoomOut} 6s linear both`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});
export const Address = styled("div", hrdSlot("ContactAddress"))(({ theme }) => ({
  padding: theme.spacing(2.5), display: "flex", flexDirection: "column", alignItems: "flex-start", gap: theme.spacing(2),
  "& p": { lineHeight: 1.9 },
}));
export const Hours = styled("div", hrdSlot("ContactHours"))(({ theme }) => ({
  position: "absolute", inset: "auto 0 0", height: "var(--Hrd-contact-footer-height)",
  display: "flex", alignItems: "center", justifyContent: "center", gap: theme.spacing(0.75),
  paddingInline: theme.spacing(1), boxSizing: "border-box", whiteSpace: "nowrap",
  color: "var(--Hrd-contact-brand)",
  "& > div": { display: "flex", alignItems: "center", justifyContent: "center", gap: theme.spacing(0.25) },
  "& svg": { flexShrink: 0, width: "2cqi", height: "2cqi" },
  "& .MuiTypography-root": { fontSize: "clamp(0.35rem, 1.9cqi, 0.6rem)", lineHeight: 1.4, textAlign: "center" },
}));
export const Documents = styled("div", hrdSlot("ContactDocuments"))(({ theme }) => ({
  padding: theme.spacing(2.5), borderRadius: 6, borderInlineStart: "3px solid #d8b36c",
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  "& p": { marginBottom: theme.spacing(1) },
}));
