import { alpha, type Theme } from "@mui/material/styles";

/** The same tinted pill surface is used by roles, statuses and record metadata. */
export function resourceBadgeStyles(theme: Theme, main?: string) {
  const palette = (theme.vars ?? theme).palette;
  const tint = (color: string, opacity: number) => theme.alpha ? theme.alpha(color, opacity) : alpha(color, opacity);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: theme.spacing(0.5), maxWidth: "100%",
    minHeight: 20, boxSizing: "border-box" as const, fontSize: "0.6875rem", fontWeight: 700, lineHeight: 1.5,
    padding: "1px 6px", borderRadius: 999, fontFamily: "monospace", boxShadow: "none",
    "& svg": { width: 14, height: 14, flexShrink: 0, color: "inherit" },
    '&[data-icon-only="true"]': { width: 20, height: 20, minHeight: 20, padding: 0, borderRadius: "50%", justifyContent: "center", flexShrink: 0 },
  };
  if (!main) return { ...base, color: palette.text.secondary, backgroundColor: tint(palette.text.primary, 0.08), border: `1px solid ${tint(palette.text.primary, 0.2)}` };
  return { ...base, color: `color-mix(in srgb, ${main} 60%, black)`, backgroundColor: tint(main, 0.12), border: `1px solid ${tint(main, 0.4)}`, ...theme.applyStyles("dark", { color: `color-mix(in srgb, ${main} 60%, white)` }) };
}
