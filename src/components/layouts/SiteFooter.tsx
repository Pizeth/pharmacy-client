"use client";

import { usePathname } from "next/navigation";
import { HrdFooter } from "@/features/hrd/components/footer/HrdFooter";
import { getSiteFooterConfig } from "./siteFooterConfig";
import { useQuery } from "@tanstack/react-query";
import { socialApi, safeSocialUrl, type AdminContact } from "@/features/admin/social/api";
import { matchesNavRoute } from "@/configs/navConfig";
import type { PublicDocumentsContactInfo } from "@/features/hrd/types/publicDocuments.types";

export function toFooterContact(contact?: { name: string; email?: string | null; phone?: string | null; telegram?: string | null; socialProfiles?: NonNullable<AdminContact>["socialProfiles"] } | null): PublicDocumentsContactInfo {
  if (!contact) return {};
  const telegram = safeSocialUrl(contact.socialProfiles?.find(profile => profile.provider.isEnabled && profile.provider.key.toLowerCase() === "telegram")?.url) ?? contact.telegram ?? undefined;
  return {
    email: contact.email || undefined,
    phones: contact.phone ? [{ name: contact.name, number: contact.phone, telegram }] : undefined,
    person: !contact.phone && telegram ? { name: contact.name, telegram } : undefined,
  };
}

export function SiteFooter() {
  const pathname = usePathname();
  const isAdmin = matchesNavRoute(pathname ?? "/", "/admin");
  const { data } = useQuery({
    queryKey: ["site-footer", "super-admin-contact"],
    enabled: isAdmin,
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: ({ signal }) => socialApi.contact(signal),
  });
  return <HrdFooter {...getSiteFooterConfig(pathname ?? "/", toFooterContact(data))} />;
}
