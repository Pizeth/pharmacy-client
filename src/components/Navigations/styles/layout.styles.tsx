"use client";

import { navigationSlot } from "./slots";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { MOBILE_HEADER_HEIGHT, drawerWidth } from "./constants";
export const Root = styled(Box, navigationSlot("RazethDrawer", "Root"))({
  display: "flex"
});
export const Main = styled("main", {
  ...navigationSlot("RazethNavigationLayout", "Main"),
  shouldForwardProp: prop => !["open", "path", "backgroundColor"].includes(prop as string)
})<{
  open?: boolean;
  backgroundColor?: string;
}>(({
  theme,
  open,
  backgroundColor
}) => ({
  flexGrow: 1,
  minWidth: 0,
  background: backgroundColor ?? "transparent",
  marginTop: 0,
  paddingTop: `var(--Navigation-expanded-height, ${MOBILE_HEADER_HEIGHT}px)`,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth})`,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      width: "100%"
    },
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));
