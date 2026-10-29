"use client";
import { ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import { resourceViewAction } from "@/components/Tables/resourceViewAction";
import type { ColumnFiltersState, SortingState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Alert, Button, Typography } from "@mui/material";
import { PersonAddOutlined, AddRounded, DeleteOutline, EditOutlined, OpenInNew } from "@mui/icons-material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { ResourceTableCreateButton } from "@/components/Tables/ResourceTableCreateButton";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { ResourceDataTable } from "@/components/Tables/ResourceDataTable";
import { FormDialog } from "@/components/forms/FormDialog";
import { createMuiDataTableColumnHelper, useMuiDataTable, type DataTableRowAction } from "@/components/DataTable";
import { createExpansionColumn } from "@/components/DataTable/mui/columns/expansion";
import { RoleBadge, UserIdentity, findRole } from "./UserIdentity";
import { UserDetailPanel } from "./UserDetailPanel";
import { createSelectionColumn } from "@/components/DataTable/mui/columns/selection";
import { createActionsColumn } from "@/components/DataTable/mui/columns/actions";
import { useAdminAccess } from "../social/useAdminAccess";
import { usersApi, type AdminUser, type UserMode } from "./api";
import { UserEditorForm } from "./UserEditorForm";
import { adminTableStorage, adminUtilityColumnPinning } from "../adminTablePresentation";
import * as S from "../social/styles";
const helper = createMuiDataTableColumnHelper<AdminUser>();
const EMPTY: AdminUser[] = [];
export function UsersPage() {
  const access = useAdminAccess();
  const router = useRouter();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editor, setEditor] = useState<{ mode: UserMode; record?: AdminUser } | null>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const roles = useQuery({ queryKey: ["admin-users", "roles"], queryFn: ({ signal }) => usersApi.roles(signal), enabled: access.allowed });
  const users = useQuery({ queryKey: ["admin-users", pagination, search, columnFilters, sorting], queryFn: ({ signal }) => usersApi.list(pagination.pageIndex, pagination.pageSize, search, columnFilters, sorting, signal), enabled: access.allowed, placeholderData: keepPreviousData });
  if (users.data && !users.isPlaceholderData && pagination.pageIndex > 0 && pagination.pageIndex * pagination.pageSize >= users.data.total) {
    const pageIndex = Math.max(0, Math.ceil(users.data.total / pagination.pageSize) - 1);
    setPagination(previous => ({ ...previous, pageIndex }));
  }
  const actions = useMemo<readonly DataTableRowAction<AdminUser>[]>(() => [
      resourceViewAction<AdminUser>(router.push, record => `/admin/users/${encodeURIComponent(String(record.id))}`),
    { id: "edit", color: "error", label: "Edit user", inline: true, renderIcon: () => <EditOutlined />, isDisabled: ({ row }) => !row.getIsSelected(), onClick: ({ row }) => setEditor({ mode: "edit", record: row.original }) },
    { id: "delete", label: "Delete user", inline: true, color: "primary", renderIcon: () => <DeleteOutline />, isDisabled: ({ row }) => !row.getIsSelected() || row.id === String(access.data?.id), onClick: ({ row }) => setEditor({ mode: "delete", record: row.original }) },
    { id: "edit-page", label: "Open edit page", renderIcon: () => <OpenInNew />, onClick: ({ row }) => { router.push(`/admin/users/edit/${encodeURIComponent(row.id)}`); } },
  ], [access.data?.id, router]);
  const columns = useMemo(() => helper.columns([
    createExpansionColumn<AdminUser>({ showExpandAll: false }),
    createSelectionColumn<AdminUser>(),
    helper.accessor("name", { header: "Name", meta: { label: "Name", filterLabel: "Name", filterVariant: "text" }, cell: ({ row }) => <UserIdentity user={row.original} /> }), helper.accessor("email", { header: "Email", meta: { label: "Email", filterLabel: "Email", filterVariant: "text" } }),
    helper.accessor("role", { header: "Role", cell: context => <RoleBadge role={findRole(roles.data, context.getValue(), context.row.original.roleId)} fallback={context.getValue()} />, meta: { label: "Role", filterLabel: "Role", filterOptionsLoading: roles.isLoading, filterOptionsError: roles.error?.message, align: "center", headerAlign: "center", filterVariant: "select", filterOptions: (roles.data ?? []).map(role => ({ value: String(role.id), label: role.name })) } }),
    helper.accessor("banned", { header: "Status", cell: context => <ResourceStatusBadge active={!context.getValue()} inactiveLabel="Banned" inactiveColor="error" />, meta: { label: "Status", filterLabel: "Status", align: "center", headerAlign: "center", filterVariant: "select", filterOptions: [{ value: "false", label: "Active" }, { value: "true", label: "Banned" }] } }),
    createActionsColumn<AdminUser>({ actions, size: 152, maxInlineActions: 3 }),
  ]), [actions, roles.data, roles.isLoading, roles.error]);
  const table = useMuiDataTable({ data: users.data?.users ?? EMPTY, columns, getRowId: row => row.id,
    getRowCanExpand: () => true, enableRowSelection: true, enableGlobalFilter: true, manualFiltering: true, manualPagination: true,
    enableColumnFilters: true, enableSorting: true, manualSorting: true, rowCount: users.data?.total ?? 0,
    initialState: { columnPinning: adminUtilityColumnPinning },
    state: { pagination, globalFilter: search, columnFilters, sorting }, onPaginationChange: setPagination,
    onColumnFiltersChange: updater => { setColumnFilters(updater); setPagination(previous => ({ ...previous, pageIndex: 0 })); },
    onSortingChange: updater => { setSorting(updater); setPagination(previous => ({ ...previous, pageIndex: 0 })); },
    onGlobalFilterChange: updater => { setSearch(previous => typeof updater === "function" ? updater(previous) : String(updater ?? "")); setPagination(previous => ({ ...previous, pageIndex: 0 })); },
    meta: { emptyContent: "No users found.", noResultsContent: "No users match your search." },
  });
  const back = () => { if (!pending) setEditor(null); };
  return <ResourcePage showHeader={false} title="Users" subtitle="Manage accounts. Select a user to edit or delete. Search by name, email or username." maxWidth="xl"><S.Root>
    {access.isLoading ? <ResourceTableLoading message="Loading users…" /> : !access.allowed ? <Alert severity="error">Administrator access is required.</Alert> : <>
      {users.isLoading && <ResourceTableLoading message="Loading users…" />}
      {users.error && <Alert severity="error" action={<Button onClick={() => users.refetch()}>Retry</Button>}>{users.error.message}</Alert>}
      {roles.error && <Alert severity="warning" action={<Button onClick={() => roles.refetch()}>Retry</Button>}>Role display metadata could not be loaded. Default badges are shown.</Alert>}
      {notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}
      {users.data && <ResourceDataTable onViewRecord={record => router.push(`/admin/users/${encodeURIComponent(String(record.id))}`)} resourceId="admin/users" persistence={{ storageId: "admin/users", storage: adminTableStorage }} table={table} refreshing={users.isFetching}
        renderDetailPanel={({ row }) => <UserDetailPanel user={row.original} />}
        card={{ renderDetail: ({ row }) => <UserDetailPanel user={row.original} view="card" />, enableSelection: true, enableExpansion: true, maxInlineActions: 3, detailMode: "flip", flip: { flipOnHover: false }, actions, renderHeader: ({ row }) => <UserIdentity user={row.original} />, renderBody: ({ row }) => <Typography>{row.original.email}</Typography>, renderMetadata: ({ row }) => <S.Actions><RoleBadge role={findRole(roles.data, row.original.role, row.original.roleId)} fallback={row.original.role} /><ResourceStatusBadge active={!row.original.banned} inactiveLabel="Banned" inactiveColor="error" /></S.Actions> }}
        toolbar={{ searchPlaceholder: "Search users…", startContent: <S.Actions><ResourceTableCreateButton startIcon={<AddRounded />} onClick={() => setEditor({ mode: "create" })}>Create user</ResourceTableCreateButton></S.Actions> }} />}
      {editor && <FormDialog open title={`${editor.mode === "create" ? "Create" : editor.mode === "edit" ? "Edit" : "Delete"} user`} pending={pending} onClose={back} icon={editor.mode === "create" ? <PersonAddOutlined /> : editor.mode === "edit" ? <EditOutlined /> : <DeleteOutline />}
        dedicatedPageHref={`/admin/users/${editor.mode}${editor.record ? `/${encodeURIComponent(editor.record.id)}` : ""}`} dedicatedPageLabel={`Open dedicated ${editor.mode} page`}>
        <UserEditorForm key={`${editor.mode}-${editor.record?.id ?? "new"}`} {...editor} onCancel={back} onPendingChange={setPending} onSuccess={() => {
          if (editor.mode === "delete" && editor.record) table.setRowSelection(previous => { const next = { ...previous }; delete next[editor.record!.id]; return next; });
          setPending(false); setEditor(null); setNotice(editor.mode === "delete" ? "User deleted successfully." : "User saved successfully.");
        }} />
      </FormDialog>}
    </>}
  </S.Root></ResourcePage>;
}
