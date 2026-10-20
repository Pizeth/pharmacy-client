"use client";

import type { NavItemType } from "@/configs/navConfig";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { Collapse, MenuItem, List, ListItem, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import { getDynamicNavItems, getActiveNavIndex, matchesNavRoute } from "@/configs/navConfig";
import { Root, NavList, NavItem, NavLink, NavIcon, NavText, NavGroupButton, DrawerRoot, DrawerList, DrawerItem, DrawerGroupButton, DrawerChildLink, DrawerChildIcon, GroupArrow, DesktopMenu } from "./NavItems.styles";
interface NavItemsProps {
  variant?: "vertical" | "horizontal";
  items?: NavItemType[];
  onNavigate?: () => void;
}
export const NavItems = ({
  variant = "vertical",
  items,
  onNavigate
}: NavItemsProps) => {
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
  const labelContent = (item: NavItemType) => <>
      <NavIcon variant={variant}>{item.Icon}</NavIcon>
      <NavText primary={item.label} variant={variant} slotProps={{
      primary: variant === "vertical" ? {
        variant: "h4"
      } : {
        component: "span"
      }
    }} />
    </>;
  if (variant === "horizontal") {
    return <DrawerRoot>
      <DrawerList>
        {navItems.map((item, index) => {
          const expanded = expandedGroups.includes(item.href);
          const groupId = `${menuId}-group-${index}`;
          return <DrawerItem key={item.href} navColor={item.color} disablePadding>
            {item.children?.length ? <>
              <DrawerGroupButton component="button" id={`${groupId}-trigger`} aria-expanded={expanded} aria-controls={groupId} selected={activeIndex === index} onClick={() => setExpandedGroups(current => expanded ? current.filter(href => href !== item.href) : [...current, item.href])}>
                {labelContent(item)}
                <GroupArrow />
              </DrawerGroupButton>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <List id={groupId} aria-labelledby={`${groupId}-trigger`} disablePadding>
                  {item.children.map(child => <ListItem key={child.href} disablePadding>
                    <DrawerChildLink component={Link} href={child.href} navColor={child.color} selected={matchesNavRoute(pathname, child.href)} aria-current={pathname === child.href ? "page" : undefined} onClick={onNavigate}>
                      <DrawerChildIcon>{child.Icon}</DrawerChildIcon>
                      <Typography component="span" variant="subtitle1">{child.label}</Typography>
                    </DrawerChildLink>
                  </ListItem>)}
                </List>
              </Collapse>
            </> : <ListItemButton component={Link} href={item.href} selected={activeIndex === index} aria-current={pathname === item.href ? "page" : undefined} onClick={onNavigate}>{labelContent(item)}</ListItemButton>}
          </DrawerItem>;
        })}
      </DrawerList>
    </DrawerRoot>;
  }
  return <Root>
      <NavList variant={variant}>
        {navItems.map((item, index) => <NavItem key={item.href} color={item.color} active={activeIndex === index} variant={variant}>
            {item.children?.length ? <NavGroupButton id={`${menuId}-${index}`} aria-haspopup="menu" aria-expanded={menuOpen && menu?.item === item} aria-controls={menuOpen && menu?.item === item ? `${menuId}-menu` : undefined} onMouseEnter={event => {
          if (variant !== "vertical") return;
          cancelClose();
          setMenu({
            anchor: event.currentTarget,
            item,
            pathname,
            hover: true
          });
        }} onMouseLeave={() => {
          if (variant === "vertical") scheduleClose();
        }} onClick={event => {
          cancelClose();
          setMenu({
            anchor: event.currentTarget,
            item,
            pathname
          });
        }} onKeyDown={event => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            cancelClose();
            setMenu({
              anchor: event.currentTarget,
              item,
              pathname
            });
          }
        }}>
                {labelContent(item)}
                <ExpandMoreIcon />
              </NavGroupButton> : <NavLink href={item.href} color={item.color} variant={variant} active={activeIndex === index} aria-current={pathname === item.href ? "page" : undefined}>
                {labelContent(item)}
              </NavLink>}
          </NavItem>)}
      </NavList>
      <DesktopMenu id={`${menuId}-menu`} anchorEl={menuOpen ? menu?.anchor : null} open={menuOpen} onClose={() => setMenu(null)} anchorOrigin={{
      vertical: "bottom",
      horizontal: "left"
    }} transformOrigin={{
      vertical: "top",
      horizontal: "left"
    }} disableScrollLock disableAutoFocus={menu?.hover} disableEnforceFocus={menu?.hover} disableRestoreFocus={menu?.hover} autoFocus={!menu?.hover} disableAutoFocusItem={menu?.hover} hideBackdrop={variant === "vertical"} slotProps={{
      paper: {
        onMouseEnter: cancelClose,
        onMouseLeave: () => {
          if (variant === "vertical") scheduleClose();
        }
      },
      list: {
        "aria-labelledby": menuOpen ? menu?.anchor.id : undefined
      }
    }}>
        {menu?.item.children?.map(child => <MenuItem key={child.href} component={Link} href={child.href} selected={matchesNavRoute(pathname, child.href)} aria-current={pathname === child.href ? "page" : undefined} onClick={() => setMenu(null)}>
            <ListItemIcon>{child.Icon}</ListItemIcon>
            <Typography component="span" variant="subtitle1">{child.label}</Typography>
          </MenuItem>)}
      </DesktopMenu>
    </Root>;
};
