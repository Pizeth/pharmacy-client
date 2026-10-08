"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { NavList, NavItem, NavLink, NavIcon, NavText, Indicator } from "./Navigation";

// import { HomeIcon, PersonIcon, ChatIcon, CameraIcon, SettingsIcon } from "./icons";
import { styled } from "@mui/material/styles";
import { indicatorSpin } from "@/theme/keyframes";
import Link from "next/link";
import { colorItemMixin, resolveColor } from "@/utils/themeUtils";
import {
  Box,
  ButtonBase,
  Collapse,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
// Import configuration maps
import {
  getDynamicNavItems,
  getActiveNavIndex,
  matchesNavRoute,
  NavItemType,
} from "@/configs/navConfig";
// import { Link } from "@mui/material";

const PREFIX = "RazethNav";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  flexGrow: 1,
  // position: "relative",
  // width: "400px",
  // height: "70px",
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  alignSelf: "stretch",
  // background: "#333",
  // borderRadius: "10px",
  // [theme.breakpoints.up("xs")]: {
  //   display: "none",
  // },
  // [theme.breakpoints.up("sm")]: {
  //   display: "block",
  // },
  // [theme.breakpoints.up("md")]: {
  //   display: "flex",
  // },
}));

const NavList = styled(List, {
  name: PREFIX,
  slot: "List",
  overridesResolver: (_props, styles) => styles.list,
})<{ variant?: "vertical" | "horizontal" }>(
  ({ theme, variant = "vertical" }) => ({
    position: "relative",
    // display: "inline-flex",
    display: variant === "vertical" ? "flex" : "block",
    // backgroundImage:
    //   variant === "vertical"
    //     ? theme.alpha(theme.vars.palette.background.paper, 0.15)
    //     : "transparent",
    // backgroundImage:
    //   variant === "vertical"
    //     ? `linear-gradient(180deg, transparent 0%, ${theme.alpha(theme.vars.palette.background.paper, 0.75)} 100%)`
    //     : "transparent",

    height: "100%",
    padding: 0,
    margin: 0,
    listStyle: "none",
  }),
);

const NavItem = styled(ListItem, {
  name: PREFIX,
  slot: "Item",
  overridesResolver: (_props, styles) => styles.item,
  shouldForwardProp: (prop) => prop !== "active" && prop !== "color",
})<{ color: string; active?: boolean; variant?: "vertical" | "horizontal" }>(({
  theme,
  color,
  active,
  variant = "vertical",
}) => {
  // const resolved = resolveColor(color, theme); // 👈 resolve here
  const { resolved, gradient, border } = colorItemMixin(color, theme);
  return {
    position: "relative",
    listStyle: "none",
    // width: "70px",
    // height: "70px",
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
    // },
    // width: "fit-content",
    minWidth: "64px",
    // borderBottom: border,

    // icon transitions
    // "& .nav-icon": {
    //     color: active ? "#29fd53" : "rgba(255,255,255,0.5)",
    //     transform: active ? "translateY(-8px)" : "translateY(0)",
    //     transition: "0.5s",
    // },

    // text transitions
    // "& .nav-text": {
    //     transform: active ? "translateY(13px)" : "translateY(0px)",
    //     opacity: active ? 1 : 0,
    //     transition: "0.5s",
    // },
    // backgroundImage: `linear-gradient(to top, ${resolved} 50%, transparent 50%)`,
    backgroundImage: gradient,
    backgroundSize: "100% 200%",
    backgroundPosition: active ? "0 100%" : "0 0",
    transition: "background-position 0.5s",

    "&:active": {
      backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in",
    },

    "&:hover": {
      // backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in",
      "& > a, & > button": {
        color: active ? theme.vars.palette.common.white : `color-mix(in srgb, ${resolved} 60%, black)`,
        backgroundColor: active
          ? theme.vars.palette.action.hover
          : theme.alpha(theme.vars.palette.background.paper, 0.9),
        backgroundImage: active ? "none" : `linear-gradient(${theme.alpha(resolved, 0.12)}, ${theme.alpha(resolved, 0.12)})`,
        backdropFilter: active ? "none" : "blur(12px)",
        boxShadow: active ? "none" : `inset 0 0 0 1px ${theme.alpha(resolved, 0.4)}`,
        ...theme.applyStyles("dark", {
          color: active ? theme.vars.palette.common.white : `color-mix(in srgb, ${resolved} 60%, white)`,
        }),
      },
      // backgroundImage:
      //   variant === "vertical"
      //     ? `linear-gradient(180deg, transparent 0%, ${theme.alpha(theme.vars.palette.background.paper, 0.75)} 100%)`
      //     : "transparent",
    },

    "&::after": {
      position: "absolute",
      bottom: 0,
      left: 0,
      content: "''",
      display: "block",
      //   width: variant == "vertical" ? 0 : "2.5px",
      //   height: variant == "vertical" ? "2.5px" : 0,
      background: resolved,
      transition: "width .3s",
    },

    "&:hover::after": {
      height: variant == "vertical" ? "2.5px" : "100%",
      //   borderRight: "2.5px solid white",
      width: variant == "vertical" ? "100%" : "2.5px",
      background: active ? "white" : resolved,
      backgroundPosition: "right",
      /* Size the width to 2.5px and height to fill the element */
      backgroundSize: "2.5px 100%",
    },
    svg: {
      // color: active ? `oklch(from ${resolved} calc(l - 0.6) c h)` : resolved,
      color: "inherit",
      // color: active ? `contrast-color(${resolved})` : resolved,
    },
  };
});

