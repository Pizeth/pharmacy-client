"use client";

import { navigationSlot } from "./slots";
import { Backdrop, BackdropProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer, { DrawerProps } from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { filt, wee } from "@/theme/keyframes";
import AvatarContainer from "@/components/Avatar/AvatarContainer";
import { MOBILE_HEADER_HEIGHT, MOBILE_COMPACT_HEIGHT, DESKTOP_COMPACT_HEIGHT, drawerWidth } from "./constants";
export const Drawer = styled(MuiDrawer, navigationSlot("RazethDrawer", "Drawer"))<DrawerProps>(({
  theme
}) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    "@supports (height: 100dvh)": {
      height: "100dvh"
    },
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
    overflowY: "auto",
    overscrollBehaviorY: "contain",
    "& > *": {
      flexShrink: 0
    },
    backgroundColor: theme.vars.palette.background.paper,
    backgroundImage: `
      linear-gradient(135deg,
      ${theme.alpha(theme.vars.palette.primary.main, 0.1)},
      ${theme.alpha(theme.vars.palette.secondary.main, 0.1)})
    `
  },
  "& .MuiModal-root": {
    zIndex: theme.zIndex.drawer
  },
  [theme.breakpoints.up("sm")]: {
    display: "none"
  },
  [theme.breakpoints.up("xs")]: {
    display: "block"
  }
}));
export const DrawerHeader = styled("div", navigationSlot("RazethDrawer", "DrawerHeader", "content"))(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  alignSelf: "stretch",
  padding: 0,
  height: `calc(var(--Navigation-expanded-height, ${DESKTOP_COMPACT_HEIGHT}) - ${theme.spacing(0.25)})`,
  minHeight: `calc(var(--Navigation-expanded-height, ${DESKTOP_COMPACT_HEIGHT}) - ${theme.spacing(0.25)})`,
  '&[data-desktop-compact="true"]': {
    height: DESKTOP_COMPACT_HEIGHT,
    minHeight: DESKTOP_COMPACT_HEIGHT
  },
  flexShrink: 0,
  transition: theme.transitions.create(["height", "min-height"], {
    duration: 220
  }),
  [theme.breakpoints.down("md")]: {
    height: MOBILE_HEADER_HEIGHT,
    minHeight: MOBILE_HEADER_HEIGHT,
    '&[data-mobile-scrolled="true"]': {
      height: MOBILE_COMPACT_HEIGHT,
      minHeight: MOBILE_COMPACT_HEIGHT
    },
    "& [data-drawer-logo]": {
      width: 80,
      height: 80,
      margin: 0
    },
    '&[data-mobile-scrolled="true"] [data-drawer-logo]': {
      width: 52,
      height: 52
    }
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none"
  },
  justifyContent: "center"
}));
export const TransparentBackdrop = styled(Backdrop, navigationSlot("RazethDrawer", "Backdrop"))<BackdropProps>(({
  theme
}) => ({
  backgroundColor: "rgba(0, 0, 0, 0)",
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.standard
  }),
  zIndex: -1,
  WebkitTapHighlightColor: "transparent"
}));
export const HamBurgerNav = styled(Box, navigationSlot("RazethDrawer", "HamburgerNav"))(({
  theme
}) => ({
  mr: 1,
  position: "relative",
  width: "100%",
  height: "fill-available",
  justifyContent: "center",
  justifyItems: "center",
  alignContent: "center",
  alignItems: "center",
  [theme.breakpoints.up("xs")]: {
    display: "flex"
  },
  [theme.breakpoints.up("md")]: {
    display: "flex"
  },
  "&::before": {
    content: "''",
    position: "absolute",
    inset: 0,
    "--c": "7px",
    backgroundColor: "#000",
    backgroundImage: `
                radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
                radial-gradient(circle at 50% 50%, #0000 1.5px, #000 0 var(--c), #0000 var(--c)),
                radial-gradient(circle at 50% 50%, #f00, #f000 60%),
                radial-gradient(circle at 50% 50%, #ff0, #ff00 60%),
                radial-gradient(circle at 50% 50%, #0f0, #0f00 60%),
                radial-gradient(ellipse at 50% 50%, #00f, #00f0 60%)
              `,
    backgroundSize: `
                12px 20.7846097px,
                12px 20.7846097px,
                200% 200%,
                200% 200%,
                200% 200%,
                200% 20.7846097px
              `,
    "--p": "0px 0px, 6px 10.39230485px",
    backgroundPosition: `
                var(--p),
                0% 0%,
                0% 0%,
                0% 0px
              `,
    animation: `${wee} 40s linear infinite, ${filt} 6s linear infinite`,
    zIndex: 0
  }
}));
export const DrawerDivider = styled(Divider, navigationSlot("RazethNavigationLayout", "HeaderDivider"))(({
  theme
}) => ({
  height: theme.spacing(0.25),
  border: 0,
  margin: 0,
  backgroundImage: "linear-gradient(270deg, #F0C54C, #EDAC4C 50%, #EA9548)",
  backgroundColor: "transparent",
  opacity: 1
}));
export const DrawerThemeRow = styled("div", navigationSlot("RazethDrawerTheme", "Root"))(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  marginBottom: theme.spacing(1.5),
  color: theme.vars.palette.text.primary
}));
export const DrawerThemeLabel = styled(Typography, navigationSlot("RazethDrawerTheme", "Label"))(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& > svg": {
    color: theme.vars.palette.text.secondary
  }
}));
export const AccountButton = styled(ListItemButton, navigationSlot("RazethDrawer", "AccountButton"))(({
  theme
}) => ({
  borderRadius: typeof theme.shape.borderRadius === "number" ? theme.shape.borderRadius * 2 : `calc(${theme.shape.borderRadius} * 2)`,
  paddingInline: theme.spacing(1.5),
  backgroundColor: theme.vars.palette.background.paper,
  boxShadow: theme.vars.palette.customShadows.neumorphic,
  "& [data-account-gear]": {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    padding: theme.spacing(0.75),
    boxSizing: "border-box",
    flexShrink: 0,
    marginRight: theme.spacing(0.5),
    borderRadius: "50%",
    color: theme.alpha(theme.vars.palette.text.primary, 0.4),
    backgroundColor: theme.vars.palette.background.paper,
    boxShadow: theme.vars.palette.customShadows.neumorphic,
    transition: theme.transitions.create("box-shadow")
  },
  "&:hover [data-account-gear], &:focus-visible [data-account-gear]": {
    boxShadow: theme.vars.palette.customShadows.inset
  },
  "&:hover": {
    backgroundColor: theme.vars.palette.background.paper,
    boxShadow: theme.vars.palette.customShadows.inset
  }
}));
export const AccountAvatar = styled(AvatarContainer, navigationSlot("RazethDrawer", "AccountAvatar"))(({
  theme
}) => ({
  width: theme.spacing(6.25),
  margin: theme.spacing(0, 1, 0, 0),
  "& .MuiAvatar-root > .MuiSvgIcon-root": {
    fontSize: theme.spacing(3)
  }
}));
