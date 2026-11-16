"use client";

import { Paper, Popover, Divider, MenuItem as MuiMenuItem } from "@mui/material";
import { motion } from "framer-motion";
import { navigationSlot } from "../styles/slots";
import { Box, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
export const MenuPopover = styled(Popover, navigationSlot("RazethUserSetting", "Popover"))(({
  theme
}) => ({
  "& .MuiPopover-paper": {
    marginTop: theme.spacing(1.5),
    width: "clamp(150px, 80%, 250px)",
    borderRadius: "15px",
    overflowY: "auto",
    background: "transparent",
    boxShadow: "none",
    border: "none"
  }
}));
export const MenuSurface = styled(Paper, navigationSlot("RazethUserSetting", "Surface"))(({
  theme
}) => ({
  borderRadius: "25px",
  overflow: "hidden",
  border: `1px solid ${theme.alpha(theme.vars.palette.divider, 0.1)}`,
  position: "relative",
  backgroundColor: theme.alpha(theme.vars.palette.background.paper, 0.7),
  backdropFilter: "blur(20px) saturate(180%)",
  boxShadow: `0 8px 32px 0 ${theme.alpha(theme.vars.palette.common.black, 0.25)}`
}));
export const Content = styled("div", navigationSlot("RazethUserSetting", "Content"))({
  position: "relative",
  zIndex: 1
});
export const AccentBar = styled("div", navigationSlot("RazethUserSetting", "AccentBar"))(({
  theme
}) => ({
  width: "75%",
  height: "0.35rem",
  background: `linear-gradient(315deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.error.main})`,
  margin: "auto",
  borderRadius: "0 0 25px 25px"
}));
export const MenuDivider = styled(Divider, navigationSlot("RazethUserSetting", "Divider"))(({
  theme
}) => ({
  borderStyle: "dashed",
  borderColor: theme.alpha(theme.vars.palette.text.primary, 0.255)
}));
export const MenuList = styled(motion.div, navigationSlot("RazethUserSetting", "List"))(({
  theme
}) => ({
  padding: theme.spacing(1)
}));
export const Footer = styled("div", navigationSlot("RazethUserSetting", "Footer"))(({
  theme
}) => ({
  padding: theme.spacing(1),
  paddingBottom: theme.spacing(1.5)
}));
export const Action = styled(MuiMenuItem, navigationSlot("RazethUserSetting", "Action"))(({
  theme
}) => ({
  borderRadius: "15px",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(1, 1.5),
  position: "relative",
  overflow: "hidden",
  transition: theme.transitions.create("all", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  "&:last-child": {
    marginBottom: 0
  },
  "& .MuiListItemIcon-root": {
    minWidth: "38px !important",
    transition: "color 0.25s ease"
  },
  "&:hover": {
    backgroundColor: theme.alpha(theme.vars.palette.primary.main, 0.04),
    transform: "translateX(4px)",
    "& .MuiListItemIcon-root, & .MuiTypography-root": {
      color: theme.vars.palette.primary.main
    }
  },
  "& .MuiTouchRipple-child": {
    backgroundColor: theme.vars.palette.primary.main
  },
  "& .MuiTouchRipple-rippleVisible": {
    opacity: 0.3
  }
}));
export const PublicAction = styled(MenuItem, navigationSlot("RazethUserSetting", "PublicAction"))(({
  theme
}) => ({
  borderRadius: "15px",
  padding: theme.spacing(1, 1.5),
  "& .MuiListItemIcon-root": {
    minWidth: 38
  },
  "&:hover": {
    backgroundColor: theme.alpha((theme.vars ?? theme).palette.primary.main, 0.04)
  },
  "&[data-auth-action]": {
    borderRadius: "50px",
    backgroundColor: theme.alpha((theme.vars ?? theme).palette.primary.main, 0.075),
    color: (theme.vars ?? theme).palette.primary.main,
    boxShadow: (theme.vars ?? theme).palette.customShadows.neumorphic,
    transition: theme.transitions.create(["box-shadow", "background-color"]),
    "&:hover, &.Mui-focusVisible": {
      backgroundColor: theme.alpha((theme.vars ?? theme).palette.primary.main, 0.125),
      boxShadow: (theme.vars ?? theme).palette.customShadows.inset
    },
    "&.Mui-disabled": {
      boxShadow: "none"
    }
  }
}));
export const Header = styled(Box, navigationSlot("RazethUserSetting", "Header"))(({
  theme
}) => ({
  padding: theme.spacing(2.5, 0)
}));
export const Wrapper = styled(Box, navigationSlot("RazethUserSetting", "Wrapper"))(({
  theme
}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  "& > :first-child": {
    marginBottom: theme.spacing(1.5)
  },
  "& .MuiTypography-root": {
    svg: {
      marginLeft: theme.spacing(0.25)
    }
  }
}));
