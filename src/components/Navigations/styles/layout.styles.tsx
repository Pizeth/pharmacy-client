"use client";

import { navigationSlot } from "./slots";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { MOBILE_HEADER_HEIGHT, drawerWidth } from "./constants";

// Adapted from PatternCraft's Paper Texture and Blue Radial Glow.
// https://github.com/megh-bari/pattern-craft/blob/main/src/data/patterns.ts
const paperTexture = (ink: string) =>
  `radial-gradient(circle at 1px 1px, rgb(${ink} / 8%) 1px, transparent 0) 0 0 / 8px 8px,
   repeating-linear-gradient(0deg, transparent 0 2px, rgb(${ink} / 2%) 2px 4px) 0 0 / 32px 32px,
   repeating-linear-gradient(90deg, transparent 0 2px, rgb(${ink} / 2%) 2px 4px) 0 0 / 32px 32px`;

const blueRadialGlow =
  "radial-gradient(circle 600px at center, rgb(59 130 246 / 30%), transparent) center / cover no-repeat fixed #0f172a";
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
  background: `${paperTexture("0 0 0")}, ${backgroundColor ?? "transparent"}`,
  ...theme.applyStyles("dark", {
    background: `${paperTexture("255 255 255")}, ${blueRadialGlow}`,
  }),
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
