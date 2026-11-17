"use client";
import { DescriptionOutlined, EditOutlined, ArchiveOutlined } from "@mui/icons-material";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { z } from "zod";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { ResourceFormLoading } from "@/components/forms/ResourceFormLoading";
import { trackingApi } from "./api";
import { useDocumentTrackingRealtime } from "./useDocumentTrackingRealtime";
import { documentReference } from "./contracts";
import { DocumentForm, type DocumentFormMode } from "./DocumentTrackingForm";
import { DocumentRecordContent } from "./DocumentRecordContent";
import { ResourceRecordPage } from "@/components/Tables/ResourceRecordPage";
import { TrackingEditor, type TrackingEditorState } from "./TrackingEditor";
import * as S from "./styles";
function useTrackingRecordQueries(mode: DocumentFormMode | "view", id: string | undefined, viewing: boolean) {
  const valid = mode === "create" || z.uuid().safeParse(id).success;
  const metadata = useQuery({
    queryKey: ["document-tracking", "metadata"],
    queryFn: ({ signal }) => trackingApi.metadata(signal),
    enabled: valid,
  });
  useDocumentTrackingRealtime(viewing && metadata.isSuccess);
  const record = useQuery({
    queryKey: ["document-tracking", viewing ? "detail" : "page-editor", mode, id],
    queryFn: ({ signal }) => trackingApi.get(id!, signal),
    enabled: valid && mode !== "create",
    gcTime: viewing ? 5 * 60_000 : 0,
    refetchOnWindowFocus: viewing,
    refetchInterval: viewing ? 15_000 : false,
  });
  return { valid, metadata, record };
}

function TrackingRecordView({
  id,
  valid,
  metadata,
  record,
}: ReturnType<typeof useTrackingRecordQueries> & { id?: string }) {
  const [editor, setEditor] = useState<TrackingEditorState | null>(null);
  return <ResourceRecordPage title="Document tracking details" subtitle="Full route, responsibility, attachments and handling history." backHref="/admin/documents" editHref={record.data?.permissions.canManage ? `/admin/documents/edit/${encodeURIComponent(record.data.id)}` : undefined} loading={valid && (metadata.isLoading || record.isLoading)} error={!valid ? "Invalid document reference." : metadata.error?.message ?? record.error?.message} onRetry={() => { if (valid) { return Promise.all([metadata.refetch(), record.refetch()]); } }}>
    {record.data && <DocumentRecordContent record={record.data} onProgress={() => setEditor({ mode: "progress", id })} onAttachment={() => setEditor({ mode: "attachment", id })} />}
    {editor && metadata.data && <TrackingEditor key={`${editor.mode}-${editor.id}`} {...editor} metadata={metadata.data} onClose={() => setEditor(null)} onSuccess={() => { setEditor(null); return record.refetch(); }} />}
  </ResourceRecordPage>;
}

const formPresentation = {
  create: { title: "Register document", Icon: DescriptionOutlined },
  edit: { title: "Edit document", Icon: EditOutlined },
  delete: { title: "Archive document record", Icon: ArchiveOutlined },
};

export function TrackingRecordPage({
  mode,
  id,
}: {
  readonly mode: DocumentFormMode | "view";
  readonly id?: string;
}) {
  const router = useRouter();
  const viewing = mode === "view";
  const { valid, metadata, record } = useTrackingRecordQueries(mode, id, viewing);
  useBreadcrumbLabel(viewing ? `/admin/documents/${id ?? ""}` : `/admin/documents/${mode}/${id ?? ""}`, mode !== "create" && !record.error && record.data ? `${viewing ? "" : mode === "delete" ? "Archive " : "Edit "}${record.data.title}` : undefined);
  const back = () => router.push("/admin/documents");
  if (viewing) return <TrackingRecordView id={id} valid={valid} metadata={metadata} record={record} />;
  const { title, Icon } = formPresentation[mode];
  return (
    <ResourcePage
      titleIcon={<Icon />}
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
          <ResourceFormLoading message="Loading document tracking…" />
        ) : metadata.error || record.error ? (
          <Alert
            severity="error"
            action={
              <Button
                onClick={() => {
                  const refresh = metadata.refetch();
                  return mode === "create" ? refresh : Promise.all([refresh, record.refetch()]);
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
            </>
          )
        )}
      </S.Root>
    </ResourcePage>
  );
}
