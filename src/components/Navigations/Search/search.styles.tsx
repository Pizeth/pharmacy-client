"use client";

import { navigationSlot } from "../styles/slots";
import { FormControl, styled, IconButton, Box } from "@mui/material";
export const Root = styled(Box, navigationSlot("RazethSearch", "Root"))(({
  theme
}) => ({
  padding: theme.spacing(1),
  display: "flex",
  justifyContent: "center",
  background: `${theme.alpha(theme.vars.palette.background.paper, 0.925)}`
}));
export const FormInput = styled(FormControl, navigationSlot("RazethSearch", "Wrapper"))(({
  theme
}) => ({
  transition: "transform 0.2s ease-in-out",
  "&:focus-within": {
    transform: "scale(1.025)"
  },
  margin: theme.spacing(0),
  width: "fill-available",
  maxWidth: "50ch"
}));
export const ActionButton = styled(IconButton, navigationSlot("RazethSearch", "ActionButton"))(({
  theme
}) => ({
  padding: theme.spacing(0),
  "&:hover": {
    color: theme.palette.primary.main
  }
}));
