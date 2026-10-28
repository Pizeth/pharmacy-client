"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs, Container, Link, Typography } from "@mui/material";
import type { LinkProps, TypographyProps } from "@mui/material";
import { styled, type CSSInterpolation } from "@mui/material/styles";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useBreadcrumbLabels } from "./breadcrumbLabels";
import { getSiteBreadcrumbs } from "./breadcrumbRoutes";
import { ROUTE_NAV_MAP } from "@/configs/navConfig";
import { breadcrumbRootStyles, breadcrumbTrailStyles, breadcrumbItemStyles, breadcrumbSeparatorStyles, breadcrumbIconStyles } from "./breadcrumbStyles";

export type SiteBreadcrumbSlot = "root" | "trail" | "link" | "current" | "icon" | "separator";
function slot(name: Capitalize<SiteBreadcrumbSlot>) {
  const key = name.charAt(0).toLowerCase() + name.slice(1);
  return { name: "RazethSiteBreadcrumbs", slot: name, overridesResolver: (_: unknown, styles: Record<string, CSSInterpolation>) => styles[key] };
}
const Root = styled(Container, slot("Root"))(({ theme }) => breadcrumbRootStyles(theme));
const Trail = styled(Breadcrumbs, slot("Trail"))(({ theme }) => breadcrumbTrailStyles(theme));
const Ancestor = styled(Link, slot("Link"))<LinkProps>({});
const Current = styled(Typography, slot("Current"))<TypographyProps>(({ theme }) => breadcrumbItemStyles(theme));
const Separator = styled(ChevronRightIcon, slot("Separator"))(({ theme }) => breadcrumbSeparatorStyles(theme));
const Icon = styled("span", slot("Icon"))(({ theme }) => breadcrumbIconStyles(theme));
const navigation = Object.values(ROUTE_NAV_MAP).flatMap(items => items.flatMap(item => [item, ...(item.children ?? [])]));

export function SiteBreadcrumbs() {
  const pathname = usePathname();
  const recordLabels = useBreadcrumbLabels();
  if (pathname === "/login") return null;
  const crumbs = getSiteBreadcrumbs(pathname ?? "/");
  return <Root maxWidth="xl"><Trail aria-label="Breadcrumb" separator={<Separator aria-hidden="true" />}>
    {crumbs.map((crumb, index) => {
      const icon = index === 1 && pathname?.split("/")[1] === "admin"
        ? <AdminPanelSettingsIcon color="primary" /> : navigation.find(item => item.href === crumb.href)?.Icon;
      const current = index === crumbs.length - 1;
      const content = <Current component="span" variant="body2" aria-current={current ? "page" : undefined}>
        {icon && <Icon aria-hidden="true">{icon}</Icon>}{recordLabels.get(crumb.href) ?? crumb.label}
      </Current>;
      return current ? <span key={`${index}-${crumb.href}`}>{content}</span>
        : <Ancestor key={`${index}-${crumb.href}`} component={NextLink} href={crumb.href} underline="none">{content}</Ancestor>;
    })}
  </Trail></Root>;
}
