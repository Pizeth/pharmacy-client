"use client";

import { navigationSlot } from "./slots";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { paperTexture } from "@/theme/paperTexture";
import { MOBILE_HEADER_HEIGHT, drawerWidth } from "./constants";

// Adapted from PatternCraft's Blue Corner Glow and Blue Radial Glow.
// https://github.com/megh-bari/pattern-craft/blob/main/src/data/patterns.ts
const blueRadialGlow =
  "radial-gradient(circle 600px at center, rgb(59 130 246 / 30%), transparent) center / cover no-repeat fixed #0f172a";

const blueCornerGlow = `
  radial-gradient(circle 600px at left 200px, #bfdbfe, transparent) no-repeat,
  radial-gradient(circle 600px at right 200px, #bfdbfe, transparent) no-repeat #fff
`;
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
  backgroundColor,
  background: `${paperTexture("0 0 0")}, ${backgroundColor ?? blueCornerGlow}`,
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