const VerticalNavItem = styled(ListItem, {
  name: PREFIX,
  slot: "SidebarItem",
  overridesResolver: (_props, styles) => styles.sidebarItem,
  shouldForwardProp: (prop) => prop !== "color" && prop !== "active",
})<{ color: string; active?: boolean }>(({ theme, color, active }) => {
  const { resolved, gradient, border } = colorItemMixin(color, theme);
  return {
    padding: 0,

    "& .MuiListItemButton-root": {
      // borderLeft: border,           // vertical uses left border instead of bottom
      backgroundImage: gradient,
      backgroundSize: "200% 100%", // flip axis for vertical slide
      backgroundPosition: active ? "100% 0" : "0 0",
      transition: "background-position 0.5s",

      "& .MuiListItemIcon-root": {
        color: active ? resolved : "inherit",
        transition: "color 0.3s",
      },
    },

    "& .MuiListItemButton-root:hover": {
      backgroundPosition: "100% 0",
      transition: "all 0.25s ease-in",
    },

    "&:active": {
      backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in",
    },

    "&:hover": {
      // backgroundPosition: "0 100%",
      transition: "all 0.25s ease-in",
      a: { color: active ? "inherit" : resolved },
    },

    "&::after": {
      position: "absolute",
      bottom: 0,
      left: 0,
      content: "''",
      display: "block",
      width: 0,
      height: "2px",
      background: resolved,
      transition: "width .3s",
    },

    "&:hover::after": {
      width: "100%",
      background: active ? "white" : resolved,
    },
    svg: {
      // color: active ? `oklch(from ${resolved} calc(l - 0.6) c h)` : resolved,
      color: "inherit",
      // color: active ? `contrast-color(${resolved})` : resolved,
    },
  };
});

const NavLink = styled(Link, {
  name: PREFIX,
  slot: "Link",
  overridesResolver: (_props, styles) => styles.link,
  shouldForwardProp: (prop) => prop !== "active" && prop !== "color",
})<{
  color: string;
  active?: boolean;
  variant?: "vertical" | "horizontal";
}>(({ theme, color, active, variant = "vertical" }) => {
  const resolved = resolveColor(color, theme); // 👈 resolve here
  return {
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "column",
    width: "100%",
    height: "100%",
    textAlign: "center",
    // fontWeight: 500,
    textDecoration: "none",
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,

    /* new style */
    // display: "inline-block",
    // color: active
    //   ? theme.vars.palette.common.white
    //   : theme.vars.palette.text.primary,
    color: variant === "vertical"
      ? theme.vars.palette.common.white
      : theme.vars.palette.text.primary,
    // color: theme.vars?.palette?.text?.primary ?? theme.palette.text.primary,
    fontSize: "1rem",
    // padding: "12.7px 12.7px",
    // boxSizing: "border-box",
    // height: "45px",
    // baked from `color` prop
    // borderBottom: `5px solid ${resolved}`,
    // backgroundImage: `linear-gradient(to top, ${resolved} 50%, transparent 50%)`,
    // backgroundSize: "100% 200%",
    // backgroundPosition: active ? "0 100%" : "0 0",
    // transition: "background-position 0.5s",

    // "&:active": {
    //     backgroundPosition: "0 100%",
    //     transition: "all 0.25s ease-in",
    // },

    "&:hover": {
      // backgroundPosition: "0 100%",
      // transition: "all 0.25s ease-in",
      //   color: active ? "inherit" : resolved,
      // backgroundColor: "var(--app-palette-action-hover)",
      backgroundColor: theme.palette.action.hover,
    },
    // "&::after": {
    //     content: "''",
    //     display: "block",
    //     width: 0,
    //     height: "2px",
    //     background: resolved,
    //     transition: " width .3s",
    // },

    // "&:hover::after": {
    //     width: "100%",
    //     background: active ? "white" : resolved,
    // },

    // svg: {
    //     // color: active ? `oklch(from ${resolved} calc(l - 0.6) c h)` : resolved,
    //     color: active ? `oklch(from ${resolved} 1 0 h)` : resolved,
    //     // color: active ? `contrast-color(${resolved})` : resolved,
    // },

    //     .dynamic - text {
    //     filter: invert(1) grayscale(1) contrast(999) brightness(1.5);
    //     mix - blend - mode: luminosity;
    // }

    "&:hover svg": {
      // color: "rgba(255,255,255,1)",
      // color: `oklch(from ${resolved} 1 0 h)`,
      // color: `oklch(from ${resolved} calc(l - 0.6) c h)`,
    },
  };
});

