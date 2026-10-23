"use client";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { keyframes, styled, type CSSInterpolation, type CSSObject, type Theme } from "@mui/material/styles";

export type LoginFeedbackSlot = "root" | "surface" | "progress" | "inlineError";
const slot = (name: Capitalize<LoginFeedbackSlot>) => ({
  name: "RazethLoginFeedback",
  slot: name,
  overridesResolver: (_props: unknown, styles: Record<string, CSSInterpolation>) =>
    styles[name.charAt(0).toLowerCase() + name.slice(1)],
});

const bounce = keyframes({
  "0%": { transform: "translateY(-28px) scale(0.96)" },
  "45%": { transform: "translateY(7px) scale(1.01)" },
  "70%": { transform: "translateY(-3px) scale(1)" },
  "100%": { transform: "translateY(0) scale(1)" },
});
const drain = keyframes({ from: { transform: "scaleX(1)" }, to: { transform: "scaleX(0)" } });

export const ToastRoot = styled(Snackbar, slot("Root"))(({ theme }) => ({
  maxWidth: `min(520px, calc(100vw - ${theme.spacing(4)}))`,
  "&:hover [data-toast-progress], &:focus-within [data-toast-progress]": {
    animationPlayState: "paused",
  },
}));

const glassSurface = (theme: Theme): CSSObject => {
  const palette = theme.vars?.palette ?? theme.palette;
  return {
    "--LoginToast-accent": palette.success.main,
    position: "relative",
    isolation: "isolate",
    overflow: "hidden",
    width: "100%",
    minWidth: 0,
    padding: theme.spacing(1.5, 2),
    borderRadius: `max(${typeof theme.shape.borderRadius === "number" ? `${theme.shape.borderRadius}px` : theme.shape.borderRadius}, ${theme.spacing(2)})`,
    border: "1px solid color-mix(in srgb, var(--LoginToast-accent) 45%, transparent)",
    borderLeft: "3px solid var(--LoginToast-accent)",
    color: palette.text.primary,
    background: `linear-gradient(115deg, color-mix(in srgb, var(--LoginToast-accent) 13%, transparent), transparent 65%), ${theme.alpha(palette.background.paper, 0.72)}`,
    backdropFilter: "blur(22px) saturate(160%)",
    WebkitBackdropFilter: "blur(22px) saturate(160%)",
    boxShadow: `inset 0 1px 0 rgb(255 255 255 / 28%), 0 16px 48px rgb(0 0 0 / 22%), 0 0 24px color-mix(in srgb, var(--LoginToast-accent) 12%, transparent)`,
    "& .MuiAlert-icon": {
      color: "var(--LoginToast-accent)",
      opacity: 1,
      alignItems: "center",
      filter: "drop-shadow(0 0 5px color-mix(in srgb, var(--LoginToast-accent) 30%, transparent))",
    },
    "& .MuiAlert-message": {
      minWidth: 0,
      overflowWrap: "anywhere",
      color: `color-mix(in srgb, var(--LoginToast-accent) 30%, ${palette.text.primary})`,
    },
    "& .MuiAlert-action": { alignItems: "center", paddingTop: 0, color: palette.text.secondary },
    "@media (prefers-reduced-motion: reduce)": { animation: "none !important" },
  };
};

export const ToastSurface = styled(Alert, slot("Surface"))(({ theme }) => ({
  ...glassSurface(theme),
  "--LoginToast-duration": "6000ms",
  "&[data-severity='error']": {
    "--LoginToast-accent": (theme.vars?.palette ?? theme.palette).error.main,
    "--LoginToast-duration": "10000ms",
    animation: `${bounce} 600ms ease-out both`,
  },
}));

export const InlineError = styled(Alert, slot("InlineError"))(({ theme }) => ({
  ...glassSurface(theme),
  "--LoginToast-accent": (theme.vars?.palette ?? theme.palette).error.main,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(-1),
}));

export const ToastProgress = styled("span", slot("Progress"))({
  position: "absolute",
  bottom: 0,
  insetInline: 0,
  height: 2,
  background: "linear-gradient(90deg, var(--LoginToast-accent), color-mix(in srgb, var(--LoginToast-accent) 35%, transparent))",
  transformOrigin: "left",
  animation: `${drain} var(--LoginToast-duration) linear forwards`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});
