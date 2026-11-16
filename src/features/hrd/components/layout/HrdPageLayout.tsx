"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs, Container, Typography } from "@mui/material";
import type { TypographyProps } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled } from "@mui/material/styles";
import { ROUTE_NAV_MAP } from "@/configs/navConfig";
import { ABOUT_PAGES } from "../../data/aboutContent";
import { breadcrumbRootStyles, breadcrumbTrailStyles, breadcrumbItemStyles, breadcrumbIconStyles, breadcrumbSeparatorStyles } from "@/components/layouts/breadcrumbStyles";
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

const BreadcrumbRoot = styled(Container, hrdSlot("BreadcrumbContainer"))(({ theme }) => breadcrumbRootStyles(theme));
const BreadcrumbTrail = styled(Breadcrumbs, hrdSlot("Breadcrumbs"))(({ theme }) => breadcrumbTrailStyles(theme));
const BreadcrumbItem = styled(Typography, hrdSlot("BreadcrumbItem"))<TypographyProps>(({ theme }) => breadcrumbItemStyles(theme));
const BreadcrumbIcon = styled("span", hrdSlot("BreadcrumbIcon"))(({ theme }) => breadcrumbIconStyles(theme));
const BreadcrumbSeparator = styled(ChevronRightIcon, hrdSlot("BreadcrumbSeparator"))(({ theme }) => breadcrumbSeparatorStyles(theme));
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
  PageRoot,
  hrdSlot("DocumentsPage"),
)(({ theme }) => ({
  marginTop: 0,
  paddingBlock: theme.spacing(3),
  [theme.breakpoints.down("sm")]: { marginTop: 0 },
}));
