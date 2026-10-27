"use client";
import { Chip, Typography } from "@mui/material";
import type { ApplicationRole } from "./api";
import { RoleBadge } from "../users/UserIdentity";
import * as S from "./styles";
export function RoleDetail({ record }: { readonly record: ApplicationRole }) {
  const groups = Map.groupBy(
    record.permissions,
    (permission) => permission.subject,
  );
  return (
    <S.Root>
      <S.Actions>
        <RoleBadge role={record} />
        <Chip
          size="small"
          color={record.isEnabled ? "success" : "default"}
          label={record.isEnabled ? "Enabled" : "Disabled"}
        />
      </S.Actions>
      <S.Facts>
        {[
          ["Description", record.description || "—"],
          ["Assigned users", String(record.userCount)],
          ["Version", String(record.objectVersionId)],
          ["Updated", new Date(record.updatedAt).toLocaleString()],
          [
            "Role type",
            record.isProtected ? "Protected bootstrap role" : "Custom role",
          ],
        ].map(([label, value]) => (
          <S.Fact key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </S.Fact>
        ))}
      </S.Facts>
      <Typography component="h3" variant="h6">
        Application permissions ({record.permissions.length})
      </Typography>
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
    </S.Root>
  );
}
