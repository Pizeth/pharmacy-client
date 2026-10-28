import { resourceNeumorphicStyles } from "@/components/buttons/resourceNeumorphicStyles";
import type { Theme } from "@mui/material/styles";
import type { CSSObject } from "@mui/system";

/** i18n's action layout: desktop row, mobile primary action above Cancel. */
export function formActionsStyles(theme: Theme): CSSObject {
  return {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    gap: theme.spacing(1.5),
    "& > .MuiButton-root": { ...resourceNeumorphicStyles(theme), minHeight: 40 },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
      alignItems: "stretch",
      "& > .MuiButton-root": { width: "100%" },
    },
  };
}
