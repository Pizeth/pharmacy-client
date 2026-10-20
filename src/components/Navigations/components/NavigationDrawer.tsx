"use client";

import DrawerToggle from "../Navigation/DrawerToggle";
import MiniImg from "../Navigation/MiniImg";
import { NavItems } from "../Navigation/NavItems";
import GlobalSearch from "../Search/search";
import { DrawerAccount } from "./DrawerAccount";
import { NavMenuButton } from "../styles/header.styles";
import * as S from "../styles/drawer.styles";
import type { NavigationDrawerProps } from "../types";
export function NavigationDrawer({
  open,
  geometry,
  compactDesktop,
  mobileScrolled,
  disabledMenu,
  onToggle,
  onNavigate
}: NavigationDrawerProps & {
  open: boolean;
}) {
  return <S.Drawer variant="temporary" anchor="left" open={open} onClose={onNavigate} ModalProps={{
    keepMounted: true
  }} slots={{
    backdrop: S.TransparentBackdrop
  }} disableEnforceFocus disableScrollLock={false}>
    <S.DrawerHeader style={geometry} data-desktop-compact={compactDesktop ? "true" : undefined} data-mobile-scrolled={mobileScrolled ? "true" : undefined}>
      <NavMenuButton onClick={onToggle} variant="side" aria-label="close drawer">
        <S.HamBurgerNav><DrawerToggle data-drawer-logo><MiniImg /></DrawerToggle></S.HamBurgerNav>
      </NavMenuButton>
    </S.DrawerHeader>
    <S.DrawerDivider />
    <GlobalSearch />
    {!disabledMenu && <NavItems variant="horizontal" onNavigate={onNavigate} />}
    <DrawerAccount />
  </S.Drawer>;
}
