"use client";

import { useMemo, useRef, useState } from "react";
import { Alert } from "@mui/material";
import { TranslateOutlined } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";

import { TextField } from "@/components/inputs";

import {
  TranslationKeyApiError,
  updateTranslation,
} from "../api";

import {
  updateTranslationInputSchema,
} from "../schemas";

import type {
  TranslationKey,
  TranslationValue,
} from "../schemas";

import {
  TranslationKeyFormShell,
} from "./TranslationKeyFormShell";

export interface TranslationValueEditFormValues {
  readonly value: string;
}

export interface TranslationValueEditFormProps {
  readonly record: TranslationKey;
  readonly translation: TranslationValue;
  readonly onUpdated: (translation: TranslationValue) => void;
  readonly onCancel: () => void;
  readonly onPendingChange?: (pending: boolean) => void;
  readonly cancelLabel?: string;
}

export function TranslationValueEditForm(
  props: TranslationValueEditFormProps,
) {
  const {
    record,
    translation,
    onUpdated,
    onCancel,
    onPendingChange,
    cancelLabel = "Close",
  } = props;

  const defaultValues = useMemo<TranslationValueEditFormValues>(
    () => ({
      value: translation.value,
    }),
    [translation.value],
  );

  const form = useForm<TranslationValueEditFormValues>({
    defaultValues,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    clearErrors,
    setError,
    reset,
    formState: { isDirty },
  } = form;

  const [requestError, setRequestError] = useState<string>();
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  const submit = handleSubmit(async (values) => {
    if (inFlight.current) return;

    clearErrors();
    setRequestError(undefined);

    const parsed = updateTranslationInputSchema.safeParse({
      value: values.value,
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "value") {
          setError("value", {
            type: "schema",
            message: issue.message,
          });
        }
      }
      return;
    }

    if (parsed.data.value === translation.value) {
      reset({
        value: parsed.data.value,
      });
      return;
    }

    inFlight.current = true;
    setPending(true);
    onPendingChange?.(true);

    let updated: TranslationValue;

    try {
      updated = (
        await updateTranslation(
          record.id,
          translation.locale,
          parsed.data,
        )
      ).data;
    } catch (failure: unknown) {
      if (failure instanceof TranslationKeyApiError) {
        const field = failure.payload?.field;

        if (field === "value") {
          setError("value", {
            type: "server",
            message: failure.message,
          });
          return;
        }
      }

      setRequestError(
        failure instanceof Error
          ? failure.message
          : "Unable to update translation.",
      );
      return;
    } finally {
      inFlight.current = false;
      setPending(false);
      onPendingChange?.(false);
    }

    onUpdated(updated);
  });

  return (
    <FormProvider {...form}>
      <TranslationKeyFormShell
        pending={pending}
        submitDisabled={!isDirty}
        cancelLabel={cancelLabel}
        submitLabel="Save translation"
        pendingLabel="Saving..."
        onCancel={onCancel}
        onSubmit={submit}
      >
        {requestError && (
          <Alert severity="error">
            {requestError}
          </Alert>
        )}

        <TextField
          name="value"
          label="Translation value"
          required
          multiline
          minRows={4}
          disabled={pending}
          resettable
          iconStart={<TranslateOutlined />}
          helperText={`Editing ${translation.locale.toLocaleUpperCase()} for ${record.key}.`}
        />
      </TranslationKeyFormShell>
    </FormProvider>
  );
}
