"use client";
import { ResourceBadge as Chip, ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Typography } from "@mui/material";
import { AdminPanelSettingsOutlined, GroupsOutlined, PolicyOutlined, InfoOutlined, PaletteOutlined, DeleteOutline } from "@mui/icons-material";
import { RecordHero, RecordCard, RecordFacts, RecordMetrics } from "@/components/Tables/ResourceRecordPage";
import * as S from "@/components/Tables/resourceRecordStyles";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { formatAdminDate } from "@/lib/utils/adminDate";
import { usersApi } from "../users/api";
import { RoleBadge, UserIdentity } from "../users/UserIdentity";
import type { ApplicationRole, RoleMetadata } from "./api";

export function RoleRecordContent({ record, metadata }: { readonly record: ApplicationRole; readonly metadata: RoleMetadata }) {
  const members = useQuery({ queryKey: ["admin-roles", "members", record.id],
    queryFn: ({ signal }) => usersApi.list(0, 5, "", [{ id: "role", value: String(record.id) }], [], signal),
    enabled: record.userCount > 0, retry: false });
  const groups = Map.groupBy(record.permissions, permission => permission.subject);
  const evaluated = record.permissions.filter(permission => permission.supported).length;
  return <>
    <RecordHero eyebrow="Application role" title={record.name} description={record.description ?? "No description has been recorded for this role."} icon={<AdminPanelSettingsOutlined />} badges={<><RoleBadge role={record} /><ResourceStatusBadge active={record.isEnabled} activeLabel="Enabled" inactiveLabel="Disabled" /><Chip size="small" label={record.isProtected ? "Protected bootstrap role" : "Custom role"} /></>} />
    <RecordMetrics items={[{ label: "Assigned users", value: record.userCount }, { label: "Granted permissions", value: record.permissions.length }, { label: "Resource groups", value: groups.size }, { label: "Evaluated grants", value: evaluated }]} />
    <S.Layout><S.Main>
      <RecordCard title="Application permissions" icon={<PolicyOutlined />} description="Grants grouped by resource. Attribute and resource checks still apply.">
        {!record.isEnabled && <Alert severity="warning">This role is disabled. Review its enabled state before relying on these grants.</Alert>}
        {record.permissions.length ? <S.List>{[...groups].map(([subject, permissions]) => <S.ListItem key={subject}>
          <Typography component="h3" variant="subtitle1">{subject}</Typography>
          <S.Badges>{permissions.map(permission => <Chip key={permission.id} size="small" label={permission.action} color={permission.supported ? "primary" : "warning"} variant="outlined" />)}</S.Badges>
          {permissions.some(permission => !permission.supported) && <Typography variant="caption" color="text.secondary">Warning-colored grants are stored but not currently evaluated by the application policy.</Typography>}
        </S.ListItem>)}</S.List> : <Alert severity="info">No application permissions granted.</Alert>}
        <Typography variant="body2" color="text.secondary">{metadata.permissions.length} permission definitions are available in the catalog. Edit the role to review or change grants.</Typography>
      </RecordCard>
      <RecordCard title="Assigned accounts" icon={<GroupsOutlined />} description="The first five accounts currently assigned to this role." action={<Button color="error" component={NextLink} href="/admin/users">Manage users</Button>}>
        {record.userCount === 0 ? <Typography color="text.secondary">No users are assigned to this role.</Typography> : members.isLoading ? <ResourceTableLoading message="Loading assigned users..." /> : members.error ? <Alert severity="warning" action={<Button onClick={() => members.refetch()}>Retry</Button>}>{members.error.message}</Alert> : <S.List>{members.data?.users.map(user => <S.ListItem key={user.id}><S.Actions><UserIdentity user={user} /><ResourceStatusBadge active={!user.banned} inactiveLabel="Banned" inactiveColor="error" /></S.Actions><Typography variant="body2" color="text.secondary">{user.email}</Typography><Button component={NextLink} href={`/admin/users/${encodeURIComponent(user.id)}`}>View user</Button></S.ListItem>)}</S.List>}
      </RecordCard>
    </S.Main><S.Aside data-record-sidebar>
      <RecordCard title="Badge & identity" icon={<PaletteOutlined />}><RecordFacts items={[{ label: "Role name", value: record.name }, { label: "Icon key", value: record.icon ?? "No custom icon" }, { label: "Badge HEX", value: record.color ?? "Theme default (no custom color stored)" }]} /></RecordCard>
      <RecordCard title="Record information" icon={<InfoOutlined />}><RecordFacts items={[{ label: "Created", value: formatAdminDate(record.createdAt) }, { label: "Last updated", value: formatAdminDate(record.updatedAt) }, ]} /></RecordCard>
      <RecordCard title="Administration"><Typography variant="body2" color="text.secondary">{record.isProtected ? "The bootstrap role name, enabled state and permissions are protected. Its display metadata can be edited." : record.userCount ? "Reassign all users before deleting this role. Its audit history is retained." : "This unassigned custom role can be deleted after confirmation."}</Typography>
        {!record.isProtected && record.userCount === 0 && <Button component={NextLink} href={`/admin/roles/delete/${record.id}`} color="primary" startIcon={<DeleteOutline />}>Delete role</Button>}
      </RecordCard>
    </S.Aside></S.Layout>
  </>;
}
