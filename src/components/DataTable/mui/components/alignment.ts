import type { TableCellProps } from "@mui/material";
import type { MuiDataTableAlignment } from "../meta";

/** Resolve logical metadata to MUI's physical alignment in the theme direction. */
export function resolveTableCellAlignment(
  alignment: MuiDataTableAlignment | undefined,
  direction: "ltr" | "rtl" = "ltr",
): TableCellProps["align"] {
  if (alignment === "center") return "center";
  if (alignment === "end") return direction === "rtl" ? "left" : "right";
  return direction === "rtl" ? "right" : "left";
}
