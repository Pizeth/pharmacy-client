import type { CSSObject, Theme } from "@mui/material/styles";

/** HRD breadcrumb presentation shared across application shells. */
export const breadcrumbRootStyles = (theme: Theme): CSSObject => ({ marginTop: theme.spacing(1.5) });
export const breadcrumbTrailStyles = (theme: Theme): CSSObject => ({
  ...theme.typography.body2,
  "& a": { color: "inherit", textDecoration: "none" },
  "& .MuiBreadcrumbs-ol": { rowGap: theme.spacing(0.5), overflowWrap: "anywhere" },
  "& .MuiBreadcrumbs-separator": { marginInline: theme.spacing(0.5) },
});
export const breadcrumbItemStyles = (theme: Theme): CSSObject => ({
  display: "inline-flex", alignItems: "center", gap: theme.spacing(0.75),
  padding: theme.spacing(0.5, 1), borderRadius: theme.shape.borderRadius,
  color: (theme.vars ?? theme).palette.text.secondary,
  transition: theme.transitions.create(["background-color", "box-shadow"]),
  "a &:hover": { backgroundColor: (theme.vars ?? theme).palette.action.hover },
  "a:focus-visible &": { outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`, outlineOffset: 2 },
  '&[aria-current="page"]': {
    color: (theme.vars ?? theme).palette.text.primary,
    backgroundColor: (theme.vars ?? theme).palette.action.selected,
    boxShadow: `inset 0 -2px ${(theme.vars ?? theme).palette.primary.main}`,
  },
});
export const breadcrumbIconStyles = (theme: Theme): CSSObject => ({
  display: "inline-flex", flexShrink: 0,
  "& .MuiSvgIcon-root": { fontSize: theme.typography.pxToRem(18) },
});
export const breadcrumbSeparatorStyles = (theme: Theme): CSSObject => ({
  fontSize: theme.typography.pxToRem(16), color: (theme.vars ?? theme).palette.text.disabled,
});
