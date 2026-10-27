"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Alert, Button, Typography } from "@mui/material";
import { TextField, SelectField } from "@/components/inputs";
import {
  activeStep,
  progressInputSchema,
  handlerOptionLabel,
  type DocumentDetail,
  type TrackingMetadata,
  type TrackingAction,
} from "./contracts";
import { trackingApi, TrackingRequestError } from "./api";
import * as S from "./styles";

export function ProgressForm({
  record,
  metadata,
  onCancel,
  onSuccess,
  onPendingChange,
}: {
  readonly record: DocumentDetail;
  readonly metadata: TrackingMetadata;
  readonly onCancel: () => void;
  readonly onSuccess: (record: DocumentDetail) => void;
  readonly onPendingChange?: (pending: boolean) => void;
}) {
  const [initial] = useState(record);
  const current = activeStep(initial);
  const form = useForm({
    defaultValues: {
      action:
        initial.status === "ON_HOLD"
          ? "RESUME"
          : initial.status === "COMPLETED"
            ? "COMMENT"
            : "FORWARD",
      assignedToId: "",
      departmentId: "",
      targetPosition: "",
      note: "",
      outgoingNumber: initial.outgoingNumber ?? "",
      storageLocationCode: initial.storageLocation?.code ?? "",
      chronologicalCode: initial.chronologicalCode ?? "",
      archiveSequence: String(initial.archiveSequence ?? ""),
    },
  });
  const action = useWatch({
    control: form.control,
    name: "action",
  }) as TrackingAction;
  const next = initial.steps.find(
    (step) => step.position === (current?.position ?? -1) + 1,
  );
  const handoff =
    action === "ASSIGN" ||
    action === "RETURN" ||
    (action === "FORWARD" && !!next);
  const client = useQueryClient();
  const inFlight = useRef(false);
  const mutation = useMutation({
    mutationFn: async () => {
      const values = form.getValues();
      const data = progressInputSchema.parse({
        version: initial.version,
        action,
        note: values.note.trim() || null,
        ...(handoff
          ? {
              assignedToId: values.assignedToId
                ? Number(values.assignedToId)
                : null,
              departmentId: values.departmentId
                ? Number(values.departmentId)
                : null,
            }
          : {}),
        ...(action === "RETURN"
          ? {
              targetPosition:
                values.targetPosition === ""
                  ? undefined
                  : Number(values.targetPosition),
            }
          : {}),
        ...(action === "FORWARD"
          ? { outgoingNumber: values.outgoingNumber.trim() || null }
          : {}),
        ...(action === "FORWARD" && !next
          ? {
              storageLocationCode: values.storageLocationCode.trim() || null,
              chronologicalCode: values.chronologicalCode.trim() || null,
              archiveSequence: values.archiveSequence
                ? Number(values.archiveSequence)
                : null,
            }
          : {}),
      });
      if (handoff && !data.assignedToId)
        throw new Error("Choose the person who will receive the document.");
      return trackingApi.progress(initial.id, data);
    },
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["document-tracking"] });
      onSuccess(result);
    },
  });
  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);
  const conflict =
    mutation.error instanceof TrackingRequestError &&
    mutation.error.status === 409;
  const options =
    initial.status === "CANCELLED"
      ? []
      : initial.status === "COMPLETED"
        ? ["COMMENT", ...(metadata.actor.isAdmin ? ["RETURN"] : [])]
        : initial.status === "ON_HOLD"
          ? ["RESUME", "ASSIGN", "COMMENT"]
          : [
              "FORWARD",
              "ASSIGN",
              ...(current && current.position > 0 ? ["RETURN"] : []),
              "HOLD",
              "COMMENT",
            ];
  if (
    metadata.actor.isAdmin &&
    initial.status !== "CANCELLED" &&
    initial.status !== "COMPLETED"
  )
    options.push("CANCEL");
  const labels: Record<string, string> = {
    FORWARD: next ? "Hand over to next stage" : "Complete physical filing",
    RETURN: "Return for rework",
    ASSIGN: "Reassign current stage",
    HOLD: "Put on hold",
    RESUME: "Resume handling",
    COMMENT: "Add comment",
    CANCEL: "Cancel document",
  };
  return (
    <FormProvider {...form}>
      <S.Form
        noValidate
        aria-busy={mutation.isPending}
        onSubmit={async (event) => {
          event.preventDefault();
          if (inFlight.current || conflict) return;
          inFlight.current = true;
          try {
            await mutation.mutateAsync();
          } catch {
            /* The open form presents mutation errors. */
          } finally {
            inFlight.current = false;
          }
        }}
      >
        <Typography variant="body2">
          Current stage: <strong>{current?.name ?? initial.status}</strong>.
          Each change is recorded in the handling history.
        </Typography>
        <SelectField
          name="action"
          label="Action"
          required
          disabled={mutation.isPending}
          options={options.map((value) => ({ value, label: labels[value] }))}
        />
        {action === "FORWARD" && next && (
          <Alert severity="info">
            Next stage: {next.name}. Confirm who receives the document.
          </Alert>
        )}
        {action === "RETURN" && (
          <SelectField
            name="targetPosition"
            label="Return to stage"
            required
            disabled={mutation.isPending}
            options={initial.steps
              .filter(
                (step) =>
                  step.position < (current?.position ?? initial.steps.length),
              )
              .map((step) => ({
                value: String(step.position),
                label: step.name,
              }))}
          />
        )}
        {handoff && (
          <S.FieldGrid>
            <SelectField
              name="assignedToId"
              label="Receiving handler"
              required
              disabled={mutation.isPending}
              options={metadata.handlers.map((item) => ({
                value: String(item.id),
                label: handlerOptionLabel(item),
              }))}
            />
            <SelectField
              name="departmentId"
              label="Receiving office"
              helperText="Leave blank to use the handler’s current HR office, or the stage office when no HR assignment exists."
              disabled={mutation.isPending}
              options={metadata.departments.map((item) => ({
                value: String(item.id),
                label: item.name,
              }))}
            />
          </S.FieldGrid>
        )}
        {action === "FORWARD" &&
          (current?.key === "STAMPING" || current?.key === "DISPATCH") && (
            <TextField
              name="outgoingNumber"
              label="Outgoing number"
              fullWidth
              required={current.key === "DISPATCH"}
              disabled={mutation.isPending}
            />
          )}
        {action === "FORWARD" && !next && (
          <>
            <Alert severity="info">
              Filing completes the shared route. Record where the physical
              document can be found.
            </Alert>
            <TextField
              name="storageLocationCode"
              label="Cabinet / storage code"
              fullWidth
              required
              disabled={mutation.isPending}
            />
            <S.FieldGrid>
              <TextField
                name="chronologicalCode"
                label="Chronological archive code"
                fullWidth
                disabled={mutation.isPending}
              />
              <TextField
                name="archiveSequence"
                label="Archive sequence"
                type="number"
                fullWidth
                disabled={mutation.isPending}
              />
            </S.FieldGrid>
          </>
        )}
        <TextField
          name="note"
          label="Reason / handling note"
          fullWidth
          multiline
          minRows={2}
          required={["RETURN", "HOLD", "CANCEL", "COMMENT"].includes(action)}
          disabled={mutation.isPending}
        />
        {mutation.error && (
          <Alert severity="error">
            {conflict
              ? "Progress changed while this form was open. Close and reopen it to review the latest handler and stage."
              : mutation.error.message}
          </Alert>
        )}
        <S.Actions>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={action === "CANCEL" ? "error" : "success"}
            type="submit"
            disabled={mutation.isPending || conflict || options.length === 0}
            loading={mutation.isPending}
          >
            {labels[action] ?? "Save progress"}
          </Button>
        </S.Actions>
      </S.Form>
    </FormProvider>
  );
}

