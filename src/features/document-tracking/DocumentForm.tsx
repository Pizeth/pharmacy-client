"use client";
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
    },
  });
  const [validation, setValidation] = useState("");
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
      return trackingApi.save(
        data,
        mode === "edit" ? initial.current : undefined,
      );
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
              label="Reason"
              required
              fullWidth
              disabled={pending}
            />
          </>
        ) : (
          <>
            <TextField
              name="title"
              label="Document title"
              required
              fullWidth
              disabled={pending}
            />
            <S.FieldGrid>
              <SelectField
                name="categoryId"
                label="Category"
                required
                options={metadata.categories.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                disabled={pending}
              />
              <SelectField
                name="typeId"
                label="Document type"
                required
                options={metadata.types.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                disabled={pending}
              />
              <TextField
                name="subtype"
                label="Subtype / leave type"
                fullWidth
                disabled={pending}
              />
              <SelectField
                name="priority"
                label="Priority"
                options={[
                  { value: "NORMAL", label: "Normal" },
                  { value: "URGENT", label: "Urgent" },
                ]}
                disabled={pending}
              />
              <TextField
                name="incomingNumber"
                label="Incoming number"
                fullWidth
                disabled={pending}
              />
              <TextField
                name="outgoingNumber"
                label="Outgoing number"
                fullWidth
                disabled={pending}
              />
              <TextField
                name="receivedAt"
                label="Received at"
                type="datetime-local"
                required
                fullWidth
                helperText="Cambodia time (UTC+7)."
                disabled={pending}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                name="dueAt"
                label="Due at"
                type="datetime-local"
                fullWidth
                helperText="Optional; Cambodia time (UTC+7)."
                disabled={pending}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <SelectField
                name="responsibleDepartmentId"
                label="Responsible office"
                options={metadata.departments.map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
                disabled={pending}
              />
              <SelectField
                name="assignedToId"
                label={
                  mode === "create" ? "Initial handler" : "Current handler"
                }
                options={metadata.handlers.map((item) => ({
                  value: String(item.id),
                  label: handlerOptionLabel(item),
                }))}
                disabled={pending || mode === "edit"}
                helperText={
                  mode === "edit"
                    ? "Use Update progress to reassign or hand over."
                    : "Receives the initial intake stage."
                }
              />
              <TextField
                name="storageLocationCode"
                label="Cabinet / storage code"
                fullWidth
                disabled={pending}
              />
              <TextField
                name="chronologicalCode"
                label="Chronological archive code"
                fullWidth
                disabled={pending}
              />
              <TextField
                name="archiveSequence"
                label="Archive sequence"
                type="number"
                fullWidth
                disabled={pending}
              />
            </S.FieldGrid>
            <TextField
              name="notes"
              label="Notes"
              multiline
              minRows={2}
              fullWidth
              disabled={pending}
            />
          </>
        )}
        {(validation || mutation.error) && (
          <Alert severity="error">
            {conflict
              ? "This document changed while the form was open. Close and reopen it to review the latest version before saving."
              : validation || mutation.error?.message}
          </Alert>
        )}
        <S.Actions>
          <Button variant="outlined" onClick={onCancel} disabled={pending}>
            Cancel
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
                : "Register document"}
          </Button>
        </S.Actions>
      </S.Form>
    </FormProvider>
  );
}
