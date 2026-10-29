"use client";
import { ResourceBadge as Chip, ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import { resourceViewAction } from "@/components/Tables/resourceViewAction";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Typography } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import OpenInNew from "@mui/icons-material/OpenInNew";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { ResourceTableCreateButton } from "@/components/Tables/ResourceTableCreateButton";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { ResourceDataTable } from "@/components/Tables/ResourceDataTable";
import {
  createMuiDataTableColumnHelper,
  useMuiDataTable,
  type DataTableRowAction,
} from "@/components/DataTable";
import { createExpansionColumn } from "@/components/DataTable/mui/columns/expansion";
import { createSelectionColumn } from "@/components/DataTable/mui/columns/selection";
import { createActionsColumn } from "@/components/DataTable/mui/columns/actions";
import {
  adminTableStorage,
  adminUtilityColumnPinning,
} from "../adminTablePresentation";
import { RoleBadge } from "../users/UserIdentity";
import { rolesApi, type ApplicationRole, type RoleMode } from "./api";
import { RoleEditor } from "./RoleEditor";
import { RoleDetail } from "./RoleDetail";
import * as S from "./styles";
const helper = createMuiDataTableColumnHelper<ApplicationRole>();
const EMPTY: ApplicationRole[] = [];
export function RolesPage() {
  const router = useRouter();
  const metadata = useQuery({
    queryKey: ["admin-roles", "metadata"],
    queryFn: ({ signal }) => rolesApi.metadata(signal),
    retry: false,
  });
  const roles = useQuery({
    queryKey: ["admin-roles", "list"],
    queryFn: ({ signal }) => rolesApi.list(signal),
    enabled: metadata.data?.canManage === true,
  });
  const [editor, setEditor] = useState<{ mode: RoleMode; id?: number } | null>(
    null,
  );
  const [notice, setNotice] = useState("");
  const actions = useMemo<readonly DataTableRowAction<ApplicationRole>[]>(
    () => [
      resourceViewAction<ApplicationRole>(router.push, record => `/admin/roles/${encodeURIComponent(String(record.id))}`),
      {
        id: "edit", color: "error",
        label: "Edit role",
        inline: true,
        renderIcon: () => <EditOutlined />,
        isDisabled: ({ row }) => !row.getIsSelected(),
        onClick: ({ row }) => setEditor({ mode: "edit", id: row.original.id }),
      },
      {
        id: "delete",
        label: "Delete role",
        inline: true,
        color: "primary",
        renderIcon: () => <DeleteOutline />,
        isDisabled: ({ row }) =>
          !row.getIsSelected() ||
          row.original.isProtected ||
          row.original.userCount > 0,
        onClick: ({ row }) =>
          setEditor({ mode: "delete", id: row.original.id }),
      },
      {
        id: "edit-page",
        label: "Open edit page",
        renderIcon: () => <OpenInNew />,
        onClick: ({ row }) =>
          router.push(`/admin/roles/edit/${row.original.id}`),
      },
      {
        id: "delete-page",
        label: "Open delete page",
        renderIcon: () => <OpenInNew />,
        onClick: ({ row }) =>
          router.push(`/admin/roles/delete/${row.original.id}`),
      },
    ],
    [router],
  );
  const columns = useMemo(
    () =>
      helper.columns([
        createExpansionColumn<ApplicationRole>({ showExpandAll: false }),
        createSelectionColumn<ApplicationRole>(),
        helper.accessor("name", {
          header: "Role",
          size: 200,
          cell: ({ row }) => <RoleBadge role={row.original} />,
          meta: {
            label: "Role",
            align: "center",
            headerAlign: "center",
            filterVariant: "text",
          },
        }),
        helper.accessor("description", {
          header: "Description",
          size: 320,
          cell: ({ getValue }) => getValue() || "—",
          meta: { label: "Description", filterVariant: "text" },
        }),
        helper.accessor((row) => (row.isEnabled ? "Enabled" : "Disabled"), {
          id: "status",
          header: "Status",
          size: 140,
          filterFn: "equals",
          cell: ({ getValue }) => (
            <ResourceStatusBadge active={getValue() === "Enabled"} activeLabel="Enabled" inactiveLabel="Disabled" />
          ),
          meta: {
            label: "Status",
            align: "center",
            headerAlign: "center",
            filterVariant: "select",
            filterOptions: [
              { value: "Enabled", label: "Enabled" },
              { value: "Disabled", label: "Disabled" },
            ],
          },
        }),
        helper.accessor("userCount", {
          header: "Assigned users",
          size: 140,
          enableColumnFilter: false,
          meta: {
            label: "Assigned users",
            align: "center",
            headerAlign: "center",
          },
        }),
        helper.accessor(
          (row) =>
            row.permissions
              .map((permission) => `${permission.subject} ${permission.action}`)
              .join(" "),
          {
            id: "permissions",
            header: "Permissions",
            size: 150,
            cell: ({ row }) => (
              <Chip size="small" label={row.original.permissions.length} />
            ),
            meta: {
              label: "Permissions",
              align: "center",
              headerAlign: "center",
              filterVariant: "text",
            },
          },
        ),
        helper.accessor((row) => (row.isProtected ? "Protected" : "Custom"), {
          id: "type",
          header: "Type",
          size: 150,
          cell: ({ row, getValue }) => (
            <Chip
              size="small"
              color={row.original.isProtected ? "info" : "default"}
              icon={row.original.isProtected ? <LockOutlined /> : undefined}
              label={getValue()}
            />
          ),
          filterFn: "equals",
          meta: {
            label: "Type",
            align: "center",
            headerAlign: "center",
            filterVariant: "select",
            filterOptions: [
              { value: "Protected", label: "Protected" },
              { value: "Custom", label: "Custom" },
            ],
          },
        }),
        createActionsColumn<ApplicationRole>({
          actions,
          size: 152,
          maxInlineActions: 3,
        }),
      ]),
    [actions],
  );
  const table = useMuiDataTable({
    data: roles.data ?? EMPTY,
    columns,
    getRowId: (row) => String(row.id),
    getRowCanExpand: () => true,
    enableRowSelection: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 25 },
      columnPinning: adminUtilityColumnPinning,
    },
    meta: {
      emptyContent: "No application roles yet.",
      noResultsContent: "No roles match your filters.",
    },
  });
  return (
    <ResourcePage showHeader={false}
      title="Roles"
      subtitle="Manage application roles and their policy grants. Select a role to edit or delete it."
      maxWidth="xl"
    >
      <S.Root>
        {(metadata.isLoading || roles.isLoading) && (
          <ResourceTableLoading message="Loading roles…" />
        )}
        {metadata.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => metadata.refetch()}>Retry</Button>}
          >
            {metadata.error.message}
          </Alert>
        )}
        {roles.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => roles.refetch()}>Retry</Button>}
          >
            {roles.error.message}
          </Alert>
        )}
        {notice && (
          <Alert severity="success" onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}
        {roles.data && metadata.data?.canManage && (
          <ResourceDataTable onViewRecord={record => router.push(`/admin/roles/${encodeURIComponent(String(record.id))}`)}
            resourceId="admin/roles"
            table={table}
            persistence={{
              storageId: "admin/roles",
              storage: adminTableStorage,
            }}
            refreshing={roles.isFetching}
            renderDetailPanel={({ row }) => (
              <RoleDetail record={row.original} />
            )}
            card={{
              enableSelection: true,
              enableExpansion: true,
              detailMode: "flip",
              flip: { flipOnHover: false },
              actions,
              maxInlineActions: 3,
              renderHeader: ({ row }) => <RoleBadge role={row.original} />,
              renderBody: ({ row }) => (
                <Typography variant="body2">
                  {row.original.description || "No description"}
                </Typography>
              ),
              renderMetadata: ({ row }) => (
                <S.Actions>
                  <ResourceStatusBadge active={row.original.isEnabled} activeLabel="Enabled" inactiveLabel="Disabled" />
                  <Typography variant="caption">
                    {row.original.userCount} users ·{" "}
                    {row.original.permissions.length} grants
                  </Typography>
                </S.Actions>
              ),
              renderDetail: ({ row }) => <RoleDetail record={row.original} view="card" />,
            }}
            toolbar={{
              searchPlaceholder: "Search roles…",
              startContent: (
                <ResourceTableCreateButton
                  startIcon={<AddRounded />}
                  onClick={() => setEditor({ mode: "create" })}
                >
                  Create role
                </ResourceTableCreateButton>
              ),
            }}
          />
        )}
        {editor && metadata.data && (
          <RoleEditor
            key={`${editor.mode}-${editor.id ?? "new"}`}
            {...editor}
            metadata={metadata.data}
            onClose={() => setEditor(null)}
            onSuccess={(record) => {
              if (editor.mode === "delete") {
                table.setRowSelection((previous) => {
                  const next = { ...previous };
                  delete next[String(record.id)];
                  return next;
                });
                table.setRowPinning((previous) => ({
                  top: previous.top?.filter((id) => id !== String(record.id)),
                  bottom: previous.bottom?.filter(
                    (id) => id !== String(record.id),
                  ),
                }));
              }
              setNotice(
                editor.mode === "delete"
                  ? "Role deleted. Audit history retained."
                  : "Role saved.",
              );
              setEditor(null);
            }}
          />
        )}
      </S.Root>
    </ResourcePage>
  );
}
