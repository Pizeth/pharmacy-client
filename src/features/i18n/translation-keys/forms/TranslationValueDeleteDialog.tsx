"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Typography, styled } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

import { FormDialog } from "@/components/forms/FormDialog";

import { deleteTranslation } from "../api";
import {
  getTranslationKeyLocaleLabel,
} from "../locales";

import type {
  DeletedTranslation,
  TranslationKey,
  TranslationValue,
} from "../schemas";

const ContentRoot = styled("div", {
  name: "RazethTranslationKeyForm",
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})({});

const ActionsRoot = styled("div", {
  name: "RazethTranslationKeyForm",
  slot: "Footer",
  overridesResolver: (_props, styles) => styles.footer,
})({});

export interface TranslationValueDeleteDialogProps {
  readonly record: TranslationKey | null;
  readonly translation: TranslationValue | null;
  readonly onClose: () => void;
  readonly onDeleted: (translation: DeletedTranslation) => void;
}

/**
 * Protected nested TranslationValue delete confirmation.
 *
 * The target is identified by:
 *
 *   TranslationKey.id + TranslationValue.locale
 *
 * because the backend DELETE route is:
 *
 *   /keys/:keyId/translations/:locale
 *
 * The locale therefore behaves as part of the nested resource identity,
 * not as an editable form field.
 */
export function TranslationValueDeleteDialog(
  props: TranslationValueDeleteDialogProps,
) {
  const {
    record,
    translation,
    ...callbacks
  } = props;

  return record && translation ? (
    <DeleteConfirmation
      key={`${record.id}:${translation.locale}`}
      record={record}
      translation={translation}
      {...callbacks}
    />
  ) : null;
}

function DeleteConfirmation(
  props: Omit<
    TranslationValueDeleteDialogProps,
    "record" | "translation"
  > & {
    readonly record: TranslationKey;
    readonly translation: TranslationValue;
  },
) {
  const {
    record,
    translation,
    onClose,
    onDeleted,
  } = props;

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const inFlight = useRef(false);
  const mounted = useRef(false);
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mounted.current = true;

    /**
     * If this dialog is opened from a row/detail action, let that
     * trigger finish restoring focus before choosing the safe action.
     */
    const frame = requestAnimationFrame(() => {
      cancelButton.current?.focus();
    });

    return () => {
      mounted.current = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  const close = () => {
    if (!inFlight.current) {
      onClose();
    }
  };

  const confirm = async () => {
    if (inFlight.current) {
      return;
    }

    inFlight.current = true;
    setPending(true);
    setError(undefined);

    let deleted: DeletedTranslation;

    try {
      deleted = (
        await deleteTranslation(
          record.id,
          translation.locale,
        )
      ).data;
    } catch (cause: unknown) {
      if (mounted.current) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to delete translation. Please try again.",
        );
      }

      return;
    } finally {
      inFlight.current = false;

      if (mounted.current) {
        setPending(false);
      }
    }

    if (mounted.current) {
      onDeleted(deleted);
    }
  };

  const localeLabel =
    getTranslationKeyLocaleLabel(
      translation.locale,
    );

  return (
    <FormDialog
      open
      title="Delete translation"
      subtitle={`Delete ${localeLabel} for ${record.key}? This action cannot be undone.`}
      icon={<DeleteOutline />}
      maxWidth="sm"
      pending={pending}
      closeAriaLabel="Close delete translation dialog"
      onClose={close}
    >
      <ContentRoot aria-busy={pending}>
        <Typography>
          Confirm deletion of the{" "}
          <strong>{localeLabel}</strong>{" "}
          translation for{" "}
          <strong>{record.key}</strong>.
        </Typography>

        <Typography
          component="blockquote"
          variant="body2"
          color="text.secondary"
        >
          {translation.value}
        </Typography>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <ActionsRoot>
          <Button
            ref={cancelButton}
            autoFocus
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
              void confirm();
            }}
          >
            {pending
              ? "Deleting…"
              : "Delete translation"}
          </Button>
        </ActionsRoot>
      </ContentRoot>
    </FormDialog>
  );
}
