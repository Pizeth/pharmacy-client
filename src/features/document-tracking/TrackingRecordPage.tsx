"use client";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { z } from "zod";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { trackingApi } from "./api";
import { documentReference } from "./contracts";
import { DocumentForm, type DocumentFormMode } from "./DocumentForm";
import { DocumentRecordContent } from "./DocumentRecordContent";
import { ResourceRecordPage } from "@/components/Tables/ResourceRecordPage";
import { TrackingEditor, type TrackingEditorState } from "./TrackingEditor";
import * as S from "./styles";
export function TrackingRecordPage({
  mode,
  id,
}: {
  readonly mode: DocumentFormMode | "view";
  readonly id?: string;
}) {
  const router = useRouter();
  const valid = mode === "create" || z.uuid().safeParse(id).success;
  const metadata = useQuery({
    queryKey: ["document-tracking", "metadata"],
    queryFn: ({ signal }) => trackingApi.metadata(signal),
    enabled: valid,
  });
  const record = useQuery({
    queryKey: ["document-tracking", mode === "view" ? "detail" : "page-editor", mode, id],
    queryFn: ({ signal }) => trackingApi.get(id!, signal),
    enabled: valid && mode !== "create",
    gcTime: mode === "view" ? 5 * 60_000 : 0,
    refetchOnWindowFocus: mode === "view",
    refetchInterval: mode === "view" ? 15_000 : false,
  });
  useBreadcrumbLabel(mode === "view" ? `/admin/documents/${id ?? ""}` : `/admin/documents/${mode}/${id ?? ""}`, mode !== "create" && record.data ? `${mode === "view" ? "" : mode === "delete" ? "Archive " : "Edit "}${record.data.title}` : undefined);
  const [editor, setEditor] = useState<TrackingEditorState | null>(null);
  const back = () => router.push("/admin/documents");
  const title =
    mode === "create"
      ? "Register document"
      : mode === "edit"
        ? "Edit document"
        : mode === "delete"
          ? "Archive document record"
          : "Document tracking";
  if (mode === "view") {
    return <ResourceRecordPage title="Document tracking details" subtitle="Full route, responsibility, attachments and handling history." backHref="/admin/documents" editHref={record.data?.permissions.canManage ? `/admin/documents/edit/${encodeURIComponent(id!)}` : undefined} loading={valid && (metadata.isLoading || record.isLoading)} error={!valid ? "Invalid document reference." : metadata.error?.message ?? record.error?.message} onRetry={() => { if (valid) { void metadata.refetch(); void record.refetch(); } }}>
      {record.data && <DocumentRecordContent record={record.data} onProgress={() => setEditor({ mode: "progress", id })} onAttachment={() => setEditor({ mode: "attachment", id })} />}
      {editor && metadata.data && <TrackingEditor key={`${editor.mode}-${editor.id}`} {...editor} metadata={metadata.data} onClose={() => setEditor(null)} onSuccess={() => { setEditor(null); void record.refetch(); }} />}
    </ResourceRecordPage>;
  }
  return (
    <ResourcePage
      title={title}
      subtitle={
        record.data
          ? `${documentReference(record.data)} · ${record.data.title}`
          : undefined
      }
      maxWidth="xl"
    >
      <S.Root>
        <S.Actions>
          <Button onClick={back}>Back to document register</Button>
        </S.Actions>
        {!valid ? (
          <Alert severity="error">Invalid document reference.</Alert>
        ) : metadata.isLoading || (mode !== "create" && record.isLoading) ? (
          <ResourceTableLoading message="Loading document tracking…" />
        ) : metadata.error || record.error ? (
          <Alert
            severity="error"
            action={
              <Button
                onClick={() => {
                  void metadata.refetch();
                  if (mode !== "create") void record.refetch();
                }}
              >
                Retry
              </Button>
            }
          >
            {metadata.error?.message || record.error?.message}
          </Alert>
        ) : (
          metadata.data && (
            <>
              {!metadata.data.actor.isAdmin ? (
                <Alert severity="error">
                  Only administrators can register, edit or archive documents.
                  Assigned handlers can update progress from the tracking page.
                </Alert>
              ) : (
                (mode === "create" || record.data) && (
                  <S.Panel>
                    <DocumentForm
                      key={`${mode}-${id ?? "new"}`}
                      mode={mode as DocumentFormMode}
                      metadata={metadata.data}
                      record={record.data}
                      onCancel={back}
                      onSuccess={(result) =>
                        router.push(`/admin/documents/${result.id}`)
                      }
                    />
                  </S.Panel>
                )
              )}
              {editor && (
                <TrackingEditor
                  key={`${editor.mode}-${editor.id}`}
                  {...editor}
                  metadata={metadata.data}
                  onClose={() => setEditor(null)}
                  onSuccess={() => setEditor(null)}
                />
              )}
            </>
          )
        )}
      </S.Root>
    </ResourcePage>
  );
}
