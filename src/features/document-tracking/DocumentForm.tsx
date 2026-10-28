"use client";
import { FormActions } from "@/components/forms/FormActions";
import { AccountTreeOutlined, ArchiveOutlined, ArticleOutlined, CallMade, CallReceived, CategoryOutlined, DescriptionOutlined, FlagOutlined, FormatListNumbered, Inventory2Outlined, LabelOutlined, NotesOutlined, PersonOutline } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, Button, Typography } from "@mui/material";
import { TextField, SelectField } from "@/components/inputs";
import { trackingApi, TrackingRequestError } from "./api";
import {
  activeStep,
  documentInputSchema,
  handlerOptionLabel,
  type DocumentDetail,
  type TrackingMetadata,
} from "./contracts";
import * as S from "./styles";
import { TrackingDateTimeField } from "./TrackingDateTimeField";
import { AttachmentFields } from "./AttachmentFields";
import { getAttachmentDraft, type AttachmentKind } from "./attachmentDraft";

export type DocumentFormMode = "create" | "edit" | "delete";
export const toLocalDate = (date: string) =>
  new Date(new Date(date).getTime() + 7 * 3600_000).toISOString().slice(0, 16);
export const fromLocalDate = (date: string) =>
  date ? new Date(`${date}+07:00`).toISOString() : null;
