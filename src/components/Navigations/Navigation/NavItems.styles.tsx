"use client";

import { navigationSlot } from "../styles/slots";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { keyframes, styled } from "@mui/material/styles";
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
export const NavPill = styled("li", navigationSlot("RazethNav", "Pill"))(({ theme }) => ({
  position: "absolute",
  top: "calc(var(--Nav-pill-y, 0px) + var(--Nav-pill-height, 0px) / 2)",
  left: 0,
  width: "var(--Nav-pill-width, 0px)",
  height: `min(var(--Nav-pill-height, 0px), ${theme.spacing(6)})`,
  transform: "translate3d(var(--Nav-pill-x, 0px), -50%, 0)",
  borderRadius: 999,
  listStyle: "none",
  pointerEvents: "none",
  opacity: 0,
  background: "linear-gradient(135deg, #F5DB8D, #E8B841)",
  boxShadow: "inset 0 1px 1px rgb(255 255 255 / 55%), 0 3px 10px rgb(38 36 123 / 20%)",
  transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), width 280ms cubic-bezier(0.22, 1, 0.36, 1), height 180ms ease, opacity 150ms ease",
  '[data-pill-ready="true"] > &': { opacity: 1 },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));
const drawBorder = keyframes({
  from: { strokeDasharray: 100, strokeDashoffset: 100 },
  "99%": { strokeDasharray: 100, strokeDashoffset: 0 },
  // A continuous final stroke avoids the dash seam on a closed rounded path.
  to: { strokeDasharray: "none", strokeDashoffset: 0 },
});
export const NavHoverBorder = styled("svg", navigationSlot("RazethNav", "HoverBorder"))(({ theme }) => ({
  position: "absolute",
  insetInline: 4,
  top: "50%",
  transform: "translateY(-50%)",
  width: "calc(100% - 8px)",
  height: `min(calc(100% - 8px), ${theme.spacing(6)})`,
  pointerEvents: "none",
  overflow: "visible",
  shapeRendering: "geometricPrecision",
  fill: "none",
  stroke: "var(--Nav-item-color)",
  strokeWidth: 2,
  strokeLinecap: "round",
  "& rect": {
    width: "calc(100% - 2px)", height: "calc(100% - 2px)",
    strokeDasharray: 100, strokeDashoffset: 100,
  },
  "a:hover > & rect, button:hover > & rect": { animation: `${drawBorder} 650ms ease-out 1 forwards` },
  "@media (prefers-reduced-motion: reduce)": {
    "a:hover > & rect, button:hover > & rect": { animation: "none", strokeDasharray: "none", strokeDashoffset: 0 },
  },
}));
export const NavItem = styled(ListItem, {
  ...navigationSlot("RazethNav", "Item"),
  shouldForwardProp: prop => prop !== "active" && prop !== "color",
})<{
  color: string;
  active?: boolean;
  variant?: "vertical" | "horizontal";
}>(({ theme, color }) => ({
  "--Nav-item-color": resolveColor(color, theme),
  position: "relative",
  zIndex: 1,
  display: "inline-flex",
  width: "fit-content",
  minWidth: 64,
  margin: 0,
  padding: 0,
  listStyle: "none",
  textTransform: "uppercase",
  "& > a, & > button": {
    borderRadius: 999,
    background: "transparent",
    transition: "color 180ms ease",
    "&:focus-visible": {
      outline: "none",
      "&::after": {
        content: '""',
        position: "absolute",
        insetInline: 4,
        top: "50%",
        height: `min(calc(100% - 8px), ${theme.spacing(6)})`,
        transform: "translateY(-50%)",
        borderRadius: "inherit",
        outline: "2px solid white",
        outlineOffset: 2,
        pointerEvents: "none",
      },
    },
  },
  '&[data-pill-highlighted="true"] > a, &[data-pill-highlighted="true"] > button': {
    color: "#26247B",
  },
  "& svg": { color: "inherit" },
  "@media (prefers-reduced-motion: reduce)": {
    "& > a, & > button": { transition: "none" },
  },
}));
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
