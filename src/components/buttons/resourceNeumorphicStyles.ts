import type { CSSObject, Theme } from "@mui/material/styles";

export function resourceNeumorphicStyles(theme: Theme): CSSObject {
  return {
    borderRadius: 999, minHeight: 36, padding: theme.spacing(0.75, 1.75), justifySelf: "start",
    backgroundImage: "none",
    '&.MuiButton-colorError:not(.MuiButton-contained)': { color: (theme.vars ?? theme).palette.error.main },
    '&.MuiButton-colorPrimary:not(.MuiButton-contained)': { color: (theme.vars ?? theme).palette.primary.main },
    boxShadow: (theme.vars ?? theme).palette.customShadows?.neumorphic ?? theme.shadows[2],
    transition: theme.transitions.create(["box-shadow", "background-color"]),
    '&:not(.MuiButton-contained)': {
      backgroundColor: "color-mix(in srgb, currentColor 7.5%, transparent)",
      borderColor: "transparent",
    },
    '&:hover:not(.Mui-disabled), &.Mui-focusVisible': {
      boxShadow: (theme.vars ?? theme).palette.customShadows?.inset ?? "inset 2px 2px 5px rgb(0 0 0 / 20%)",
      '&:not(.MuiButton-contained)': { backgroundColor: "color-mix(in srgb, currentColor 12.5%, transparent)" },
    },
    '&:focus-visible': { outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`, outlineOffset: 3 },
    '@media (prefers-reduced-motion: reduce)': { transition: "none" },
    '&.Mui-disabled': { boxShadow: "none" },
  };
}
