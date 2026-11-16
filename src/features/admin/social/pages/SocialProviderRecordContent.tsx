"use client";
import { ResourceBadge as Chip, ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import NextLink from "next/link";
import { Alert, Button, Link, Typography } from "@mui/material";
import { ShareOutlined, LanguageOutlined, SettingsOutlined, InfoOutlined, DeleteOutline } from "@mui/icons-material";
import { RecordHero, RecordCard, RecordFacts } from "@/components/Tables/ResourceRecordPage";
import * as S from "@/components/Tables/resourceRecordStyles";
import { formatAdminDate } from "@/lib/utils/adminDate";
import { safeSocialUrl, type SocialProvider } from "../api";

export function SocialProviderRecordContent({ record }: { readonly record: SocialProvider }) {
  const href = safeSocialUrl(record.websiteUrl);
  const host = href ? new URL(href).hostname : null;
  return <>
    <RecordHero eyebrow="Social platform" title={record.name} description="Platform identity, public website and profile availability." icon={<ShareOutlined />} badges={<><ResourceStatusBadge active={record.isEnabled} activeLabel="Enabled" inactiveLabel="Disabled" /><Chip size="small" color="info" variant="outlined" label={record.key} /></>} />
    <S.Layout><S.Main>
      <RecordCard title="Provider configuration" icon={<SettingsOutlined />} description="The stored identity used to associate social profiles with this platform."><RecordFacts items={[{ label: "Display name", value: record.name }, { label: "Provider key", value: record.key }, { label: "Icon identifier", value: record.icon || "No custom icon" }, { label: "Availability", value: <ResourceStatusBadge active={record.isEnabled} activeLabel="Enabled" inactiveLabel="Disabled" /> }]} /></RecordCard>
      <RecordCard title="Public website" icon={<LanguageOutlined />}>
        {href ? <><RecordFacts items={[{ label: "Domain", value: host }, { label: "Protocol", value: new URL(href).protocol.replace(":", "").toUpperCase() }, { label: "Website URL", value: <Link href={href} target="_blank" rel="noopener noreferrer">{record.websiteUrl}</Link>, wide: true }]} /><S.Actions><Button href={href} target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<LanguageOutlined />}>Visit website</Button></S.Actions></> : <Alert severity="info">No valid HTTP or HTTPS website is recorded. Add one from the edit page to make it available as a link.</Alert>}
      </RecordCard>
      <RecordCard title="Availability & usage" icon={<ShareOutlined />}>
        <Alert severity={record.isEnabled ? "success" : "warning"}>{record.isEnabled ? "This provider is enabled for features that display available social platforms." : "This provider is disabled. Stored profile links remain attached to it."}</Alert>
        <S.Prose variant="body2" color="text.secondary">Social profiles and sign-in accounts are separate records. Enabling this platform does not configure OAuth or create a sign-in connection.</S.Prose>
        <Typography variant="body2" color="text.secondary">The current provider API does not report a usage count. Existing profile references prevent deletion; disable the provider when it needs to remain referenced.</Typography>
      </RecordCard>
    </S.Main><S.Aside data-record-sidebar>
      <RecordCard title="Record information" icon={<InfoOutlined />}><RecordFacts items={[{ label: "Created", value: record.createdAt ? formatAdminDate(record.createdAt) : "Date not provided" }, { label: "Last updated", value: record.updatedAt ? formatAdminDate(record.updatedAt) : "Date not provided" }]} /></RecordCard>
      <RecordCard title="Manage provider"><Typography variant="body2" color="text.secondary">Change the name, icon, website or availability from the edit page. Deletion has a separate confirmation and is blocked while profiles reference this provider.</Typography><Button component={NextLink} href={`/admin/social-provider/delete/${record.id}`} color="primary" startIcon={<DeleteOutline />}>Delete provider</Button></RecordCard>
    </S.Aside></S.Layout>
  </>;
}
