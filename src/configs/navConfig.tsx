// src/config/navConfig.tsx
import RazHome from "@/components/icons/home";
import RazPeople from "@/components/icons/people";
import RazContact from "@/components/icons/contact";
import RielIcon from "@/components/icons/riel";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import FolderIcon from "@mui/icons-material/Folder";
import PublicIcon from "@mui/icons-material/Public";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

export interface NavItemType {
  label: string;
  Icon: React.ReactNode;
  color: string;
  href: string;
  children?: NavItemType[];
}

export const ROUTE_NAV_MAP: Record<string, NavItemType[]> = {
  "/hrd": [
    {
      label: "ទំព័រដើម",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "error",
      href: "/hrd",
    },
    {
      label: "អំពីអង្គភាព",
      Icon: <AccountBalanceIcon color="info" />,
      color: "info",
      href: "/hrd/about",
      children: [
        {
          label: "អំពីប្រធាននាយកដ្ឋាន",
          Icon: <SensorOccupiedIcon color="info" />,
          color: "info",
          href: "/hrd/about/director",
        },
        {
          label: "ព័ត៌មានសង្ខេបនាយកដ្ឋាន",
          Icon: <InfoOutlinedIcon color="info" />,
          color: "info",
          href: "/hrd/about/overview",
        },
        {
          label: "រចនាសម្ព័ន្ធ",
          Icon: <AccountTreeOutlinedIcon color="info" />,
          color: "info",
          href: "/hrd/about/structure",
        },
        {
          label: "ថ្នាក់ដឹកនាំ និងមន្រ្តី",
          Icon: <RazPeople color="info" />,
          color: "info",
          href: "/hrd/about/staff",
        },
      ],
    },
    {
      label: "បណ្ដុំឯកសារ",
      Icon: <FolderIcon color="secondary" />,
      color: "secondary",
      href: "/hrd/documents",
    },
    {
      label: "ព័ត៌មាន",
      Icon: <NewspaperIcon color="primary" />,
      color: "primary",
      href: "/hrd/news",
    },
    {
      label: "សេវាសាធារណៈ",
      Icon: <PublicIcon color="success" />,
      color: "success",
      href: "/hrd/services",
    },
    {
      label: "ទំនាក់ទំនង",
      Icon: <RazContact color="info" fontSize="medium" />,
      color: "info",
      href: "/hrd/contact",
    },
  ],
  // Navigation for /mcsgs routes
  "/mcsgs": [
    {
      label: "អគ្គលេខាធិការដ្ឋាន",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "error",
      href: "/mcsgs",
    },
    {
      label: "នាយកដ្ឋានរដ្ឋបាល",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "secondary",
      href: "/mcsgs/fts",
    },
    {
      label: "នាយកដ្ឋានហិរញ្ញវត្ថុ",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "primary",
      href: "/mcsgs/hrm",
    },
    {
      label: "នាយកដ្ឋានធនធានមនុស្ស",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "success",
      href: "/mcsgs/payrolls",
    },
    {
      label: "នាយកដ្ឋាននីតិកម្ម",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "info",
      href: "/mcsgs/about",
    },
    {
      label: "នាយកដ្ឋានផែនការ",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "info",
      href: "/mcsgs/about",
    },
    {
      label: "នាយកដ្ឋានផ្សព្វផ្សាយ និងទំនាក់ទំនងសាធារណៈ",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "info",
      href: "/mcsgs/about",
    },
    {
      label: "លេខាធិការដ្ឋាន",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "info",
      href: "/mcsgs/about",
    },
  ],

  // Example navigation for another route section (e.g. /dashboard or default)
  "/": [
    {
      label: "ទំព័រដើម",
      Icon: <RazHome color="error" fontSize="medium" />,
      color: "error",
      href: "/",
    },
    {
      label: "ប្រព័ន្ធចរន្តឯកសារ",
      Icon: <ContentPasteSearchIcon color="secondary" fontSize="medium" />,
      color: "secondary",
      href: "/fts",
    },
    {
      label: "ប្រព័ន្ធគ្រប់គ្រងបុគ្គលិក",
      Icon: <RazPeople color="primary" fontSize="medium" />,
      color: "primary",
      href: "/hrm",
    },
    {
      label: "ប្រព័ន្ធគ្រប់គ្រងបៀវត្ស",
      Icon: <RielIcon color="success" fontSize="medium" />,
      color: "success",
      href: "/payrolls",
    },
    {
      label: "អំពីក្រសួង",
      Icon: <RazContact color="info" fontSize="medium" />,
      color: "info",
      href: "/about",
    },
  ],
};

// Fallback items if path matches no registered section
export const DEFAULT_NAV_ITEMS: NavItemType[] = ROUTE_NAV_MAP["/"];

/** Match entire path segments, never /hrd-other or /mcsgs-other. */
export function matchesNavRoute(pathname: string, route: string): boolean {
  return (
    pathname === route || (route !== "/" && pathname.startsWith(`${route}/`))
  );
}

export function getDynamicNavItems(pathname: string): NavItemType[] {
  const section = Object.keys(ROUTE_NAV_MAP)
    .filter((route) => matchesNavRoute(pathname, route))
    .sort((a, b) => b.length - a.length)[0];
  return section ? ROUTE_NAV_MAP[section] : DEFAULT_NAV_ITEMS;
}

export function getActiveNavIndex(
  pathname: string,
  items: NavItemType[],
): number {
  let activeIndex = -1;
  let longestMatch = -1;
  items.forEach((item, index) => {
    for (const candidate of [item, ...(item.children ?? [])]) {
      if (
        matchesNavRoute(pathname, candidate.href) &&
        candidate.href.length > longestMatch
      ) {
        activeIndex = index;
        longestMatch = candidate.href.length;
      }
    }
  });
  return activeIndex;
}