const NavIcon = styled(ListItemIcon, {
  name: PREFIX,
  slot: "Icon",
  overridesResolver: (_props, styles) => styles.icon,
  // })(({ theme }) => ({
})<{ variant?: "vertical" | "horizontal" }>(
  ({ theme, variant = "vertical" }) => ({
    position: "relative",
    // display: "inline-flex",
    alignItems: "center",
    justifyContent: variant === "vertical" ? "center" : "left",
    color: "inherit",
    // fontSize: "1.5em",
    // lineHeight: "75px",
    transition: "0.5s",
    // height: "75px",
    // display: "inherit",
    // marginRight: theme.spacing(1),
    // marginLeft: theme.spacing(-0.5),
    margin:
      variant === "vertical"
        ? `0 ${theme.spacing(1)} 0 ${theme.spacing(-0.5)}`
        : "0",
    minWidth: variant === "vertical" ? "fit-content" : theme.spacing(5),
    textShadow: `
            -0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px -0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            -0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0.5px  0.5px 0 ${theme.custom.sideImage.captionOutlineColor},
            0    0   7px ${theme.custom.sideImage.captionGlowColor}
          `,
    // "-webkit-text-stroke": `0.125px ${props.theme.custom.sideImage.captionOutlineColor}`,
    WebkitTextStroke: `0.125px ${theme.custom.sideImage.captionOutlineColor}`,
  }),
);

const NavText = styled(ListItemText, {
  name: PREFIX,
  slot: "Text",
  overridesResolver: (_props, styles) => styles.text,
})<{ variant?: "vertical" | "horizontal" }>(
  ({ theme, variant = "vertical" }) => ({
    // position: "absolute",
    // opacity: 0,
    // fontWeight: 600,
    // fontSize: "0.5em",
    // color: "#222327",
    // transition: "0.00125s",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    transform: "translateY(0px)",
    textAlign: variant === "vertical" ? "center" : "left",
    // fontFamily: "'Poppins', sans-serif",
  }),
);

const Indicator = styled("div", {
  name: PREFIX,
  slot: "Indicator",
  overridesResolver: (_props, styles) => styles.indicator,
})<{ activeIndex: number }>(({ activeIndex }) => ({
  position: "absolute",
  width: "70px",
  height: "70px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "0.5s",
  transform: `translateX(calc(70px * ${activeIndex}))`,
  pointerEvents: "none",

  "&::before": {
    content: '""',
    position: "absolute",
    bottom: "13px",
    width: "80%",
    height: "14px",
    background: "#29fd53",
    borderRadius: "10px",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: "-3px",
    width: "7.5px",
    height: "7.5px",
    borderRadius: "50%",
    background: "#333",
    boxShadow:
      "0 0 0 2px #29fd53, 50px 50px #29fd53, 40px 0 #29fd53, 0 40px #29fd53",
    transform: "rotate(45deg)",
    animation: `${indicatorSpin} 2s ease -in -out infinite`,
  },
}));

const NavGroupButton = styled(ButtonBase, {
  name: PREFIX, slot: "GroupButton", overridesResolver: (_props, styles) => styles.groupButton,
})(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  padding: theme.spacing(1, 2),
  color: theme.vars.palette.common.white,
  "&:hover": { backgroundColor: theme.palette.action.hover },
}));

