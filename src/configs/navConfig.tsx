// src/config/navConfig.tsx
import RazHome from "@/components/icons/home";
import RazPeople from "@/components/icons/people";
import RazContact from "@/components/icons/contact";
import RielIcon from "@/components/icons/riel";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";

export interface NavItemType {
  label: string;
  Icon: React.ReactNode;
  color: string;
  href: string;
}

export const ROUTE_NAV_MAP: Record<string, NavItemType[]> = {
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
export const DEFAULT_NAV_ITEMS: NavItemType[] = ROUTE_NAV_MAP["/mcsgs"];
