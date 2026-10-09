"use client";
import { styled } from "@mui/material/styles";
import { hrdSlot } from "../../styles/styled";

export const Root = styled("div", hrdSlot("DirectorReveal"))(({ theme }) => ({
  position: "relative", width: "min(300px, 100%)", height: "min(300px, 100cqw)",
  marginBlock: theme.spacing(3), transition: "width 500ms ease 300ms, height 500ms ease 300ms",
  "&::before": { content: '""', position: "absolute", inset: 0, borderRadius: "50%",
    border: `4px solid ${(theme.vars ?? theme).palette.secondary.main}`,
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
    boxShadow: `0 0 28px ${theme.alpha((theme.vars ?? theme).palette.secondary.main, 0.3)}`,
    transition: "border-radius 500ms ease, background-color 500ms ease" },
  "&[data-expanded=true]": { width: "100%", height: 320,
    "&::before": { borderRadius: `calc(${typeof theme.shape.borderRadius === "number" ? `${theme.shape.borderRadius}px` : theme.shape.borderRadius} * 3)`, backgroundColor: (theme.vars ?? theme).palette.secondary.main },
    "& button img": { transform: "scale(0)", opacity: 0 },
    "& [data-copy]": { opacity: 1, transform: "translateX(0)", transitionDelay: "500ms" },
    "& [data-visual]": { transform: "scale(1)", opacity: 1, transitionDelay: "500ms" },
  },
  "@media (hover: none), (max-width: 600px)": {
    "&[data-expanded=true]": { height: 420 },
    "&[data-expanded=true] [data-copy]": { width: "100%", top: "auto", bottom: theme.spacing(3) },
    "& [data-visual]": { top: theme.spacing(3), right: "calc(50% - 90px)", width: 180, height: 200 },
  },
  "@media (prefers-reduced-motion: reduce)": { "&, &::before, & *": { transition: "none !important" } },
}));
export const Seal = styled("button", hrdSlot("DirectorSeal"))(({ theme }) => ({
  position: "absolute", inset: 0, width: "100%", border: 0, background: "transparent", cursor: "pointer", borderRadius: "inherit", zIndex: 2,
  "& img": { maxWidth: "70%", objectFit: "contain", transition: "transform 500ms ease, opacity 500ms ease" },
  "&:focus-visible": { outline: `3px solid ${(theme.vars ?? theme).palette.secondary.main}`, outlineOffset: 6 },
}));
export const Copy = styled("div", hrdSlot("DirectorCopy"))(({ theme }) => ({
  position: "absolute", left: 0, top: "20%", width: "55%", padding: theme.spacing(3), boxSizing: "border-box",
  color: (theme.vars ?? theme).palette.secondary.contrastText, textAlign: "start", opacity: 0,
  transform: "translateX(20px)", transition: "opacity 500ms ease, transform 500ms ease",
  "& h2": { marginBottom: theme.spacing(2) },
}));
export const Visual = styled("div", hrdSlot("DirectorVisual"))(({ theme }) => ({
  position: "absolute", right: "5%", top: "-5%", width: "35%", height: 300, display: "grid", placeItems: "center",
  color: (theme.vars ?? theme).palette.secondary.contrastText, opacity: 0,
  transform: "scale(0)", transition: "transform 500ms ease, opacity 500ms ease",
  "& img": { objectFit: "contain" },
}));
