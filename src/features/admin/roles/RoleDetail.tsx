"use client";
import { ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import { AdminPanelSettingsOutlined, PolicyOutlined } from "@mui/icons-material";
import { ResourceDetailPanel, ResourceDetailSection, ResourceDetailFacts } from "@/components/Tables/ResourceDetailPanel";
import { Typography } from "@mui/material";
import type { ApplicationRole } from "./api";
import { RoleBadge } from "../users/UserIdentity";
import * as S from "./styles";
import { formatAdminDate } from "@/lib/utils/adminDate";
export function RoleDetail({ record, view = "table" }: { readonly record: ApplicationRole; readonly view?: "table" | "card" }) {
  const groups = Map.groupBy(
    record.permissions,
    (permission) => permission.subject,
  );
  return (
    <ResourceDetailPanel view={view}>
      <ResourceDetailSection title="Role & access" description={record.name} icon={<AdminPanelSettingsOutlined />}>
        <ResourceDetailFacts items={[
          { label: "Role", value: <RoleBadge role={record} /> },
          { label: "Status", value: <ResourceStatusBadge active={record.isEnabled} activeLabel="Enabled" inactiveLabel="Disabled" /> },
          { label: "Description", value: record.description || "—" },
          { label: "Assigned users", value: record.userCount },
          { label: "Updated", value: formatAdminDate(record.updatedAt) },
          { label: "Role type", value: record.isProtected ? "Protected bootstrap role" : "Custom role" },
        ]} />
      </ResourceDetailSection>
      <ResourceDetailSection title="Application permissions" description={`${record.permissions.length} grants`} icon={<PolicyOutlined />}>
      {record.permissions.length === 0 ? (
        <Typography color="text.secondary">
          No application permissions granted.
        </Typography>
      ) : (
        <S.Permissions>
          {[...groups].map(([subject, permissions]) => (
            <section key={subject}>
              <Typography variant="subtitle2">{subject}</Typography>
              <S.PermissionList>
                {permissions.map((permission) => (
                  <li key={permission.id}>
                    {permission.action}
                    {permission.supported
                      ? ""
                      : " · not currently evaluated by the policy"}
                  </li>
                ))}
              </S.PermissionList>
            </section>
          ))}
        </S.Permissions>
      )}
      </ResourceDetailSection>
    </ResourceDetailPanel>
  );
}
