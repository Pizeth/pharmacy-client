"use client";

import { useCallback, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NextParticlesProvider } from "@tsparticles/nextjs";
import { initParticles } from "@/theme/effects/initParticles";
import { SiteFooter } from "@/components/layouts/SiteFooter";
import { SiteBreadcrumbs } from "@/components/layouts/SiteBreadcrumbs";
import { NavigationHeader } from "./components/NavigationHeader";
import { NavigationDrawer } from "./components/NavigationDrawer";
import { useHeaderScrollState } from "./Navigation/useHeaderScrollState";
import { Main, Root } from "./styles/layout.styles";
import type { DrawerAppBarProps, NavigationGeometry } from "./types";
export type { DrawerAppBarProps } from "./types";

/** Coordinate navigation state; presentation and account state belong to children. */
export function DrawerAppBar({
  children,
  disabledMenu = false,
  backgroundColor,
  breadcrumbs = <SiteBreadcrumbs />,
}: DrawerAppBarProps) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    scrolled,
    headerRef,
    headerHeight
  } = useHeaderScrollState();
  const [open, setOpen] = useState(false);
  const toggleDrawer = useCallback(() => setOpen(current => !current), []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const compactDesktop = !mobile && !disabledMenu && scrolled;
  const geometry: NavigationGeometry | undefined = headerHeight > 0 ? {
    "--Navigation-expanded-height": `${headerHeight}px`
  } : undefined;
  return <Root>
    <NextParticlesProvider init={initParticles}>
      <NavigationHeader headerRef={headerRef} compactDesktop={compactDesktop} mobile={mobile} scrolled={scrolled} open={open} disabledMenu={disabledMenu} onToggle={toggleDrawer} />
      <NavigationDrawer open={open} geometry={geometry} compactDesktop={compactDesktop} mobileScrolled={mobile && scrolled} disabledMenu={disabledMenu} onToggle={toggleDrawer} onNavigate={closeDrawer} />
      <Main open={open} backgroundColor={backgroundColor} style={geometry}>{breadcrumbs}{children}<SiteFooter /></Main>
    </NextParticlesProvider>
  </Root>;
}
export default DrawerAppBar;
