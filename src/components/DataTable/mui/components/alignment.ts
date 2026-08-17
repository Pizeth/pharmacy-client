import type { TableCellProps } from "@mui/material";

import type { MuiDataTableAlignment } from "../meta";

/**
 * Convert our logical DataTable alignment metadata to the physical
 * alignment values accepted by MUI TableCell.
 *
 * `start` and `end` remain logical at the metadata layer so they can
 * later participate correctly in RTL handling.
 *
 * MUI's `align` prop itself uses physical values, so for now:
 *
 * start -> left
 * end   -> right
 *
 * Phase 1.5.3 will make sticky positioning and RTL mapping theme-aware.
 */
export function resolveTableCellAlignment(
  alignment: MuiDataTableAlignment | undefined,
): TableCellProps["align"] {
  switch (alignment) {
    case "center":
      return "center";

    case "end":
      return "right";

    case "start":
    default:
      return "left";
  }
}
