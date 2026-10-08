"use client";
import { styled } from "@mui/material/styles";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { hrdSlot } from "../../styles/styled";

export const Root = styled("section", hrdSlot("HomeGallery"))(({ theme }) => ({ paddingBlock: theme.spacing(3), overflow: "hidden" }));
export const Heading = styled(Typography, hrdSlot("HomeGalleryHeading"))(({ theme }) => ({ textAlign: "center", marginBottom: theme.spacing(2) }));
export const Scene = styled("div", hrdSlot("HomeGalleryScene"))({
  height: 380, display: "grid", placeItems: "center", perspective: "1200px", overflow: "hidden",
});
export const Assembly = styled("div", hrdSlot("HomeGalleryAssembly"))({
  position: "relative", width: "clamp(210px, 28vw, 280px)", height: 320,
  transformStyle: "preserve-3d", transform: "translateZ(-260px) rotateY(var(--Hrd-gallery-angle, 0deg))",
  transition: "transform 450ms ease-out",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});
export const Card = styled("article", hrdSlot("HomeGalleryCard"))({
  position: "absolute", inset: 0, transformStyle: "preserve-3d",
  ...Object.fromEntries(Array.from({ length: 6 }, (_, index) => [`&:nth-child(${index + 1})`, { transform: `rotateY(${index * 60}deg) translateZ(260px)` }])),
  "&[data-active=false]": { filter: "saturate(0.3) brightness(0.6)" },
  "&[data-active=true]:hover > div, &[data-active=true]:focus-within > div": { transform: "rotateY(180deg)" },
});
export const Flip = styled("div", hrdSlot("HomeGalleryFlip"))({
  position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 350ms ease-out",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});
export const Face = styled("div", hrdSlot("HomeGalleryFace"))(({ theme }) => ({
  position: "absolute", inset: 0, borderRadius: theme.shape.borderRadius,
  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
  padding: theme.spacing(3), gap: theme.spacing(2), textAlign: "center", backfaceVisibility: "hidden",
  border: `3px solid ${(theme.vars ?? theme).palette.primary.main}`,
  background: `linear-gradient(145deg, ${theme.alpha((theme.vars ?? theme).palette.primary.main, 0.18)}, ${theme.alpha((theme.vars ?? theme).palette.error.main, 0.12)}), ${(theme.vars ?? theme).palette.background.paper}`,
  color: (theme.vars ?? theme).palette.text.primary, boxShadow: theme.shadows[6],
  "&[data-side=back]": { transform: "rotateY(180deg)", borderColor: (theme.vars ?? theme).palette.error.main },
  "& > svg": { color: (theme.vars ?? theme).palette.primary.main },
}));
export const DocumentLink = styled(Link, hrdSlot("HomeGalleryLink"))(({ theme }) => ({ color: (theme.vars ?? theme).palette.primary.main, fontWeight: 700 }));
export const Controls = styled("div", hrdSlot("HomeGalleryControls"))(({ theme }) => ({ display: "flex", justifyContent: "center", alignItems: "center", gap: theme.spacing(2), marginTop: theme.spacing(2) }));
export const Control = styled(Button, hrdSlot("HomeGalleryControl"))({});
