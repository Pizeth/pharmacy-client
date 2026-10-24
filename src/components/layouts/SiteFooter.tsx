"use client";

import { usePathname } from "next/navigation";
import { HrdFooter } from "@/features/hrd/components/footer/HrdFooter";
import { getSiteFooterConfig } from "./siteFooterConfig";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/types/constants";
import { matchesNavRoute } from "@/configs/navConfig";
import type { PublicDocumentsContactInfo } from "@/features/hrd/types/publicDocuments.types";

interface AdminContact { name: string; email?: string | null; phone?: string | null; telegram?: string | null }

export function toFooterContact(contact?: AdminContact | null): PublicDocumentsContactInfo {
  if (!contact) return {};
  return {
    email: contact.email || undefined,
    phones: contact.phone ? [{ name: contact.name, number: contact.phone, telegram: contact.telegram || undefined }] : undefined,
    person: !contact.phone && contact.telegram ? { name: contact.name, telegram: contact.telegram } : undefined,
  };
}

export function SiteFooter() {
  const pathname = usePathname();
  const { data } = useQuery<AdminContact | null>({
    queryKey: ["site-footer", "super-admin-contact"],
    enabled: matchesNavRoute(pathname ?? "/", "/admin"),
    staleTime: 5 * 60 * 1000,
    retry: false,
    queryFn: async ({ signal }) => {
      const response = await fetch(`${API_URL.replace(/\/$/, "")}/users/contact/super-admin`, { credentials: "include", signal });
      if (!response.ok) throw new Error("Unable to load administrator contact");
      return response.json();
    },
  });
  return <HrdFooter {...getSiteFooterConfig(pathname ?? "/", toFooterContact(data))} />;
}
