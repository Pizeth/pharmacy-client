import type { CSSObject, Theme } from "@mui/material/styles";

export const ROW_ACTION_BUTTON_SIZE = 28;
// Four buttons, three gaps, and both levels of padding need 148px at 8px spacing.
export const STANDARD_ROW_ACTION_COLUMN_SIZE = 150;
export const ROW_ACTION_CELL_PADDING = 1;
export const ROW_ACTION_CARD_PADDING = [1.5, 2] as const;

/** Shared control geometry for table cells and responsive card footers. */
export function getRowActionGroupStyles(theme: Theme): CSSObject {
  return {
    width: "max-content",
    maxWidth: "100%",
    boxSizing: "border-box",
    marginInline: "auto",
    padding: theme.spacing(0.5),
    minWidth: 0,
    gap: theme.spacing(0.5),
  };
}
