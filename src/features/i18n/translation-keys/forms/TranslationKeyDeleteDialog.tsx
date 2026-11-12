"use client";
import { FormActions } from "@/components/forms/FormActions";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Typography, styled } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { FormDialog } from "@/components/forms/FormDialog";
import { deleteTranslationKey } from "../api";
import type { DeletedTranslationKey, TranslationKey } from "../schemas";

const ContentRoot = styled("div", {
  name: "RazethTranslationKeyForm",
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({});

const ActionsRoot = styled(FormActions, {
  name: "RazethTranslationKeyForm",
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})({});

export interface TranslationKeyDeleteDialogProps {
  readonly record: TranslationKey | null;
  readonly onClose: () => void;
  readonly onDeleted: (record: DeletedTranslationKey) => void;
}

/** Mount each confirmation separately so errors cannot leak between records. */
export function TranslationKeyDeleteDialog({
  record,
  ...callbacks
}: TranslationKeyDeleteDialogProps) {
  return record ? (
    <TranslationKeyDeleteConfirmation key={record.id} record={record} {...callbacks} />
  ) : null;
}

export function TranslationKeyDeleteConfirmation({
  record,
  onClose,
  onDeleted,
  presentation = "dialog",
}: Omit<TranslationKeyDeleteDialogProps, "record"> & {
  readonly record: TranslationKey;
  readonly presentation?: "dialog" | "page";
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const inFlight = useRef(false);
  const mounted = useRef(false);
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mounted.current = true;
    cancelButton.current?.focus();
    // Let the closing overflow menu finish restoring focus before choosing the
    // safe initial action in the newly mounted modal.
    const frame = requestAnimationFrame(() => cancelButton.current?.focus());
    return () => {
      mounted.current = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = () => {
    if (!inFlight.current) onClose();
  };

  const confirm = async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(undefined);

    let deleted: DeletedTranslationKey;
    try {
      // Transport and runtime response validation already belong to this API.
      const response = await deleteTranslationKey(record.id);
      deleted = response.data;
    } catch (cause: unknown) {
      if (mounted.current) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to delete translation key. Please try again.",
        );
      }
      return;
    } finally {
      inFlight.current = false;
      if (mounted.current) setPending(false);
    }

    // Refresh errors must not be reported as failed DELETE requests.
    if (mounted.current) onDeleted(deleted);
  };

  const content = (
    <ContentRoot aria-busy={pending}>
      <Typography>
        Confirm deletion of translation key <strong>{record.key}</strong>.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <ActionsRoot>
        <Button
          ref={cancelButton}
          variant="outlined"
          disabled={pending}
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteOutline />}
          loading={pending}
          loadingPosition="start"
          disabled={pending}
          onClick={() => {
            confirm().catch(console.error);
          }}
        >
          {pending ? "Deleting…" : "Delete key"}
        </Button>
      </ActionsRoot>
    </ContentRoot>
  );

  return presentation === "page" ? content : (
    <FormDialog
      open
      title="Delete translation key"
      subtitle={`Delete ${record.key}? This action cannot be undone.`}
      icon={<DeleteOutline />}
      maxWidth="sm"
      pending={pending}
      closeAriaLabel="Close delete translation key dialog"
      onClose={close}
    >
      {content}
    </FormDialog>
  );
}
