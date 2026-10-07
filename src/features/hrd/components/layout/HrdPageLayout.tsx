"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled } from "@mui/material/styles";
import { ROUTE_NAV_MAP } from "@/configs/navConfig";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { ABOUT_PAGES } from "../../data/aboutContent";
import { hrdSlot } from "../../styles/styled";

const PageRoot = styled(Container, hrdSlot("PageContainer"))({});

export function HrdPageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <PageRoot maxWidth="xl" className={className}>
      {children}
    </PageRoot>
  );
}

const BreadcrumbRoot = styled(
  Container,
  hrdSlot("BreadcrumbContainer"),
)(({ theme }) => ({ marginTop: theme.spacing(1.5) }));
const BreadcrumbTrail = styled(
  Breadcrumbs,
  hrdSlot("Breadcrumbs"),
)(({ theme }) => ({
  ...theme.typography.body2,
  "& a": { color: "inherit", textDecoration: "none" },
  "& .MuiBreadcrumbs-ol": { rowGap: theme.spacing(0.5) },
  "& .MuiBreadcrumbs-separator": { marginInline: theme.spacing(0.5) },
}));
const BreadcrumbItem = styled(
  Typography,
  hrdSlot("BreadcrumbItem"),
)<TypographyProps>(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.75),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  color: (theme.vars ?? theme).palette.text.secondary,
  transition: theme.transitions.create(["background-color", "box-shadow"]),
  "a &:hover": { backgroundColor: (theme.vars ?? theme).palette.action.hover },
  "a:focus-visible &": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
  '&[aria-current="page"]': {
    color: (theme.vars ?? theme).palette.text.primary,
    backgroundColor: (theme.vars ?? theme).palette.action.selected,
    boxShadow: `inset 0 -2px ${(theme.vars ?? theme).palette.primary.main}`,
  },
}));
const BreadcrumbIcon = styled(
  "span",
  hrdSlot("BreadcrumbIcon"),
)(({ theme }) => ({
  display: "inline-flex",
  flexShrink: 0,
  "& .MuiSvgIcon-root": { fontSize: theme.typography.pxToRem(18) },
}));
const BreadcrumbSeparator = styled(
  ChevronRightIcon,
  hrdSlot("BreadcrumbSeparator"),
)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  color: (theme.vars ?? theme).palette.text.disabled,
}));
const navigationItems = ROUTE_NAV_MAP["/hrd"].flatMap((item) => [
  item,
  ...(item.children ?? []),
]);

const labels: Record<string, string> = {
  about: "អំពីអង្គភាព",
  documents: "បណ្ដុំឯកសារ",
  contact: "ទំនាក់ទំនង",
  news: "ព័ត៌មាន",
  services: "សេវាសាធារណៈ",
  ...Object.fromEntries(
    Object.entries(ABOUT_PAGES).map(([key, page]) => [key, page.title]),
  ),
};

export function HrdBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).slice(1);
  const crumbs = [
    { href: "/hrd", label: "ទំព័រដើម" },
    ...segments.map((segment, index) => ({
      href: `/hrd/${segments.slice(0, index + 1).join("/")}`,
      label: labels[segment] ?? decodeURIComponent(segment),
    })),
  ];
  return (
    <BreadcrumbRoot maxWidth="xl">
      <BreadcrumbTrail
        aria-label="ទីតាំងទំព័រ"
        separator={<BreadcrumbSeparator aria-hidden="true" />}
      >
        {crumbs.map((crumb, index) => {
          const icon = navigationItems.find(
            (item) => item.href === crumb.href,
          )?.Icon;
          const current = index === crumbs.length - 1;
          const content = (
            <BreadcrumbItem
              component="span"
              variant="body2"
              aria-current={current ? "page" : undefined}
            >
              {icon && (
                <BreadcrumbIcon aria-hidden="true">{icon}</BreadcrumbIcon>
              )}
              {crumb.label}
            </BreadcrumbItem>
          );
          return current ? (
            <span key={crumb.href}>{content}</span>
          ) : (
            <Link key={crumb.href} href={crumb.href}>
              {content}
            </Link>
          );
        })}
      </BreadcrumbTrail>
    </BreadcrumbRoot>
  );
}

export const HrdDocumentsPageRoot = styled(
  ResourcePage,
  hrdSlot("DocumentsPage"),
)(({ theme }) => ({
  marginTop: 0,
  [theme.breakpoints.down("sm")]: { marginTop: 0 },
}));