const DrawerRoot = styled(Root, { name: PREFIX, slot: "DrawerRoot", overridesResolver: (_props, styles) => styles.drawerRoot })({ width: "100%", alignItems: "flex-start" });
const DrawerList = styled(List, { name: PREFIX, slot: "DrawerList", overridesResolver: (_props, styles) => styles.drawerList })({ width: "100%", padding: 0 });
const DrawerItem = styled(ListItem, {
  name: PREFIX, slot: "DrawerItem", overridesResolver: (_props, styles) => styles.drawerItem,
  shouldForwardProp: prop => prop !== "navColor",
})<{ navColor: string }>(({ theme, navColor }) => {
  const { gradient, resolved } = colorItemMixin(navColor, theme);
  return {
    display: "block",
    color: theme.vars.palette.text.primary,
    "& .MuiListItemIcon-root": { color: "inherit" },
    "& > .MuiListItemButton-root": {
      "&::after": {
        content: '""', position: "absolute", left: 0, top: 0,
        width: "2.5px", height: 0, backgroundColor: resolved,
        transition: "height 200ms ease",
      },
      "&:hover::after": { height: "100%" },
      "&.Mui-selected::after": { backgroundColor: "currentColor" },
    },
    "& > .MuiListItemButton-root.Mui-selected": {
      backgroundImage: gradient,
      backgroundSize: "100% 200%",
      backgroundPosition: "0 100%",
      color: theme.vars.palette.common.white,
      "& .MuiListItemIcon-root svg": { color: "inherit" },
    },
  };
});
const DrawerGroupButton = styled(ListItemButton, { name: PREFIX, slot: "DrawerGroupButton", overridesResolver: (_props, styles) => styles.drawerGroupButton })<{ component?: "button" }>({ width: "100%" });
const DrawerChildLink = styled(ListItemButton, {
  name: PREFIX, slot: "DrawerChildLink", overridesResolver: (_props, styles) => styles.drawerChildLink,
  shouldForwardProp: prop => prop !== "navColor",
})<{ component?: typeof Link; href: string; navColor: string }>(({ theme, navColor }) => ({
  paddingLeft: theme.spacing(4),
  "&::after": {
    content: '""', position: "absolute", left: 0, top: 0,
    width: "2.5px", height: 0, backgroundColor: resolveColor(navColor, theme),
    transition: "height 200ms ease",
  },
  "&:hover::after": { height: "100%" },
  "&.Mui-selected::after": { backgroundColor: "currentColor" },
  "&.Mui-selected": {
    backgroundImage: colorItemMixin(navColor, theme).gradient,
    backgroundSize: "100% 200%",
    backgroundPosition: "0 100%",
    color: theme.vars.palette.common.white,
    "& .MuiListItemIcon-root svg": { color: "inherit" },
  },
}));
const DrawerChildIcon = styled(ListItemIcon, { name: PREFIX, slot: "DrawerChildIcon", overridesResolver: (_props, styles) => styles.drawerChildIcon })({ minWidth: 36, color: "inherit" });
const GroupArrow = styled(ExpandMoreIcon, { name: PREFIX, slot: "GroupArrow", overridesResolver: (_props, styles) => styles.groupArrow })({ transition: "transform 200ms", "[aria-expanded='true'] > &": { transform: "rotate(180deg)" } });
const DesktopMenu = styled(Menu, { name: PREFIX, slot: "Menu", overridesResolver: (_props, styles) => styles.menu })({ pointerEvents: "none", "& .MuiPaper-root": { pointerEvents: "auto" } });

interface NavItemsProps {
  variant?: "vertical" | "horizontal";
  items?: NavItemType[];
  onNavigate?: () => void;
}

