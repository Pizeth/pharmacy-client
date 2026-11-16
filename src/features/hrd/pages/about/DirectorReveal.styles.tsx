"use client";
import { styled } from "@mui/material/styles";
import { hrdSlot } from "../../styles/styled";

// Matches --Hrd-contact-brand in the contact card's upper section.
const directorBlue = "#26247B";

export const Root = styled("div", hrdSlot("DirectorReveal"))(({ theme }) => ({
  position: "relative", width: "min(300px, 100%)", height: "min(300px, 100cqw)",
  marginBlock: theme.spacing(3), transition: "width 500ms ease 300ms, height 500ms ease 300ms",
  "&::before": { content: '""', position: "absolute", inset: 0, borderRadius: "50%",
    border: `4px solid ${directorBlue}`,
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
    boxShadow: `0 0 28px ${theme.alpha(directorBlue, 0.3)}`,
    transition: "border-radius 500ms ease, background-color 500ms ease" },
  "&[data-expanded=true]": { width: "100%", height: 320,
    "&::before": { borderRadius: theme.spacing(2), backgroundColor: directorBlue },
    "& button img": { opacity: 0, transitionDelay: "0ms" },
    "& [data-copy]": { opacity: 1, transform: "translateX(0)", transitionDelay: "500ms" },
    "& [data-visual]": { transform: "translateY(0) scale(1)", opacity: 1, transitionDelay: "400ms" },
  },
  "@media (hover: none), (max-width: 600px)": {
    "&[data-expanded=true]": { height: 420 },
    "&[data-expanded=true] [data-copy]": { width: "100%", top: "auto", bottom: theme.spacing(3) },
    "& [data-visual]": { top: theme.spacing(3), right: "calc(50% - 90px)", width: 180, height: 180 },
  },
  "@media (prefers-reduced-motion: reduce)": { "&, &::before, & *": { transition: "none !important" } },
}));
export const Seal = styled("button", hrdSlot("DirectorSeal"))(() => ({
  position: "absolute", inset: 0, width: "100%", height: "100%", padding: 4, border: 0, background: "transparent", cursor: "pointer", borderRadius: "50%", zIndex: 2,
  "& img": { display: "block", width: "min(292px, 100%)", height: "auto", aspectRatio: "1", marginInline: "auto", objectFit: "cover", objectPosition: "center top", borderRadius: "50%", transition: "opacity 200ms ease 800ms" },
  "&:focus-visible": { outline: `3px solid ${directorBlue}`, outlineOffset: 6 },
}));
export const Copy = styled("div", hrdSlot("DirectorCopy"))(({ theme }) => ({
  position: "absolute", left: 0, top: "20%", width: "55%", padding: theme.spacing(3), boxSizing: "border-box",
  color: (theme.vars ?? theme).palette.common.white, textAlign: "start", opacity: 0,
  transform: "translateX(20px)", transition: "opacity 500ms ease, transform 500ms ease",
  "& h2": { marginBottom: theme.spacing(2) },
}));
export const Visual = styled("div", hrdSlot("DirectorVisual"))(({ theme }) => ({
  position: "absolute", right: "5%", top: "-5%", width: "min(35%, 280px)", aspectRatio: "1", display: "grid", placeItems: "center",
  color: (theme.vars ?? theme).palette.common.white, opacity: 0,
  borderRadius: theme.spacing(2), overflow: "hidden",
  "&::after": {
    content: '""', position: "absolute", inset: 0, zIndex: 1,
    padding: 3, borderRadius: "inherit", pointerEvents: "none",
    background: "linear-gradient(135deg, #F0C54C, #EDAC4C 50%, #EA9548)",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
  },
  transform: "translateY(8px) scale(0.96)", transition: "transform 400ms ease, opacity 200ms ease",
  "& img": { objectFit: "cover", objectPosition: "center top" },
}));
