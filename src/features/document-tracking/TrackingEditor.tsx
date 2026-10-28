"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import RouteOutlined from "@mui/icons-material/RouteOutlined";
import { FormDialog } from "@/components/forms/FormDialog";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { trackingApi } from "./api";
import type { DocumentDetail, TrackingMetadata } from "./contracts";
import { DocumentForm, type DocumentFormMode } from "./DocumentForm";
import { ProgressForm, AttachmentForm } from "./ProgressForm";
export type TrackingEditorState = {
  mode: DocumentFormMode | "progress" | "attachment";
  id?: string;
};
export function TrackingEditor({
  mode,
  id,
  metadata,
  onClose,
  onSuccess,
}: TrackingEditorState & {
  readonly metadata: TrackingMetadata;
  readonly onClose: () => void;
  readonly onSuccess: (record: DocumentDetail) => void;
}) {
  const [pending, setPending] = useState(false);
  const query = useQuery({
    queryKey: ["document-tracking", "editor", id, mode],
    queryFn: ({ signal }) => trackingApi.get(id!, signal),
    enabled: mode !== "create" && !!id,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  const title =
    mode === "create"
      ? "Register document"
      : mode === "edit"
        ? "Edit document"
        : mode === "delete"
          ? "Archive document record"
          : mode === "progress"
            ? "Update progress"
            : "Add attachment";
  const close = () => {
    if (!pending) onClose();
  };
  return (
    <FormDialog
      open
      title={title}
      subtitle={query.data?.title}
      icon={<RouteOutlined />}
      pending={pending}
      onClose={close}
      maxWidth="md"
      dedicatedPageHref={mode !== "progress" && mode !== "attachment" ? `/admin/documents/${mode}${id ? `/${encodeURIComponent(id)}` : ""}` : undefined}
      dedicatedPageLabel={`Open dedicated ${mode === "delete" ? "archive" : mode} page`}
    >
      {mode !== "create" && query.isLoading ? (
        <ResourceTableLoading message="Loading document tracking…" />
      ) : query.error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => query.refetch()}>Retry</Button>}
        >
          {query.error.message}
        </Alert>
      ) : mode === "create" ? (
        <DocumentForm
          mode="create"
          metadata={metadata}
          onCancel={close}
          onSuccess={onSuccess}
          onPendingChange={setPending}
        />
      ) : query.data ? (
        mode === "progress" ? (
          <ProgressForm
            record={query.data}
            metadata={metadata}
            onCancel={close}
            onSuccess={onSuccess}
            onPendingChange={setPending}
          />
        ) : mode === "attachment" ? (
          <AttachmentForm
            record={query.data}
            onCancel={close}
            onSuccess={onSuccess}
            onPendingChange={setPending}
          />
        ) : (
          <DocumentForm
            mode={mode}
            record={query.data}
            metadata={metadata}
            onCancel={close}
            onSuccess={onSuccess}
            onPendingChange={setPending}
          />
        )
      ) : null}
    </FormDialog>
  );
}
