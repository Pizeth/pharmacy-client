"use client";
import { ShareOutlined, SettingsOutlined } from "@mui/icons-material";
import { ResourceDetailPanel, ResourceDetailSection, ResourceDetailFacts } from "@/components/Tables/ResourceDetailPanel";
import { ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import { formatAdminDate } from "@/lib/utils/adminDate";
import type { SocialProvider } from "../api";
import { ProviderWebsite } from "./ProviderWebsite";
export function SocialProviderDetail({ record, view = "table" }: { record: SocialProvider; view?: "table" | "card" }) {
  return <ResourceDetailPanel view={view}>
    <ResourceDetailSection title="Provider identity" description={record.name} icon={<ShareOutlined />}><ResourceDetailFacts items={[
      { label: "Name", value: record.name }, { label: "Key", value: record.key },
      { label: "Status", value: <ResourceStatusBadge active={record.isEnabled} activeLabel="Enabled" inactiveLabel="Disabled" /> },
    ]} /></ResourceDetailSection>
    <ResourceDetailSection title="Configuration" icon={<SettingsOutlined />}><ResourceDetailFacts items={[
      { label: "Website", value: <ProviderWebsite url={record.websiteUrl} /> }, { label: "Icon", value: record.icon || "—" },
      { label: "Created", value: formatAdminDate(record.createdAt) }, { label: "Updated", value: formatAdminDate(record.updatedAt) },
    ]} /></ResourceDetailSection>
  </ResourceDetailPanel>;
}