export function AttachmentForm({
  record,
  onCancel,
  onSuccess,
  onPendingChange,
}: {
  readonly record: DocumentDetail;
  readonly onCancel: () => void;
  readonly onSuccess: (record: DocumentDetail) => void;
  readonly onPendingChange?: (pending: boolean) => void;
}) {
  const [initial] = useState(record);
  const form = useForm({
    defaultValues: {
      name: "",
      url: "",
      kind: "SUPPORTING" as "INCOMING" | "OUTGOING" | "SUPPORTING",
    },
  });
  const client = useQueryClient();
  const inFlight = useRef(false);
  const mutation = useMutation({
    mutationFn: () =>
      trackingApi.attachment(initial.id, initial.version, form.getValues()),
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["document-tracking"] });
      onSuccess(result);
    },
  });
  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);
  const conflict =
    mutation.error instanceof TrackingRequestError &&
    mutation.error.status === 409;
  return (
    <FormProvider {...form}>
      <S.Form
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          if (inFlight.current || conflict) return;
          inFlight.current = true;
          try {
            await mutation.mutateAsync();
          } catch {
            /* Keep the form and present the error. */
          } finally {
            inFlight.current = false;
          }
        }}
      >
        <Alert severity="info">
          Link an existing secure file. This form does not upload files or
          change their sharing permissions.
        </Alert>
        <TextField
          name="name"
          label="Attachment name"
          required
          fullWidth
          disabled={mutation.isPending}
        />
        <TextField
          name="url"
          label="File URL"
          type="url"
          required
          fullWidth
          disabled={mutation.isPending}
        />
        <SelectField
          name="kind"
          label="Attachment type"
          disabled={mutation.isPending}
          options={[
            { value: "INCOMING", label: "Incoming document" },
            { value: "OUTGOING", label: "Final document" },
            { value: "SUPPORTING", label: "Supporting document" },
          ]}
        />
        {mutation.error && (
          <Alert severity="error">
            {conflict
              ? "Document changed. Close and reopen the form before adding the link."
              : mutation.error.message}
          </Alert>
        )}
        <S.Actions>
          <Button onClick={onCancel} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={mutation.isPending || conflict}
            loading={mutation.isPending}
          >
            Add attachment link
          </Button>
        </S.Actions>
      </S.Form>
    </FormProvider>
  );
}
