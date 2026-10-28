"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnFiltersState, SortingState } from "@tanstack/table-core";
import { Alert, Button, Typography } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import ArchiveOutlined from "@mui/icons-material/ArchiveOutlined";
import OpenInNew from "@mui/icons-material/OpenInNew";
import RouteOutlined from "@mui/icons-material/RouteOutlined";
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
} from "../admin/adminTablePresentation";
import {
  activeStep,
  documentReference,
  type TrackedDocument,
} from "./contracts";
import { trackingApi } from "./api";
import { DocumentDetail } from "./DocumentDetail";
import { DocumentStatus, formatTrackingDate } from "./DocumentProgress";
import { TrackingEditor, type TrackingEditorState } from "./TrackingEditor";
import * as S from "./styles";
const helper = createMuiDataTableColumnHelper<TrackedDocument>();
const EMPTY: TrackedDocument[] = [];
export function TrackingPage() {
  const router = useRouter();
  const metadata = useQuery({
    queryKey: ["document-tracking", "metadata"],
    queryFn: ({ signal }) => trackingApi.metadata(signal),
  });
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editor, setEditor] = useState<TrackingEditorState | null>(null);
  const [notice, setNotice] = useState("");
  const documents = useQuery({
    queryKey: [
      "document-tracking",
      "list",
      pagination,
      search,
      filters,
      sorting,
    ],
    queryFn: ({ signal }) =>
      trackingApi.list(
        pagination.pageIndex,
        pagination.pageSize,
        search,
        filters,
        sorting,
        signal,
      ),
    enabled: !!metadata.data,
    placeholderData: keepPreviousData,
    refetchInterval: 15_000,
  });
  // Adjust only after a fresh response proves this page no longer exists.
  if (
    documents.data &&
    !documents.isPlaceholderData &&
    pagination.pageIndex > 0 &&
    pagination.pageIndex * pagination.pageSize >= documents.data.total
  ) {
    setPagination({
      ...pagination,
      pageIndex: Math.max(
        0,
        Math.ceil(documents.data.total / pagination.pageSize) - 1,
      ),
    });
  }
  const actions = useMemo<readonly DataTableRowAction<TrackedDocument>[]>(
    () => [
      {
        id: "progress",
        label: "Update progress",
        inline: true,
        color: "info",
        renderIcon: () => <RouteOutlined />,
        isDisabled: ({ row }) =>
          !row.getIsSelected() ||
          !row.original.permissions.canUpdateProgress ||
          row.original.status === "CANCELLED",
        onClick: ({ row }) =>
          setEditor({ mode: "progress", id: row.original.id }),
      },
      {
        id: "edit",
        label: "Edit document",
        inline: true,
        renderIcon: () => <EditOutlined />,
        isDisabled: ({ row }) =>
          !row.getIsSelected() || !row.original.permissions.canManage,
        onClick: ({ row }) => setEditor({ mode: "edit", id: row.original.id }),
      },
      {
        id: "archive",
        label: "Archive record",
        color: "error",
        renderIcon: () => <ArchiveOutlined />,
        isDisabled: ({ row }) =>
          !row.getIsSelected() || !row.original.permissions.canManage,
        onClick: ({ row }) =>
          setEditor({ mode: "delete", id: row.original.id }),
      },
      {
        id: "view",
        label: "View details",
        inline: true,
        renderIcon: () => <OpenInNew />,
        onClick: ({ row }) =>
          router.push(
            `/admin/documents/${encodeURIComponent(row.original.id)}`,
          ),
      },
    ],
    [router],
  );
  const columns = useMemo(
    () =>
      helper.columns([
        createExpansionColumn<TrackedDocument>({ showExpandAll: false }),
        createSelectionColumn<TrackedDocument>(),
        helper.accessor("registrationNumber", {
          header: "Reference",
          size: 145,
          cell: ({ row }) => documentReference(row.original),
          enableColumnFilter: false,
        }),
        helper.accessor("title", {
          header: "Document",
          size: 320,
          meta: { label: "Document title", filterVariant: "text" },
        }),
        helper.accessor("status", {
          header: "Status",
          size: 170,
          cell: ({ getValue }) => <DocumentStatus status={getValue()} />,
          meta: {
            label: "Status",
            align: "center",
            headerAlign: "center",
            filterVariant: "select",
            filterOptions: [
              { value: "ACTIVE", label: "In progress" },
              { value: "ON_HOLD", label: "On hold" },
              { value: "COMPLETED", label: "Completed" },
              { value: "CANCELLED", label: "Cancelled" },
            ],
          },
        }),
        helper.accessor("priority", {
          header: "Priority",
          size: 130,
          cell: ({ getValue }) => (
            <Typography
              variant="body2"
              color={getValue() === "URGENT" ? "error.main" : "text.secondary"}
            >
              {getValue() === "URGENT" ? "Urgent" : "Normal"}
            </Typography>
          ),
          meta: {
            label: "Priority",
            filterVariant: "select",
            filterOptions: [
              { value: "NORMAL", label: "Normal" },
              { value: "URGENT", label: "Urgent" },
            ],
          },
        }),
        helper.accessor(
          (row) =>
            activeStep(row)?.name ??
            (row.status === "COMPLETED" ? "Filed" : row.status),
          {
            id: "stage",
            header: "Current stage",
            size: 220,
            enableColumnFilter: false,
            enableSorting: false,
          },
        ),
        helper.accessor((row) => activeStep(row)?.assignedToId ?? null, {
          id: "assignedToId",
          header: "Current handler",
          size: 200,
          enableSorting: false,
          cell: ({ row }) => activeStep(row.original)?.assignedTo?.name ?? "—",
          meta: {
            label: "Current handler",
            filterVariant: "select",
            filterOptions: (metadata.data?.handlers ?? []).map((item) => ({
              value: String(item.id),
              label: item.name,
            })),
          },
        }),
        helper.accessor("typeId", {
          header: "Document type",
          size: 230,
          enableSorting: false,
          cell: ({ row }) => row.original.type.name,
          meta: {
            label: "Document type",
            filterVariant: "select",
            filterOptions: (metadata.data?.types ?? []).map((item) => ({
              value: item.id,
              label: item.name,
            })),
          },
        }),
        helper.accessor("categoryId", {
          header: "Category",
          size: 200,
          enableSorting: false,
          cell: ({ row }) => row.original.category.name,
          meta: {
            label: "Category",
            filterVariant: "select",
            filterOptions: (metadata.data?.categories ?? []).map((item) => ({
              value: item.id,
              label: item.name,
            })),
          },
        }),
        helper.accessor("responsibleDepartmentId", {
          header: "Responsible office",
          size: 240,
          enableSorting: false,
          cell: ({ row }) => row.original.responsibleDepartmentName ?? "—",
          meta: {
            label: "Responsible office",
            filterVariant: "select",
            filterOptions: (metadata.data?.departments ?? []).map((item) => ({
              value: String(item.id),
              label: item.name,
            })),
          },
        }),
        helper.accessor("incomingNumber", {
          header: "Incoming number",
          enableSorting: false,
          meta: { label: "Incoming number", filterVariant: "text" },
        }),
        helper.accessor("receivedAt", {
          header: "Received",
          size: 200,
          cell: ({ getValue }) => formatTrackingDate(getValue()),
          enableColumnFilter: false,
        }),
        helper.accessor("dueAt", {
          header: "Due",
          size: 200,
          cell: ({ getValue }) => formatTrackingDate(getValue()),
          enableColumnFilter: false,
        }),
        createActionsColumn<TrackedDocument>({
          actions,
          size: 150,
          maxInlineActions: 3,
        }),
      ]),
    [actions, metadata.data],
  );
  const table = useMuiDataTable({
    data: documents.data?.documents ?? EMPTY,
    columns,
    getRowId: (row) => row.id,
    getRowCanExpand: () => true,
    enableRowSelection: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    rowCount: documents.data?.total ?? 0,
    initialState: {
      columnPinning: adminUtilityColumnPinning,
      columnVisibility: {
        categoryId: false,
        responsibleDepartmentId: false,
        incomingNumber: false,
        dueAt: false,
      },
    },
    state: {
      pagination,
      globalFilter: search,
      columnFilters: filters,
      sorting,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: (updater) => {
      setFilters(updater);
      setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    },
    onGlobalFilterChange: (updater) => {
      setSearch((previous) =>
        typeof updater === "function"
          ? updater(previous)
          : String(updater ?? ""),
      );
      setPagination((previous) => ({ ...previous, pageIndex: 0 }));
    },
    meta: {
      emptyContent: "No documents registered yet.",
      noResultsContent: "No documents match these filters.",
    },
  });
  const detail = (record: TrackedDocument, compact = false) => (
    <DocumentDetail
      id={record.id}
      compact={compact}
      onProgress={() => setEditor({ mode: "progress", id: record.id })}
      onAttachment={() => setEditor({ mode: "attachment", id: record.id })}
    />
  );
  return (
    <ResourcePage
      title="Document tracking"
      subtitle="Follow documents from intake to physical filing. Select a document to update its progress."
      maxWidth="xl"
    >
      <S.Root>
        {(metadata.isLoading || documents.isLoading) && (
          <ResourceTableLoading message="Loading document tracking…" />
        )}
        {metadata.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => metadata.refetch()}>Retry</Button>}
          >
            {metadata.error.message}
          </Alert>
        )}
        {documents.error && (
          <Alert
            severity="error"
            action={<Button onClick={() => documents.refetch()}>Retry</Button>}
          >
            {documents.error.message}
          </Alert>
        )}
        {notice && (
          <Alert severity="success" onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}
        {metadata.data && documents.data && (
          <ResourceDataTable onViewRecord={record => router.push(`/admin/documents/${encodeURIComponent(record.id)}`)}
            resourceId="admin/document-tracking"
            persistence={{
              storageId: "admin/document-tracking",
              storage: adminTableStorage,
            }}
            table={table}
            refreshing={documents.isFetching}
            renderDetailPanel={({ row }) => detail(row.original)}
            card={{
              detailMode: "flip",
              flip: { flipOnHover: false },
              enableSelection: true,
              enableExpansion: true,
              actions,
              maxInlineActions: 3,
              renderHeader: ({ row }) => (
                <>
                  <Typography variant="subtitle2">
                    {row.original.title}
                  </Typography>
                  <Typography variant="caption">
                    {documentReference(row.original)}
                  </Typography>
                </>
              ),
              renderBody: ({ row }) => (
                <>
                  <Typography variant="body2">
                    {activeStep(row.original)?.name ?? row.original.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Handler: {activeStep(row.original)?.assignedTo?.name ?? "—"}
                  </Typography>
                </>
              ),
              renderMetadata: ({ row }) => (
                <S.Actions>
                  <DocumentStatus status={row.original.status} />
                  <Typography variant="caption">
                    {row.original.priority === "URGENT" ? "Urgent · " : ""}
                    {formatTrackingDate(row.original.receivedAt)}
                  </Typography>
                </S.Actions>
              ),
              renderDetail: ({ row }) => detail(row.original, true),
            }}
            toolbar={{
              searchPlaceholder: "Search documents…",
              startContent: metadata.data.actor.isAdmin ? (
                <ResourceTableCreateButton
                  startIcon={<AddRounded />}
                  onClick={() => setEditor({ mode: "create" })}
                >
                  Register document
                </ResourceTableCreateButton>
              ) : undefined,
            }}
          />
        )}
        {editor && metadata.data && (
          <TrackingEditor
            key={`${editor.mode}-${editor.id ?? "new"}`}
            {...editor}
            metadata={metadata.data}
            onClose={() => setEditor(null)}
            onSuccess={() => {
              setEditor(null);
              setNotice("Document tracking saved.");
              if (editor.mode === "delete" && editor.id)
                table.setRowSelection((previous) => {
                  const next = { ...previous };
                  delete next[editor.id!];
                  return next;
                });
            }}
          />
        )}
      </S.Root>
    </ResourcePage>
  );
}
