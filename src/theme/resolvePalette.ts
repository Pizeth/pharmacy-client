import type { Theme } from "@mui/material/styles";

// Plain MUI themes used outside the application shell may omit CSS variables.
export function resolvePalette(theme: Pick<Theme, "palette"> & Partial<Pick<Theme, "vars">>) {
  return theme.vars?.palette ?? theme.palette;
}
