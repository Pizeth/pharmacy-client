"use client";

import { useMemo } from "react";
import { Container, Typography } from "@mui/material";
import AvatarContainer from "@/components/Avatar/AvatarContainer";
import Icons from "@/components/icons/components/socials";
import ParticleContainer from "@/theme/effects/particle";
import options from "@/configs/particleConfig";
import DrawerToggle from "../Navigation/DrawerToggle";
import MiniImg from "../Navigation/MiniImg";
import NavPattern from "../Navigation/NavPattern";
import { NavItems } from "../Navigation/NavItems";
import type { NavigationHeaderProps } from "../types";
import * as S from "../styles/header.styles";
export function NavigationHeader({
  headerRef,
  compactDesktop,
  mobile,
  scrolled,
  open,
  disabledMenu,
  onToggle
}: NavigationHeaderProps) {
  const particleOptions = useMemo(() => options(), []);
  return <S.AppBar ref={headerRef} position="fixed" color="primary" component="nav" enableColorOnDark data-desktop-compact={compactDesktop ? "true" : undefined} data-mobile-scrolled={mobile && scrolled ? "true" : undefined} data-socials-hidden={mobile || scrolled ? "true" : undefined}>
    <NavPattern />
    <Container maxWidth="xl">
      <ParticleContainer id="tsparticles" options={particleOptions} />
      <S.AppBarContainer maxWidth="xl">
        <S.ProfileToolBar inert={compactDesktop || undefined} disableGutters variant="dense">
          <S.LogoSection>
            <AvatarContainer data-mobile-brand neumorphic={false} softGlow><MiniImg alt="អគ្គលេខាធិការដ្ឋាន" /></AvatarContainer>
            <S.NavMenuButton color="inherit" aria-label="open drawer" edge="start" onClick={onToggle} visible={!open}>
              <DrawerToggle><MiniImg /></DrawerToggle>
            </S.NavMenuButton>
            <S.LogoCaption data-text="General Secretariat">
              <Typography variant="h6">អគ្គលេខាធិការដ្ឋាន</Typography>
              <Typography variant="h5">3</Typography>
              <Typography variant="subtitle1">General Secretariat</Typography>
            </S.LogoCaption>
          </S.LogoSection>
          <S.MobileMenuButton color="inherit" aria-label="open drawer" aria-expanded={open} onClick={onToggle}>
            <span data-menu-glyph aria-hidden="true" />
          </S.MobileMenuButton>
          <S.StackWrapper direction="row" spacing={1}><Icons /></S.StackWrapper>
        </S.ProfileToolBar>
      </S.AppBarContainer>
      {!disabledMenu && <S.DesktopToolbar disableGutters variant="dense">
        <S.CompactLogoButton color="inherit" aria-label="open drawer" aria-expanded={open} onClick={onToggle}>
          <AvatarContainer neumorphic={false} softGlow><MiniImg alt="អគ្គលេខាធិការដ្ឋាន" /></AvatarContainer>
        </S.CompactLogoButton>
        <NavItems />
      </S.DesktopToolbar>}
    </Container>
  </S.AppBar>;
}