export const NavItems = ({ variant = "vertical", items, onNavigate }: NavItemsProps) => {
  const pathname = usePathname();
  const menuId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMenu(null), 180);
  };
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);
  const [menu, setMenu] = useState<{
    anchor: HTMLElement;
    item: NavItemType;
    pathname: string;
    hover?: boolean;
  } | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const navItems = items ?? getDynamicNavItems(pathname);
  const activeIndex = getActiveNavIndex(pathname, navItems);
  const menuOpen = menu !== null && menu.pathname === pathname && navItems.includes(menu.item);

  const labelContent = (item: NavItemType) => (
    <>
      <NavIcon variant={variant}>{item.Icon}</NavIcon>
      <NavText
        primary={item.label}
        variant={variant}
        slotProps={{
          primary: variant === "vertical" ? { variant: "h4" } : { component: "span" },
        }}
      />
    </>
  );

  if (variant === "horizontal") {
    return <DrawerRoot>
      <DrawerList>
        {navItems.map((item, index) => {
          const expanded = expandedGroups.includes(item.href);
          const groupId = `${menuId}-group-${index}`;
          return <DrawerItem key={item.href} navColor={item.color} disablePadding>
            {item.children?.length ? <>
              <DrawerGroupButton
                component="button"
                id={`${groupId}-trigger`}
                aria-expanded={expanded}
                aria-controls={groupId}
                selected={activeIndex === index}
                onClick={() => setExpandedGroups(current => expanded
                  ? current.filter(href => href !== item.href)
                  : [...current, item.href])}
              >
                {labelContent(item)}
                <GroupArrow />
              </DrawerGroupButton>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <List id={groupId} aria-labelledby={`${groupId}-trigger`} disablePadding>
                  {item.children.map(child => <ListItem key={child.href} disablePadding>
                    <DrawerChildLink component={Link} href={child.href} navColor={child.color}
                      selected={matchesNavRoute(pathname, child.href)}
                      aria-current={pathname === child.href ? "page" : undefined}
                      onClick={onNavigate}>
                      <DrawerChildIcon>{child.Icon}</DrawerChildIcon>
                      <Typography component="span" variant="subtitle1">{child.label}</Typography>
                    </DrawerChildLink>
                  </ListItem>)}
                </List>
              </Collapse>
            </> : <ListItemButton component={Link} href={item.href}
              selected={activeIndex === index}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={onNavigate}>{labelContent(item)}</ListItemButton>}
          </DrawerItem>;
        })}
      </DrawerList>
    </DrawerRoot>;
  }

  return (
    <Root>
      <NavList variant={variant}>
        {navItems.map((item, index) => (
          <NavItem
            key={item.href}
            color={item.color}
            active={activeIndex === index}
            variant={variant}
          >
            {item.children?.length ? (
              <NavGroupButton
                id={`${menuId}-${index}`}
                aria-haspopup="menu"
                aria-expanded={menuOpen && menu?.item === item}
                aria-controls={menuOpen && menu?.item === item ? `${menuId}-menu` : undefined}
                onMouseEnter={(event) => {
                  if (variant !== "vertical") return;
                  cancelClose();
                  setMenu({ anchor: event.currentTarget, item, pathname, hover: true });
                }}
                onMouseLeave={() => { if (variant === "vertical") scheduleClose(); }}
                onClick={(event) => {
                  cancelClose();
                  setMenu({ anchor: event.currentTarget, item, pathname });
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    cancelClose();
                    setMenu({ anchor: event.currentTarget, item, pathname });
                  }
                }}
              >
                {labelContent(item)}
                <ExpandMoreIcon />
              </NavGroupButton>
            ) : (
              <NavLink
                href={item.href}
                color={item.color}
                variant={variant}
                active={activeIndex === index}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {labelContent(item)}
              </NavLink>
            )}
          </NavItem>
        ))}
      </NavList>
      <DesktopMenu
        id={`${menuId}-menu`}
        anchorEl={menuOpen ? menu?.anchor : null}
        open={menuOpen}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableScrollLock
        disableAutoFocus={menu?.hover}
        disableEnforceFocus={menu?.hover}
        disableRestoreFocus={menu?.hover}
        autoFocus={!menu?.hover}
        disableAutoFocusItem={menu?.hover}
        hideBackdrop={variant === "vertical"}
        slotProps={{
          paper: {
            onMouseEnter: cancelClose,
            onMouseLeave: () => { if (variant === "vertical") scheduleClose(); },
          },
          list: { "aria-labelledby": menuOpen ? menu?.anchor.id : undefined },
        }}
      >
        {menu?.item.children?.map((child) => (
          <MenuItem
            key={child.href}
            component={Link}
            href={child.href}
            selected={matchesNavRoute(pathname, child.href)}
            aria-current={pathname === child.href ? "page" : undefined}
            onClick={() => setMenu(null)}
          >
            <ListItemIcon>{child.Icon}</ListItemIcon>
            <Typography component="span" variant="subtitle1">{child.label}</Typography>
          </MenuItem>
        ))}
      </DesktopMenu>
    </Root>
  );
};
