import { getDynamicNavItems, matchesNavRoute } from "@/configs/navConfig";
import { HRD_SITE } from "@/features/hrd/data/siteInfo";
import type { PublicDocumentsContactInfo, PublicDocumentsSiteInfo } from "@/features/hrd/types/publicDocuments.types";

const sharedContact = { address: HRD_SITE.contact.address, hours: HRD_SITE.contact.hours };

const ministry: PublicDocumentsSiteInfo = {
  name: "ក្រសួងមុខងារសាធារណៈ",
  tagline: "Ministry of Civil Service",
  organization: "ក្រសួងមុខងារសាធារណៈ",
  contact: sharedContact,
};
const admin: PublicDocumentsSiteInfo = {
  name: "រដ្ឋបាលប្រព័ន្ធ",
  tagline: "ក្រសួងមុខងារសាធារណៈ • System Administration",
  organization: ministry.organization,
  contact: sharedContact,
};

/** Keep route boundaries consistent with navigation, including nested pages. */
export function getSiteFooterConfig(pathname: string, adminContact?: PublicDocumentsContactInfo) {
  if (matchesNavRoute(pathname, "/hrd")) return { site: HRD_SITE, links: undefined };
  if (matchesNavRoute(pathname, "/admin")) return {
    site: { ...admin, contact: { ...adminContact, ...sharedContact } },
    links: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/social-provider", label: "Social providers" },
      { href: "/admin/documents", label: "ឯកសារ" },
      { href: "/admin/i18n", label: "ការបកប្រែ" },
    ],
  };
  const section = getDynamicNavItems("/").find(item => item.href !== "/" && matchesNavRoute(pathname, item.href));
  const site = matchesNavRoute(pathname, "/mcsgs")
    ? { ...ministry, name: "អគ្គលេខាធិការដ្ឋាន", tagline: "ក្រសួងមុខងារសាធារណៈ • General Secretariat" }
    : section ? { ...ministry, name: section.label } : ministry;
  return { site, links: getDynamicNavItems(pathname).map(({ href, label }) => ({ href, label })) };
}
