"use client";

import { navigationSlot } from "../styles/slots";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { colorItemMixin, resolveColor } from "@/utils/themeUtils";
import { Box, ButtonBase, Menu, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
export const Root = styled(Box, navigationSlot("RazethNav", "Root"))(({
  theme
}) => ({
  flexGrow: 1,
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  alignSelf: "stretch"
}));
export const NavList = styled(List, navigationSlot("RazethNav", "List"))<{
  variant?: "vertical" | "horizontal";
}>(({
  theme,
  variant = "vertical"
}) => ({
  position: "relative",
  display: variant === "vertical" ? "flex" : "block",
  height: "100%",
  padding: 0,
  margin: 0,
  listStyle: "none"
}));
export const NavItem = styled(ListItem, {
  ...navigationSlot("RazethNav", "Item"),
  shouldForwardProp: prop => prop !== "active" && prop !== "color"
})<{
  color: string;
  active?: boolean;
  variant?: "vertical" | "horizontal";
}>(({
  theme,
  color,
  active,
  variant = "vertical"
}) => {
  const {
    resolved,
    gradient
  } = colorItemMixin(color, theme);
  return {
    position: "relative",
    listStyle: "none",
    zIndex: 1,
    cursor: "pointer",
    display: "inline-flex",
    float: "left",
    margin: 0,
    padding: 0,
    outline: 0,
    boxSizing: "border-box",
    verticalAlign: "middle",
    lineHeight: 1.75,
    textTransform: "uppercase",
    width: variant == "vertical" ? "fit-content" : "100%",
    justifyContent: variant == "vertical" ? "center" : "flex-start",
    minWidth: "64px",
    backgroundImage: gradient,
    backgroundSize: "100% 200%",
    backgroundPosition: active ? "0 100%" : "0 0",
    transition: "background-position 0.5s",
    "&:active": {
      backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in"
    },
    "&:hover": {
      transition: "all 0.25s ease-in",
      "& > a, & > button": {
        color: active ? theme.vars.palette.common.white : `color-mix(in srgb, ${resolved} 60%, black)`,
        backgroundColor: active ? theme.vars.palette.action.hover : theme.alpha(theme.vars.palette.background.paper, 0.9),
        backgroundImage: active ? "none" : `linear-gradient(${theme.alpha(resolved, 0.12)}, ${theme.alpha(resolved, 0.12)})`,
        backdropFilter: active ? "none" : "blur(12px)",
        boxShadow: active ? "none" : `inset 0 0 0 1px ${theme.alpha(resolved, 0.4)}`,
        ...theme.applyStyles("dark", {
          color: active ? theme.vars.palette.common.white : `color-mix(in srgb, ${resolved} 60%, white)`
        })
      }
    },
    "&::after": {
      position: "absolute",
      bottom: 0,
      left: 0,
      content: "''",
      display: "block",
      background: resolved,
      transition: "width .3s"
    },
    "&:hover::after": {
      height: variant == "vertical" ? "2.5px" : "100%",
      width: variant == "vertical" ? "100%" : "2.5px",
      background: active ? "white" : resolved,
      backgroundPosition: "right",
      backgroundSize: "2.5px 100%"
    },
    svg: {
      color: "inherit"
    }
  };
});
export const NavLink = styled(Link, {
  ...navigationSlot("RazethNav", "Link"),
  shouldForwardProp: prop => prop !== "active" && prop !== "color"
})<{
  color: string;
  active?: boolean;
  variant?: "vertical" | "horizontal";
}>(({
  theme,
  color,
  active,
  variant = "vertical"
}) => {
  const resolved = resolveColor(color, theme);
  return {
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    textAlign: "center",
    textDecoration: "none",
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    color: variant === "vertical" ? theme.vars.palette.common.white : theme.vars.palette.text.primary,
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: theme.palette.action.hover
    },
    "&:hover svg": {}
  };
});
export const NavIcon = styled(ListItemIcon, navigationSlot("RazethNav", "Icon"))<{
  variant?: "vertical" | "horizontal";
}>(({
  theme,
  variant = "vertical"
}) => ({
  position: "relative",
  alignItems: "center",
  justifyContent: variant === "vertical" ? "center" : "left",
  color: "inherit",
  transition: "0.5s",
  margin: variant === "vertical" ? `0 ${theme.spacing(1)} 0 ${theme.spacing(-0.5)}` : "0",
  minWidth: variant === "vertical" ? "fit-content" : theme.spacing(5),
  textShadow: `
            -0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            -0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0    0   7px ${theme.custom.sideImage.captionGlowColor}
          `,
  WebkitTextStroke: `0.125px ${theme.custom.sideImage.captionOutlineColor}`
}));
export const NavText = styled(ListItemText, navigationSlot("RazethNav", "Text"))<{
  variant?: "vertical" | "horizontal";
}>(({
  theme,
  variant = "vertical"
}) => ({
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  transform: "translateY(0px)",
  textAlign: variant === "vertical" ? "center" : "left"
}));
export const NavGroupButton = styled(ButtonBase, navigationSlot("RazethNav", "GroupButton"))(({
  theme
}) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  alignSelf: "stretch",
  padding: theme.spacing(1, 2),
  color: theme.vars.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));
