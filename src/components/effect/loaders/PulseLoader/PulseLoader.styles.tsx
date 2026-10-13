"use client";
import { Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import type { CSSInterpolation } from "@mui/material/styles";
import AvatarContainer from "@/components/Avatar/AvatarContainer";
import { GLOW_INSET } from "./geometry";
import { hi } from "@/theme/keyframes";

export type PulseLoaderSlot = "root" | "frame" | "storm" | "background" | "circleBackground" | "particle" | "ring" | "gradientRing" | "emblem" | "glow" | "outerGlow" | "avatar" | "pulse" | "progress" | "orbit" | "message";
const slot = (name: Capitalize<PulseLoaderSlot>) => ({
  name: "RazethLoader", slot: name,
  overridesResolver: (_props: unknown, styles: Record<string, CSSInterpolation>) => styles[name.charAt(0).toLowerCase() + name.slice(1)],
});
const pulse = keyframes({ from: { opacity: 0.45, transform: "scale(1)" }, to: { opacity: 0, transform: "scale(1.45)" } });
// Adapted from krlozCJ's Uiverse orbit loader (MIT); see THIRD_PARTY_LICENSES.md.
const orbit = keyframes({ "0%": { transform: "rotate(0deg)" }, "80%, 100%": { transform: "rotate(360deg)" } });
const glowRotation = keyframes({ to: { transform: "rotate(360deg)" } });
const frameRotation = keyframes({ to: { "--PulseLoader-frame-angle": "1turn" } });
const backgroundFlicker = keyframes({
  "0%, 28%, 39%, 41%, 44%, 64%, 100%": { backdropFilter: "var(--f) hue-rotate(0deg)" },
  "25%, 42%, 80%": { backdropFilter: "var(--f) hue-rotate(-25deg)" },
  "32%, 40%, 58%": { backdropFilter: "var(--f) hue-rotate(-20deg)" },
});
const blobHeights = [235, 252, 150, 253, 204, 134, 179, 299, 215, 281, 158, 210];
const blobImages = blobHeights.flatMap(height => [
  `radial-gradient(4px 100px at 0px ${height}px, var(--c), #0000)`,
  `radial-gradient(4px 100px at 300px ${height}px, var(--c), #0000)`,
  `radial-gradient(3px 4px at 150px ${height / 2}px, var(--c1) 100%, #0000 150%)`,
]).join(",");
const blobSizes = blobHeights.flatMap(height => Array(3).fill(`300px ${height}px`)).join(",");
const ringFade = keyframes({
  "0%, 100%": { opacity: 0.2 },
  "50%": { opacity: 1 },
});
export const Root = styled("div", slot("Root"))(({ theme }) => ({
  isolation: "isolate", overflow: "hidden",
  position: "fixed", top: 0, left: 0, right: 0, height: "100dvh", boxSizing: "border-box", zIndex: theme.zIndex.modal + 1,
  "--PulseLoader-accent": "#ff0000",
  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
  gap: theme.spacing(4), padding: theme.spacing(3),
  backgroundColor: theme.alpha((theme.vars ?? theme).palette.background.default, 0.92),
  color: (theme.vars ?? theme).palette.text.primary,
  "@media (prefers-reduced-motion: reduce)": {
    "& *, & *::before, & *::after": { animation: "none !important", transition: "none !important" },
  },
}));
// Inner glow inspired by Ana Tudor's CodePen WNVPdJg.
export const Frame = styled("div", slot("Frame"))(({ theme }) => ({
  position: "absolute", inset: theme.spacing(1), borderRadius: theme.spacing(3),
  overflow: "hidden", pointerEvents: "none", zIndex: 0,
  "&::before": { content: '""', position: "absolute", inset: "-1em",
    border: "solid 1.25em transparent",
    borderImage: `conic-gradient(from var(--PulseLoader-frame-angle), ${(theme.vars ?? theme).palette.primary.main}, ${(theme.vars ?? theme).palette.primary.light}, ${(theme.vars ?? theme).palette.secondary.main}, ${(theme.vars ?? theme).palette.secondary.light}, ${(theme.vars ?? theme).palette.error.main}, ${(theme.vars ?? theme).palette.primary.main}) 1`,
    filter: "blur(0.75em)", animation: `${frameRotation} 4s linear infinite`, opacity: 0.85 },
}));
export const Background = styled("div", slot("Background"))(({ theme }) => ({
  position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none",
  backgroundImage: `radial-gradient(ellipse at center, ${theme.alpha((theme.vars ?? theme).palette.primary.main, 0.12)}, transparent 65%)`,
}));
export const Particle = styled("canvas", slot("Particle"))({
  position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none",
});
export const Emblem = styled("div", slot("Emblem"))(({ theme }) => ({
  position: "relative", zIndex: 1, width: "min(clamp(100px, 20vmin, 160px), calc((100vw - 64px) / 2.8), calc((100dvh - 64px) / 2.8))", aspectRatio: "1",
  display: "grid", placeItems: "center", marginBlock: theme.spacing(7),
}));
// Solar storm inspired by Zarko Rvovic's CodePen xxNxKoQ.
export const CircleBackground = styled("span", slot("CircleBackground"))({
    position: "absolute", inset: "-47%", borderRadius: "50%", overflow: "hidden", pointerEvents: "none",
    // Confine the dotted overlay's backdrop blur to this pattern, including in light mode.
    isolation: "isolate", filter: "opacity(1)", backgroundColor: "#000",
    "&::before": {
      content: '""', position: "absolute", inset: "-145%", rotate: "-45deg",
      "--c": "#fa0", "--c1": "#f00",
      backgroundImage: blobImages,
      backgroundSize: blobSizes,
      animation: `${hi} 150s linear infinite`,
    },
    "&::after": {
      content: '""', position: "absolute", inset: 0,
      backgroundImage: "radial-gradient(circle at 50% 50%, #0000 0, #0000 2px, hsl(0 0 4%) 2px)",
      backgroundSize: "8px 8px", "--f": "blur(3em) brightness(9)",
      backdropFilter: "var(--f)",
      animation: `${backgroundFlicker} 5s ease-in-out infinite`,
    },
});
export const Storm = styled("div", slot("Storm"))(({ theme }) => ({
  position: "absolute", inset: GLOW_INSET, pointerEvents: "none", borderRadius: "50%",
  // CharandeepSingh01's inward glow, applied to our existing outer circle without a border.
  boxShadow: `0 0 20px ${(theme.vars ?? theme).palette.primary.main} inset, 0 0 8px 1px ${theme.alpha((theme.vars ?? theme).palette.primary.main, 0.25)}`,
}));
// Counter-rotating broken rings inspired by Colin Horn's CodePen zdNMVy.
export const GradientRing = styled("span", slot("GradientRing"))(({ theme }) => ({
  // SVG r=20/viewBox=66: the visible arc now matches the logo frame diameter.
  position: "absolute", inset: "-32.5%", zIndex: 2, pointerEvents: "none", borderRadius: "50%",
  "--PulseLoader-gradient-error": (theme.vars ?? theme).palette.error.main,
  "--PulseLoader-gradient-primary": (theme.vars ?? theme).palette.primary.main,
  animation: `${glowRotation} 1.2s linear infinite`,
  "& svg": { display: "block", width: "100%", height: "100%" },
}));
export const Ring = styled("span", slot("Ring"))(({ theme }) => ({
  position: "absolute", inset: "-55%", borderRadius: "50%", pointerEvents: "none",
  "--PulseLoader-ring-color": (theme.vars ?? theme).palette.primary.main,
  backgroundImage: "conic-gradient(transparent 0deg 50deg, var(--PulseLoader-ring-color) 50deg 180deg, transparent 180deg 230deg, var(--PulseLoader-ring-color) 230deg 360deg)",
  maskImage: "radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 3px))",
  animation: `${glowRotation} 30s linear infinite reverse, ${ringFade} 2.8s ease-in-out infinite`,
  "&[data-ring=middle]": { inset: "-38%", "--PulseLoader-ring-color": (theme.vars ?? theme).palette.primary.light,
    animation: `${glowRotation} 15s linear infinite, ${ringFade} 2.8s 0.35s ease-in-out infinite` },
  "&[data-ring=inner]": { inset: "-22%", "--PulseLoader-ring-color": (theme.vars ?? theme).palette.primary.main,
    backgroundImage: "none", maskImage: "none",
    animation: `${ringFade} 2.8s 0.7s ease-in-out infinite`,
    "& svg": { width: "100%", height: "100%", overflow: "visible" },
    "& [data-gap]": { transformOrigin: "70px 70px" },
    "& [data-gap=horizontal]": { animation: `${glowRotation} 3.5s linear infinite reverse` },
    "& [data-gap=vertical]": { animation: `${glowRotation} 8s linear infinite` },
  },
}));
// Adapted from xXJollyHAKERXx's Uiverse glow spinner (MIT).
export const OuterGlow = styled("span", slot("OuterGlow"))(({ theme }) => ({
  position: "absolute", inset: "-47%", borderRadius: "50%", pointerEvents: "none",
  animation: `${glowRotation} 1.7s linear infinite`,
  boxShadow: `0 -5px 20px ${(theme.vars ?? theme).palette.primary.main}, 0 5px 20px ${(theme.vars ?? theme).palette.error.main}`,
  "&::before": {
    content: '""', position: "absolute", inset: 0, borderRadius: "inherit",
    backgroundImage: `linear-gradient(${(theme.vars ?? theme).palette.primary.main} 35%, ${(theme.vars ?? theme).palette.error.main})`,
    maskImage: "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 3px))",
    filter: "blur(1px)",
  },
}));
export const Glow = styled("span", slot("Glow"))(({ theme }) => ({
  position: "absolute", inset: "-3%", borderRadius: "50%", pointerEvents: "none",
  backgroundImage: `linear-gradient(${(theme.vars ?? theme).palette.primary.main} 35%, ${(theme.vars ?? theme).palette.error.main})`,
  boxShadow: `0 -5px 20px ${(theme.vars ?? theme).palette.primary.main}, 0 5px 20px ${(theme.vars ?? theme).palette.error.main}`,
  filter: "blur(1px)", animation: `${glowRotation} 1.7s linear infinite`,
}));
export const Avatar = styled(AvatarContainer, slot("Avatar"))({
  width: "100%", margin: 0, zIndex: 1,
  "&[data-soft-glow=true]": { boxShadow: "0 0 20px 10px color-mix(in srgb, var(--PulseLoader-accent) 30%, transparent)" },
  '& [class*="RazethAvatarFrame-content"]::before': { display: "none" },
  "& .MuiAvatar-img": { padding: "8%", boxSizing: "border-box" },
});
export const Pulse = styled("span", slot("Pulse"))(({ theme }) => ({
  position: "absolute", inset: 0, borderRadius: "50%", pointerEvents: "none", zIndex: 2,
  border: "1px solid var(--PulseLoader-accent)",
  animation: `${pulse} 2s ease-out infinite`,
}));
export const Progress = styled("div", slot("Progress"))(({ theme }) => ({
  position: "absolute", inset: `calc(${GLOW_INSET} - ${theme.spacing(1.5)})`,
  pointerEvents: "none", zIndex: 3,
}));
export const Orbit = styled("span", slot("Orbit"))({
  position: "absolute", inset: 0,
  animation: `${orbit} 1.8s ease-in-out infinite`,
  ...Object.fromEntries(Array.from({ length: 7 }, (_, index) => [
    `&:nth-child(${index + 1})`, { animationDelay: `${index * 0.1}s`, opacity: 1 - (0.8 * index) / 6 },
  ])),
  "&::after": {
    content: '""', position: "absolute", top: 0, left: "50%",
    transform: "translate(-50%, -50%)", width: "clamp(8px, 1.6vmin, 13px)", aspectRatio: "1", borderRadius: "50%",
    backgroundColor: "var(--PulseLoader-accent)", boxShadow: "0 0 20px 2px var(--PulseLoader-accent)",
  },
});
export const Message = styled(Typography, slot("Message"))(({ theme }) => ({
  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 4,
  fontFamily: theme.typography.fontFamily, fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", textAlign: "center",
  margin: 0, width: "max-content", maxWidth: "min(80vw, 320px)",
  WebkitTextStroke: `0.125px ${(theme.vars ?? theme).palette.common.black}`,
  "&::before": { content: '""', position: "absolute", inset: 0, zIndex: -1,
    backgroundColor: "rgba(140, 35, 35, 0.4)", borderRadius: "inherit" },
  padding: theme.spacing(0.5, 1.5), borderRadius: "50px",
  boxShadow: `${(theme.vars ?? theme).palette.customShadows?.neumorphic ?? "-4px -4px 10px rgba(255,255,255,0.08), 4px 4px 10px rgba(0,0,0,0.35)"}, inset 0 1px 0 rgba(255,255,255,0.08)`,
  color: "#edad54",
  textShadow: `
    -0.5px -0.5px 0 ${theme.custom?.sideImage?.captionOutlineColor ?? theme.palette.common.black},
    0.5px -0.5px 0 ${theme.custom?.sideImage?.captionOutlineColor ?? theme.palette.common.black},
    -0.5px 0.5px 0 ${theme.custom?.sideImage?.captionOutlineColor ?? theme.palette.common.black},
    0.5px 0.5px 0 ${theme.custom?.sideImage?.captionOutlineColor ?? theme.palette.common.black},
    0 0 7px ${theme.custom?.sideImage?.captionGlowColor ?? "#edad54"}`,
}));
