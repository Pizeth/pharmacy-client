"use client";
import { styled } from "@mui/material/styles";
import { formActionsStyles } from "./formActionsStyles";

/** Put Cancel first and the primary action last in DOM order. */
export const FormActions = styled("div", {
  name: "RazethFormActions",
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => formActionsStyles(theme));