export const DrawerRoot = styled(Root, navigationSlot("RazethNav", "DrawerRoot"))({
  width: "100%",
  alignItems: "flex-start"
});
export const DrawerList = styled(List, navigationSlot("RazethNav", "DrawerList"))({
  width: "100%",
  padding: 0
});
export const DrawerItem = styled(ListItem, {
  ...navigationSlot("RazethNav", "DrawerItem"),
  shouldForwardProp: prop => prop !== "navColor"
})<{
  navColor: string;
}>(({
  theme,
  navColor
}) => {
  const {
    gradient,
    resolved
  } = colorItemMixin(navColor, theme);
  return {
    display: "block",
    color: theme.vars.palette.text.primary,
    "& .MuiListItemIcon-root": {
      color: "inherit"
    },
    "& > .MuiListItemButton-root": {
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        width: "2.5px",
        height: 0,
        backgroundColor: resolved,
        transition: "height 200ms ease"
      },
      "&:hover::after": {
        height: "100%"
      },
      "&.Mui-selected::after": {
        backgroundColor: "currentColor"
      }
    },
    "& > .MuiListItemButton-root.Mui-selected": {
      backgroundImage: gradient,
      backgroundSize: "100% 200%",
      backgroundPosition: "0 100%",
      color: theme.vars.palette.common.white,
      "& .MuiListItemIcon-root svg": {
        color: "inherit"
      }
    }
  };
});
export const DrawerGroupButton = styled(ListItemButton, navigationSlot("RazethNav", "DrawerGroupButton"))<{
  component?: "button";
}>({
  width: "100%"
});
export const DrawerChildLink = styled(ListItemButton, {
  ...navigationSlot("RazethNav", "DrawerChildLink"),
  shouldForwardProp: prop => prop !== "navColor"
})<{
  component?: typeof Link;
  href: string;
  navColor: string;
}>(({
  theme,
  navColor
}) => ({
  paddingLeft: theme.spacing(4),
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    width: "2.5px",
    height: 0,
    backgroundColor: resolveColor(navColor, theme),
    transition: "height 200ms ease"
  },
  "&:hover::after": {
    height: "100%"
  },
  "&.Mui-selected::after": {
    backgroundColor: "currentColor"
  },
  "&.Mui-selected": {
    backgroundImage: colorItemMixin(navColor, theme).gradient,
    backgroundSize: "100% 200%",
    backgroundPosition: "0 100%",
    color: theme.vars.palette.common.white,
    "& .MuiListItemIcon-root svg": {
      color: "inherit"
    }
  }
}));
export const DrawerChildIcon = styled(ListItemIcon, navigationSlot("RazethNav", "DrawerChildIcon"))({
  minWidth: 36,
  color: "inherit"
});
export const GroupArrow = styled(ExpandMoreIcon, navigationSlot("RazethNav", "GroupArrow"))({
  transition: "transform 200ms",
  "[aria-expanded='true'] > &": {
    transform: "rotate(180deg)"
  }
});
export const DesktopMenu = styled(Menu, navigationSlot("RazethNav", "Menu"))({
  pointerEvents: "none",
  "& .MuiPaper-root": {
    pointerEvents: "auto"
  }
});
