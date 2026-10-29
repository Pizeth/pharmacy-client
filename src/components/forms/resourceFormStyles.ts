import type { CSSObject, Theme } from "@mui/material/styles";
/** Consistent field spacing in resource dialogs and their dedicated forms. */
export function resourceFormStyles(theme: Theme): CSSObject {
  return { display: "grid", gap: theme.spacing(2), minWidth: 0, margin: 0, padding: 0,
    '& .MuiFormControl-root': { marginBlock: 0 },
  };
}
