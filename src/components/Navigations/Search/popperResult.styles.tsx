"use client";

import { navigationSlot } from "../styles/slots";
import { List, Paper as MuiPaper, Popper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
export const Root = styled(Popper, {
  ...navigationSlot("RazethSearchPoppers", "Root"),
  shouldForwardProp: prop => prop !== "width"
})<{
  width: number | string | undefined;
}>(({
  theme,
  width
}) => ({
  width: width,
  zIndex: 1300
}));
export const Empty = styled(Typography, navigationSlot("RazethSearchPoppers", "Empty"))(({
  theme
}) => ({
  padding: theme.spacing(1.25)
}));
export const Paper = styled(MuiPaper, navigationSlot("RazethSearchPoppers", "Paper"))(({
  theme
}) => ({
  marginTop: theme.spacing(1),
  borderRadius: "5px",
  overflow: "hidden",
  backgroundColor: theme.alpha(theme.vars.palette.background.paper, 0.75),
  backdropFilter: "blur(0.125rem)",
  border: `1px solid ${theme.alpha(theme.vars.palette.text.primary, 0.125)}`
}));
export const ErrorBox = styled(Box, navigationSlot("RazethSearchPoppers", "ErrorBox"))(({
  theme
}) => ({
  padding: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  color: theme.palette.error.main,
  svg: {
    marginRight: theme.spacing(0.5)
  }
}));
export const ScrollableList = styled(List, navigationSlot("RazethSearchPoppers", "ScrollableList"))(({
  theme
}) => ({
  padding: theme.spacing(0),
  maxHeight: "50vmin",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "6px"
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.alpha(theme.vars.palette.text.primary, 0.1),
    borderRadius: "10px"
  },
  "& .MuiButtonBase-root": {
    padding: theme.spacing(0),
    "& .MuiListItemText-root": {
      margin: theme.spacing(0.5, 1, 1, 1)
    }
  }
}));