const nullable = (value: string) => value.trim() || null;
const number = (value: string) => (value ? Number(value) : null);
export function DocumentForm({
  mode,
  record,
  metadata,
  onCancel,
  onSuccess,
  onPendingChange,
}: {
  readonly mode: DocumentFormMode;
  readonly record?: DocumentDetail;
  readonly metadata: TrackingMetadata;
  readonly onCancel: () => void;
  readonly onSuccess: (record: DocumentDetail) => void;
  readonly onPendingChange?: (pending: boolean) => void;
}) {
  const client = useQueryClient();
  const initial = useRef(record);
  const inFlight = useRef(false);
  const form = useForm({
    defaultValues: {
      title: record?.title ?? "",
      categoryId: record?.categoryId ?? "",
      typeId: record?.typeId ?? "",
      subtype: record?.subtype ?? "",
      priority: record?.priority ?? "NORMAL",
      incomingNumber: record?.incomingNumber ?? "",
      outgoingNumber: record?.outgoingNumber ?? "",
      receivedAt: toLocalDate(record?.receivedAt ?? new Date().toISOString()),
      dueAt: record?.dueAt ? toLocalDate(record.dueAt) : "",
      responsibleDepartmentId: String(record?.responsibleDepartmentId ?? ""),
      assignedToId: String(
        record ? (activeStep(record)?.assignedToId ?? "") : metadata.actor.id,
      ),
      storageLocationCode: record?.storageLocation?.code ?? "",
      chronologicalCode: record?.chronologicalCode ?? "",
      archiveSequence: String(record?.archiveSequence ?? ""),
      notes: record?.notes ?? "",
      reason: "",
      attachmentSource: "upload",
      attachmentName: "",
      attachmentUrl: "",
      attachmentKind: "INCOMING" as AttachmentKind,
    },
  });
  const [validation, setValidation] = useState("");
  const [registered, setRegistered] = useState<DocumentDetail | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const mutation = useMutation({
    mutationFn: async () => {
      const values = form.getValues();
      if (mode === "delete") {
        if (!values.reason.trim())
          throw new Error("Give a reason for archiving this record.");
        return trackingApi.archive(
          initial.current!.id,
          initial.current!.version,
          values.reason.trim(),
        );
      }
      const attachment = mode === "create" ? getAttachmentDraft({ source: values.attachmentSource, name: values.attachmentName, url: values.attachmentUrl, kind: values.attachmentKind }, attachmentFile, values.title) : null;
      let saved = registered;
      if (!saved) {
        const data = documentInputSchema.parse({
          ...values,
          subtype: nullable(values.subtype),
          incomingNumber: nullable(values.incomingNumber),
          outgoingNumber: nullable(values.outgoingNumber),
          receivedAt: fromLocalDate(values.receivedAt),
          dueAt: fromLocalDate(values.dueAt),
          responsibleDepartmentId: number(values.responsibleDepartmentId),
          assignedToId: number(values.assignedToId),
          storageLocationCode: nullable(values.storageLocationCode),
          chronologicalCode: nullable(values.chronologicalCode),
          archiveSequence: number(values.archiveSequence),
          notes: nullable(values.notes),
        });
        if (data.dueAt && new Date(data.dueAt) < new Date(data.receivedAt))
          throw new Error("Due time cannot be before receipt time.");
        saved = await trackingApi.save(
          data,
          mode === "edit" ? initial.current : undefined,
        );
        if (mode === "create") {
          setRegistered(saved);
          await client.invalidateQueries({ queryKey: ["document-tracking"] });
        }
      }
      if (attachment?.source === "upload") return trackingApi.uploadAttachment(saved.id, saved.version, { name: attachment.name, kind: attachment.kind }, attachment.file);
      if (attachment?.source === "link") return trackingApi.attachment(saved.id, saved.version, { name: attachment.name, kind: attachment.kind, url: attachment.url });
      return saved;
    },
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["document-tracking"] });
      onSuccess(result);
    },
  });
  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);
  const pending = mutation.isPending;
  const metadataLocked = pending || !!registered;
  const conflict =
    mutation.error instanceof TrackingRequestError &&
    mutation.error.status === 409;
  return (
    <FormProvider {...form}>
      <S.Form
        noValidate
        aria-busy={pending}
        onSubmit={async (event) => {
          event.preventDefault();
          if (inFlight.current || conflict) return;
          inFlight.current = true;
          setValidation("");
          try {
            await mutation.mutateAsync();
          } catch (error) {
            if (error && typeof error === "object" && "issues" in error)
              setValidation(
                "Check the required fields, dates and positive archive number.",
              );
          } finally {
            inFlight.current = false;
          }
        }}
      >
        {mode === "delete" ? (
          <>
            <Typography>
              Archive <strong>{record?.title}</strong>?
            </Typography>
            <Alert severity="warning">
              This removes the record from the active register and preserves its
              history. This is separate from physical filing.
            </Alert>
            <TextField
              name="reason"
              iconStart={<NotesOutlined />}
              iconStartAlignment="top"
              label="Reason"
              required
              fullWidth
              disabled={metadataLocked}
            />
          </>
        ) : (
          <>
            <TextField
              name="title"
              iconStart={<DescriptionOutlined />}
              label="Document title"
              required
              fullWidth
              disabled={metadataLocked}
            />
            {mode === "create" && <>
              <Typography component="h3" variant="h6">Document file (required)</Typography>
              <AttachmentFields names={{ source: "attachmentSource", name: "attachmentName", url: "attachmentUrl", kind: "attachmentKind" }} useDocumentTitle file={attachmentFile} onFileChange={setAttachmentFile} disabled={pending} />
            </>}
            <S.FieldGrid>
              <SelectField
                name="categoryId"
                iconStart={<CategoryOutlined />}
                label="Category"
                required
                options={metadata.categories.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                disabled={metadataLocked}
              />
              <SelectField
                name="typeId"
                iconStart={<ArticleOutlined />}
                label="Document type"
                required
                options={metadata.types.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                disabled={metadataLocked}
              />
              <TextField
                name="subtype"
                iconStart={<LabelOutlined />}
                label="Subtype / leave type"
                fullWidth
                disabled={metadataLocked}
              />
              <SelectField
                name="priority"
                iconStart={<FlagOutlined />}
                label="Priority"
                options={[
                  { value: "NORMAL", label: "Normal" },
                  { value: "URGENT", label: "Urgent" },
                ]}
                disabled={metadataLocked}
              />
              <TextField
                name="incomingNumber"
                iconStart={<CallReceived />}
                label="Incoming number"
                fullWidth
                disabled={metadataLocked}
              />
              <TextField
                name="outgoingNumber"
                iconStart={<CallMade />}
                label="Outgoing number"
                fullWidth
                disabled={metadataLocked}
              />
              <TrackingDateTimeField
                name="receivedAt"
                label="Received at"
                required
                disabled={metadataLocked}
              />
              <TrackingDateTimeField
                name="dueAt"
                label="Due at"
                disabled={metadataLocked}
              />
              <SelectField
                name="responsibleDepartmentId"
                iconStart={<AccountTreeOutlined />}
                label="Responsible office"
                options={metadata.departments.map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
                disabled={metadataLocked}
              />
              <SelectField
                name="assignedToId"
                iconStart={<PersonOutline />}
                label={
                  mode === "create" ? "Initial handler" : "Current handler"
                }
                options={metadata.handlers.map((item) => ({
                  value: String(item.id),
                  label: handlerOptionLabel(item),
                }))}
                disabled={metadataLocked || mode === "edit"}
                placeholder="Receives the initial intake stage."
                helperText={mode === "edit" ? "Use Update progress to reassign or hand over." : undefined}
              />
              <TextField
                name="storageLocationCode"
                iconStart={<Inventory2Outlined />}
                label="Cabinet / storage code"
                fullWidth
                disabled={metadataLocked}
              />
              <TextField
                name="chronologicalCode"
                iconStart={<ArchiveOutlined />}
                label="Chronological archive code"
                fullWidth
                disabled={metadataLocked}
              />
              <TextField
                name="archiveSequence"
                iconStart={<FormatListNumbered />}
                label="Archive sequence"
                type="number"
                fullWidth
                disabled={metadataLocked}
              />
            </S.FieldGrid>
            <TextField
              name="notes"
              iconStart={<NotesOutlined />}
              iconStartAlignment="top"
              label="Notes"
              multiline
              minRows={2}
              fullWidth
              disabled={metadataLocked}
            />
          </>
        )}
        {registered && mutation.error && <Alert severity="warning">The document is saved, but its required attachment could not be confirmed. Retry the upload or provide a file URL to complete registration.</Alert>}
        {(validation || mutation.error) && (
          <Alert severity="error">
            {conflict
              ? "This document changed while the form was open. Close and reopen it to review the latest version before saving."
              : validation || mutation.error?.message}
          </Alert>
        )}
        <FormActions>
          <Button variant="outlined" onClick={onCancel} disabled={pending}>
            {registered ? "Close" : "Cancel"}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={mode === "delete" ? "error" : "success"}
            loading={pending}
            disabled={pending || conflict}
          >
            {mode === "delete"
              ? "Archive record"
              : mode === "edit"
                ? "Save changes"
                : registered ? "Retry attachment" : "Register document"}
          </Button>
        </FormActions>
      </S.Form>
    </FormProvider>
  );
}
