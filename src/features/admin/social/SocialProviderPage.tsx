"use client";
import { ResourceStatusBadge } from "@/components/Tables/ResourceBadge";
import { resourceViewAction } from "@/components/Tables/resourceViewAction";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Typography } from "@mui/material";
import { AddRounded, DeleteOutline, EditOutlined, OpenInNew } from "@mui/icons-material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { ResourceTableCreateButton } from "@/components/Tables/ResourceTableCreateButton";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { ResourceDataTable } from "@/components/Tables/ResourceDataTable";
import { useMuiDataTable, type DataTableBulkAction, type DataTableCardConfig, type DataTableRowAction } from "@/components/DataTable";
import { socialApi, type SocialProvider } from "./api";
import { useAdminAccess } from "./useAdminAccess";
import { SocialProviderDialog } from "./forms/SocialProviderDialog";
import type { ProviderFormMode } from "./forms/SocialProviderForm";
import { providerColumns } from "./table/providerColumns";
import { SocialProviderDetail } from "./table/SocialProviderDetail";
import { ProviderWebsite } from "./table/ProviderWebsite";
import { adminTableStorage, adminUtilityColumnPinning } from "../adminTablePresentation";
import * as S from "./styles";

const EMPTY_PROVIDERS: SocialProvider[] = [];
type Editor = { mode: ProviderFormMode; record?: SocialProvider };
export function SocialProviderPage() {
  const access = useAdminAccess();
  const router = useRouter();
  const providers = useQuery({ queryKey: ["admin-social", "providers"], queryFn: ({ signal }) => socialApi.providers(signal), enabled: access.allowed });
  const [editor, setEditor] = useState<Editor | null>(null);
  const [notice, setNotice] = useState("");
  const rowActions = useMemo<readonly DataTableRowAction<SocialProvider>[]>(() => [
      resourceViewAction<SocialProvider>(router.push, record => `/admin/social-provider/${encodeURIComponent(String(record.id))}`),
    { id: "edit", label: "Edit", color: "error", inline: true, renderIcon: () => <EditOutlined fontSize="small" />, isDisabled: ({ row }) => !row.getIsSelected(), onClick: ({ row }) => setEditor({ mode: "edit", record: row.original }) },
    { id: "delete", label: "Delete", color: "primary", inline: true, renderIcon: () => <DeleteOutline fontSize="small" />, isDisabled: ({ row }) => !row.getIsSelected(), onClick: ({ row }) => setEditor({ mode: "delete", record: row.original }) },
    { id: "edit-page", label: "Open edit page", renderIcon: () => <OpenInNew fontSize="small" />, onClick: ({ row }) => router.push(`/admin/social-provider/edit/${row.original.id}`) },
    { id: "delete-page", label: "Open delete page", renderIcon: () => <OpenInNew fontSize="small" />, onClick: ({ row }) => router.push(`/admin/social-provider/delete/${row.original.id}`) },
  ], [router]);
  const columns = useMemo(() => providerColumns(rowActions), [rowActions]);
  const table = useMuiDataTable({
    data: providers.data ?? EMPTY_PROVIDERS, columns, getRowId: row => String(row.id),
    getRowCanExpand: () => true, enableGlobalFilter: true, enableSorting: true,
    enableColumnFilters: true, enableRowSelection: true, enableRowPinning: true, keepPinnedRows: false,
    initialState: { pagination: { pageIndex: 0, pageSize: 25 }, columnPinning: adminUtilityColumnPinning },
    meta: { emptyContent: "No social providers yet.", noResultsContent: "No providers match your search." },
  });
  const card = useMemo<DataTableCardConfig<SocialProvider>>(() => ({
    renderDetail: ({ row }) => <SocialProviderDetail record={row.original} view="card" />,
    detailMode: "flip", flip: { flipOnHover: false }, enableSelection: true, enableExpansion: true,
    actions: rowActions, maxInlineActions: 3,
    renderHeader: ({ row }) => <><Typography variant="subtitle2">{row.original.name}</Typography><Typography variant="caption">{row.original.key}</Typography></>,
    renderBody: ({ row }) => <ResourceStatusBadge active={row.original.isEnabled} activeLabel="Enabled" inactiveLabel="Disabled" />,
    renderMetadata: ({ row }) => <Typography variant="caption"><ProviderWebsite url={row.original.websiteUrl} /></Typography>,
  }), [rowActions]);
  const selectionActions = useMemo<readonly DataTableBulkAction<SocialProvider>[]>(() => [
    { id: "edit-selected", label: "Edit selected", color: "error", renderIcon: () => <EditOutlined />, isDisabled: ({ selectedCount, selectedRows }) => selectedCount !== 1 || selectedRows.length !== 1, onClick: ({ selectedRows }) => { if (selectedRows.length === 1) setEditor({ mode: "edit", record: selectedRows[0].original }); } },
    { id: "delete-selected", label: "Delete selected", color: "primary", renderIcon: () => <DeleteOutline />, isDisabled: ({ selectedCount, selectedRows }) => selectedCount !== 1 || selectedRows.length !== 1, onClick: ({ selectedRows }) => { if (selectedRows.length === 1) setEditor({ mode: "delete", record: selectedRows[0].original }); } },
  ], []);

  return <ResourcePage showHeader={false} title="Social providers" subtitle="Manage platforms, metadata and availability. Select a row to edit or delete it." maxWidth="xl"><S.Root>
    {access.isLoading ? <ResourceTableLoading message="Loading social providers…" /> : !access.allowed ? <Alert severity="error">Administrator access is required.</Alert> : <>
      {providers.isLoading && <ResourceTableLoading message="Loading social providers…" />}
      {providers.error && <Alert severity="error" action={<Button onClick={() => providers.refetch()}>Retry</Button>}>{providers.error.message}</Alert>}
      {notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}
      {providers.data && <ResourceDataTable onViewRecord={record => router.push(`/admin/social-provider/${encodeURIComponent(String(record.id))}`)} resourceId="admin/social-providers" persistence={{ storageId: "admin/social-providers", storage: adminTableStorage }} table={table} card={card}
        refreshing={providers.isFetching && !providers.isLoading}
        rowPinning={{ displayMode: "select-sticky" }}
        selectionBar={{ clearable: true, actions: selectionActions }}
        toolbar={{ searchPlaceholder: "Search social providers…", startContent: <S.Actions><ResourceTableCreateButton color="error" startIcon={<AddRounded />} onClick={() => setEditor({ mode: "create" })}>Create provider</ResourceTableCreateButton></S.Actions> }}
        renderDetailPanel={({ row }) => <SocialProviderDetail record={row.original} />}
      />}
      {editor && <SocialProviderDialog key={`${editor.mode}-${editor.record?.id ?? "new"}`} {...editor} onClose={() => setEditor(null)} onSuccess={record => {
        if (editor.mode === "delete") {
          table.setRowSelection(previous => { const next = { ...previous }; delete next[String(record.id)]; return next; });
          table.setRowPinning(previous => ({ top: previous.top?.filter(id => id !== String(record.id)), bottom: previous.bottom?.filter(id => id !== String(record.id)) }));
        }
        setNotice(`${editor.mode === "delete" ? "Deleted" : "Saved"} provider: ${record.name}`); setEditor(null);
      }} />}
    </>}
  </S.Root></ResourcePage>;
}
