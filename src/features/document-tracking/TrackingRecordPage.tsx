"use client";
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
import { DocumentDetailContent } from "./DocumentDetail";
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
    queryKey: ["document-tracking", "detail", id],
    queryFn: ({ signal }) => trackingApi.get(id!, signal),
    enabled: valid && mode !== "create",
    refetchOnWindowFocus: mode === "view",
    refetchInterval: mode === "view" ? 15_000 : false,
  });
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
              {mode === "view" && record.data ? (
                <S.Panel>
                  <DocumentDetailContent
                    record={record.data}
                    onProgress={() => setEditor({ mode: "progress", id })}
                    onAttachment={() => setEditor({ mode: "attachment", id })}
                  />
                </S.Panel>
              ) : !metadata.data.actor.isAdmin ? (
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
