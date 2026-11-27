"use client";

import { navigationSlot } from "./slots";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { paperTexture } from "@/theme/paperTexture";
import { MOBILE_HEADER_HEIGHT, drawerWidth } from "./constants";

// Adapted from PatternCraft's Aurora Waves and Blue Radial Glow.
// https://github.com/megh-bari/pattern-craft/blob/main/src/data/patterns.ts
const blueRadialGlow =
  "radial-gradient(circle 600px at center, rgb(59 130 246 / 30%), transparent) center / cover no-repeat fixed #0f172a";

const lightAuroraWaves = `
  radial-gradient(ellipse at 50% 45%, rgb(32 196 220 / 18%), transparent 65%) center / cover no-repeat fixed,
  repeating-linear-gradient(90deg, transparent 0 20px, rgb(114 97 206 / 4%) 20px 40px),
  linear-gradient(135deg, #e9e6fa, #edf9fb 54%, #c4e5f7) center / cover no-repeat fixed
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
  background: `${paperTexture("0 0 0")}, ${backgroundColor ?? lightAuroraWaves}`,
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
