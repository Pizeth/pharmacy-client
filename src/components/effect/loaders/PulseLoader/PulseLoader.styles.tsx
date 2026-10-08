"use client";
import { Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import type { CSSInterpolation } from "@mui/material/styles";
import AvatarContainer from "@/components/Avatar/AvatarContainer";

export type PulseLoaderSlot = "root" | "emblem" | "glow" | "avatar" | "pulse" | "progress" | "orbit" | "message";
const slot = (name: Capitalize<PulseLoaderSlot>) => ({
  name: "RazethLoader", slot: name,
  overridesResolver: (_props: unknown, styles: Record<string, CSSInterpolation>) => styles[name.charAt(0).toLowerCase() + name.slice(1)],
});
const pulse = keyframes({ from: { opacity: 0.45, transform: "scale(1)" }, to: { opacity: 0, transform: "scale(1.45)" } });
// Adapted from krlozCJ's Uiverse orbit loader (MIT); see THIRD_PARTY_LICENSES.md.
const orbit = keyframes({ "0%": { transform: "rotate(0deg)" }, "80%, 100%": { transform: "rotate(360deg)" } });
const glowRotation = keyframes({ to: { transform: "rotate(360deg)" } });
const textShimmer = keyframes({ to: { backgroundPosition: "200% center" } });
export const Root = styled("div", slot("Root"))(({ theme }) => ({
  position: "fixed", inset: 0, zIndex: theme.zIndex.modal + 1,
  "--PulseLoader-accent": "#ff0000",
  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
  gap: theme.spacing(4), padding: theme.spacing(3),
  backgroundColor: theme.alpha((theme.vars ?? theme).palette.background.default, 0.92),
  color: (theme.vars ?? theme).palette.text.primary,
  backdropFilter: "blur(20px) saturate(175%)",
  "@media (prefers-reduced-motion: reduce)": {
    "& *, & *::before, & *::after": { animation: "none !important", transition: "none !important" },
  },
}));
export const Emblem = styled("div", slot("Emblem"))({ position: "relative", width: "clamp(100px, 20vmin, 160px)", aspectRatio: "1", display: "grid", placeItems: "center" });
// Adapted from xXJollyHAKERXx's Uiverse glow spinner (MIT).
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
  position: "absolute", inset: `calc(-10% - ${theme.spacing(1.5)})`,
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
    transform: "translate(-50%, -50%)", width: "7%", aspectRatio: "1", borderRadius: "50%",
    backgroundColor: "var(--PulseLoader-accent)", boxShadow: "0 0 20px 2px var(--PulseLoader-accent)",
  },
});
export const Message = styled(Typography, slot("Message"))(({ theme }) => ({
  ...theme.typography.body1, fontWeight: 600, textAlign: "center",
  marginTop: theme.spacing(0.5),
  color: (theme.vars ?? theme).palette.primary.main,
  backgroundImage: `linear-gradient(90deg, ${(theme.vars ?? theme).palette.primary.main}, ${(theme.vars ?? theme).palette.error.main}, ${(theme.vars ?? theme).palette.primary.main})`,
  backgroundSize: "200% auto", backgroundClip: "text", WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent", animation: `${textShimmer} 3s linear infinite`,
  filter: `drop-shadow(0 0 6px ${theme.alpha((theme.vars ?? theme).palette.error.main, 0.3)})`,
}));
