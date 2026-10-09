"use client";
import { styled } from "@mui/material/styles";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { hrdSlot } from "../../styles/styled";

export const Root = styled("section", hrdSlot("HomeGallery"))(({ theme }) => ({ paddingBlock: theme.spacing(3), overflow: "hidden", containerType: "inline-size" }));
export const frameProperties = {
  "@property --Hrd-gallery-frame-angle": { syntax: '"<angle>"', inherits: "false", initialValue: "-45deg" },
};
export const Heading = styled(Typography, hrdSlot("HomeGalleryHeading"))(({ theme }) => ({ textAlign: "center", marginBottom: theme.spacing(2) }));
export const Scene = styled("div", hrdSlot("HomeGalleryScene"))({
  "--Hrd-gallery-width": "clamp(190px, 23cqw, 300px)",
  containerType: "inline-size", height: "clamp(330px, 48cqw, 500px)", display: "grid", placeItems: "center", perspective: "1200px", overflow: "hidden",
  touchAction: "pan-y", userSelect: "none", cursor: "grab",
  "&:active": { cursor: "grabbing" },
});
export const Assembly = styled("div", hrdSlot("HomeGalleryAssembly"))({
  "--Hrd-gallery-radius": "calc(var(--Hrd-gallery-width) * 2.15)",
  position: "relative", width: "var(--Hrd-gallery-width)", aspectRatio: "2 / 3",
  transformStyle: "preserve-3d", transform: "translateZ(calc(-1 * var(--Hrd-gallery-radius))) rotateY(var(--Hrd-gallery-angle, 0deg))",
  transition: "transform 120ms ease-out",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});
export const Card = styled("article", hrdSlot("HomeGalleryCard"))({
  position: "absolute", inset: 0, transformStyle: "preserve-3d",
  transform: "rotateY(var(--Hrd-gallery-card-angle)) translateZ(var(--Hrd-gallery-radius))",
  "&[data-facing=false]": { pointerEvents: "none" },
  "&[data-flippable=true]:hover > div, &[data-flippable=true]:focus-within > div, &[data-flipped=true] > div": { transform: "rotateY(180deg)" },
  "@media (hover: none)": { "&[data-flippable=true]:hover > div": { transform: "none" }, "&[data-flipped=true] > div": { transform: "rotateY(180deg)" } },
});
export const Flip = styled("div", hrdSlot("HomeGalleryFlip"))({
  position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 350ms ease-out",
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
});
export const Face = styled("div", hrdSlot("HomeGalleryFace"))(({ theme }) => ({
  position: "absolute", inset: 0, borderRadius: theme.shape.borderRadius,
  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
  padding: theme.spacing(2), gap: theme.spacing(1.5), textAlign: "center", backfaceVisibility: "hidden",
  "--Hrd-gallery-frame": (theme.vars ?? theme).palette.secondary.main,
  "--Hrd-gallery-frame-angle": "-45deg",
  "--Hrd-gallery-frame-base": "#fff",
  ...theme.applyStyles("dark", { "--Hrd-gallery-frame-base": "#121212" }),
  border: "4px solid transparent",
  background: `linear-gradient(145deg, ${theme.alpha((theme.vars ?? theme).palette.primary.main, 0.18)}, ${theme.alpha((theme.vars ?? theme).palette.error.main, 0.12)}), linear-gradient(${(theme.vars ?? theme).palette.background.paper} 0 0), repeating-conic-gradient(from var(--Hrd-gallery-frame-angle), transparent 0% 15%, var(--Hrd-gallery-frame) 20% 30%, transparent 35% 50%) var(--Hrd-gallery-frame-base)`,
  backgroundOrigin: "padding-box, padding-box, border-box",
  backgroundClip: "padding-box, padding-box, border-box",
  transition: "--Hrd-gallery-frame-angle 350ms ease-out",
  color: (theme.vars ?? theme).palette.text.primary, boxShadow: theme.shadows[6],
  "article[data-flippable=true]:hover &, article[data-flippable=true]:focus-within &, article[data-flipped=true] &": {
    "--Hrd-gallery-frame": (theme.vars ?? theme).palette.error.main, "--Hrd-gallery-frame-angle": "135deg",
  },
  "&::after": {
    content: '""', position: "absolute", inset: 0, borderRadius: "inherit",
    background: "var(--Hrd-gallery-frame-base)", opacity: 0, pointerEvents: "none",
  },
  "article[data-active=false] &::after": { opacity: 0.35 },
  "article[data-facing=false] &::after": { opacity: 0.65 },
  "article[data-facing=false] & > *": { visibility: "hidden" },
  "&[data-side=back]": { transform: "rotateY(180deg)" },
  "& > svg": { color: (theme.vars ?? theme).palette.primary.main },
  "& .MuiTypography-root": { fontSize: "clamp(0.8rem, 1.4cqw, 1rem)", overflowWrap: "anywhere" },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));
export const DocumentLink = styled(Link, hrdSlot("HomeGalleryLink"))(({ theme }) => ({ color: (theme.vars ?? theme).palette.primary.main, fontWeight: 700 }));
export const Controls = styled("div", hrdSlot("HomeGalleryControls"))(({ theme }) => ({ display: "flex", justifyContent: "center", alignItems: "center", gap: theme.spacing(2), marginTop: theme.spacing(2) }));
export const Control = styled(Button, hrdSlot("HomeGalleryControl"))({});
