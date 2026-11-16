"use client";

import { navigationSlot } from "./slots";
import { Container, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { shimmerText } from "@/theme/keyframes";
import { MOBILE_HEADER_HEIGHT, MOBILE_COMPACT_HEIGHT, DESKTOP_COMPACT_HEIGHT, HEADER_GOLD_GRADIENT } from "./constants";
export const AppBar = styled(MuiAppBar, {
  ...navigationSlot("RazethDrawer", "AppBar"),
  shouldForwardProp: prop => prop !== "open"
})<MuiAppBarProps>(({
  theme
}) => ({
  "&[data-header-measuring], &[data-header-measuring] *": {
    transition: "none !important"
  },
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  justifyContent: "center",
  boxShadow: "none",
  borderBottom: `${theme.spacing(0.25)} solid transparent`,
  borderImage: `${HEADER_GOLD_GRADIENT} 1`
}));
export const AppBarContainer = styled(Container, navigationSlot("RazethDrawer", "AppBarContainer"))(({
  theme
}) => ({
  position: "relative",
  zIndex: 10,
  padding: 0,
  [theme.breakpoints.up("xs")]: {
    padding: 0
  }
}));
export const ProfileToolBar = styled(Toolbar, navigationSlot("RazethDrawer", "Toolbar"))(({
  theme
}) => ({
  padding: `${theme.spacing(0.5)} 0`,
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  maxHeight: 180,
  [theme.breakpoints.down("md")]: {
    height: MOBILE_HEADER_HEIGHT,
    minHeight: MOBILE_HEADER_HEIGHT,
    padding: 0,
    gap: theme.spacing(1)
  },
  '[data-mobile-scrolled="true"] &&': {
    height: MOBILE_COMPACT_HEIGHT,
    minHeight: MOBILE_COMPACT_HEIGHT
  },
  transition: theme.transitions.create(["height", "min-height", "max-height", "opacity", "padding"], {
    duration: 220
  }),
  '[data-desktop-compact="true"] &&': {
    maxHeight: 0,
    minHeight: 0,
    padding: 0,
    opacity: 0,
    visibility: "hidden",
    overflow: "hidden"
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none"
  }
}));
export const LogoSection = styled(Box, navigationSlot("RazethDrawer", "LogoSection"))(({
  theme
}) => ({
  display: "flex",
  alignItems: "center",
  alignContent: "middle",
  "& [data-mobile-brand]": {
    display: "none"
  },
  [theme.breakpoints.down("md")]: {
    minWidth: 0,
    flex: 1,
    gap: theme.spacing(1),
    '& > .MuiIconButton-root': {
      display: "none"
    },
    "& [data-mobile-brand]": {
      display: "inline-grid",
      width: 80,
      height: 80,
      margin: 0,
      flexShrink: 0
    }
  },
  '[data-mobile-scrolled="true"] && [data-mobile-brand]': {
    width: 52,
    height: 52
  }
}));
export const LogoCaption = styled(Box, navigationSlot("RazethDrawer", "Caption"))(({
  theme
}) => ({
  [theme.breakpoints.down("md")]: {
    gridColumn: 2,
    minWidth: 0,
    width: "100%",
    textAlign: "center",
    "&& h6": {
      fontSize: "clamp(0.7rem, 3vw, 0.9rem)",
      lineHeight: 1.8,
      padding: 0,
      letterSpacing: 0
    },
    "&& h5": {
      display: "block",
      fontSize: "2rem",
      lineHeight: 0.6,
      marginBlock: theme.spacing(0.5)
    },
    "&& .MuiTypography-subtitle1": {
      fontSize: "0.625rem",
      lineHeight: 1.6,
      whiteSpace: "nowrap"
    }
  },
  '[data-mobile-scrolled="true"] && h5': {
    display: "none"
  },
  textAlign: "center",
  position: "relative",
  display: "inline-block",
  zIndex: 1,
  background: "linear-gradient(90deg, #edad54 45%, #ffffff 55%, #edad54 60%)",
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animation: `${shimmerText} 10s linear infinite`,
  filter: `
    drop-shadow(-0.125px -0.125px 0 ${theme.alpha(theme.vars.palette.common.black, 0.375)})
    drop-shadow(0.125px -0.125px 0 ${theme.alpha(theme.vars.palette.common.black, 0.375)})
    drop-shadow(-0.125px 0.125px 0 ${theme.alpha(theme.vars.palette.common.black, 0.375)})
    drop-shadow(0.125px 0.125px 0 ${theme.alpha(theme.vars.palette.common.black, 0.375)})
    drop-shadow(0 0 5px ${theme.alpha(theme.vars.palette.text.primary, 0.5)})
  `,
  h6: {
    padding: `${theme.spacing(0.25)} 0`,
    lineHeight: 2.5,
    fontSize: {
      xs: "0.75rem",
      md: "0.925rem"
    },
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  h5: {
    fontFamily: "var(--font-tactieng)",
    fontWeight: "500",
    fontSize: "2.5rem",
    lineHeight: 0.125
  },
  "& .MuiTypography-subtitle1": {
    fontFamily: "var(--font-google)"
  },
  "& *": {
    background: "inherit",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  }
}));
export const StackWrapper = styled(Stack, navigationSlot("RazethDrawer", "StackWrapper"))(({
  theme
}) => ({
  [theme.breakpoints.up("xs")]: {
    display: "none"
  },
  [theme.breakpoints.up("md")]: {
    display: "flex",
    width: "auto"
  },
  '[data-socials-hidden="true"] &&': {
    display: "none"
  },
  button: {
    color: "inherit"
  }
}));
export const MobileMenuButton = styled(IconButton, navigationSlot("RazethDrawer", "MobileMenuButton", "content"))(({
  theme
}) => ({
  display: "none",
  [theme.breakpoints.down("md")]: {
    display: "inline-flex",
    width: 44,
    height: 44,
    flexShrink: 0,
    padding: theme.spacing(1),
    borderRadius: "50%",
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:hover, &:focus-visible": {
      backgroundColor: "transparent",
      boxShadow: "none",
      "& [data-menu-glyph]": {
        filter: "var(--Navigation-menu-stroke) drop-shadow(2px 2px 3px rgb(0 0 0 / 40%)) drop-shadow(-1px -1px 2px rgb(255 255 255 / 30%))"
      }
    },
    "&:active [data-menu-glyph]": {
      filter: "var(--Navigation-menu-stroke) drop-shadow(-1px -1px 1px rgb(0 0 0 / 35%)) drop-shadow(1px 1px 1px rgb(255 255 255 / 25%))"
    },
    "& [data-menu-glyph]": {
      "--Navigation-menu-stroke": `drop-shadow(-0.125px -0.125px 0 ${theme.alpha(theme.vars.palette.common.black, 0.375)}) drop-shadow(0.125px -0.125px 0 ${theme.alpha(theme.vars.palette.common.black, 0.375)}) drop-shadow(-0.125px 0.125px 0 ${theme.alpha(theme.vars.palette.common.black, 0.375)}) drop-shadow(0.125px 0.125px 0 ${theme.alpha(theme.vars.palette.common.black, 0.375)})`,
      display: "block",
      width: 30,
      height: 30,
      flexShrink: 0,
      filter: "var(--Navigation-menu-stroke) drop-shadow(1.5px 1.5px 2px rgb(0 0 0 / 35%)) drop-shadow(-1px -1px 1px rgb(255 255 255 / 25%))",
      "&::before": {
        content: '""',
        display: "block",
        width: "100%",
        height: "100%",
        backgroundColor: "#edad54",
        mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z'/%3E%3C/svg%3E") center / contain no-repeat`
      },
      "@media (prefers-reduced-motion: reduce)": {
        animation: "none"
      }
    }
  }
}));
export const DesktopToolbar = styled(Toolbar, navigationSlot("RazethDrawer", "DesktopToolbar"))(({
  theme
}) => ({
  [theme.breakpoints.up("xs")]: {
    display: "none"
  },
  [theme.breakpoints.up("md")]: {
    display: "flex",
    paddingLeft: 0,
    '[data-desktop-compact="true"] &&': {
      paddingLeft: 0,
      height: DESKTOP_COMPACT_HEIGHT,
      minHeight: DESKTOP_COMPACT_HEIGHT
    }
  }
}));
export const CompactLogoButton = styled(IconButton, navigationSlot("RazethDrawer", "CompactLogoButton", "content"))({
  display: "none",
  width: DESKTOP_COMPACT_HEIGHT,
  height: DESKTOP_COMPACT_HEIGHT,
  marginRight: 8,
  padding: 8,
  flexShrink: 0,
  '[data-desktop-compact="true"] &&': {
    display: "inline-flex"
  },
  "& > div": {
    width: "5rem",
    height: "5rem",
    margin: 0
  }
});
export const NavMenuButton = styled(IconButton, {
  ...navigationSlot("RazethDrawer", "NavMenuButton", "content"),
  shouldForwardProp: prop => prop !== "visible" && prop !== "variant"
})<{
  variant?: "main" | "side";
  visible?: boolean;
}>(({
  theme,
  variant = "main",
  visible = true
}) => ({
  alignSelf: "stretch",
  height: "fill-available",
  width: variant === "main" ? "fit-content" : "stretch",
  padding: 0,
  opacity: visible === true ? 1 : 0,
  [theme.breakpoints.down("md")]: {
    width: variant === "main" ? "6rem" : "stretch",
    flexShrink: 0
  }
}));
