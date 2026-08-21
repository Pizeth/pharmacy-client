import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Normalize an optional SxProps value into an array suitable for
 * deterministic MUI sx composition.
 */
export function normalizeDataTableSx(
  sx: SxProps<Theme> | undefined,
): readonly SxProps<Theme>[] {
  if (sx === undefined) {
    return [];
  }

  return Array.isArray(sx) ? sx : [sx];
}
