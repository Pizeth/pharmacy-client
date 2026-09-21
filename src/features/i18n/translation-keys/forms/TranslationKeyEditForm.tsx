"use client";

import { useMemo, useRef, useState } from "react";
import { Alert, Button } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { TranslationKeyApiError, updateTranslationKey } from "../api";
import {
  createTranslationKeyInputSchema,
  updateTranslationKeyInputSchema,
} from "../schemas";
import type { TranslationKey, UpdateTranslationKeyInput } from "../schemas";
import { useTranslationKeyFilterOptions } from "../table/useTranslationKeyFilterOptions";
import { TranslationKeyFormFields } from "./TranslationKeyFormFields";
import type { TranslationKeyFormValues } from "./TranslationKeyFormFields";
import { TranslationKeyFormShell } from "./TranslationKeyFormShell";

export interface TranslationKeyEditFormProps {
  readonly record: TranslationKey;
  readonly onUpdated: (record: TranslationKey) => void;
  readonly onCancel: () => void;
  readonly onPendingChange?: (pending: boolean) => void;
  readonly cancelLabel?: string;
}

export function TranslationKeyEditForm(props: TranslationKeyEditFormProps) {
  const {
    record,
    onUpdated,
    onCancel,
    onPendingChange,
    cancelLabel = "Close",
  } = props;

  const options = useTranslationKeyFilterOptions();

  const defaultValues = useMemo<TranslationKeyFormValues>(
    () => ({
      key: record.key,
      description: record.description ?? "",
      categoryId: String(record.categoryId),
    }),
    [record.categoryId, record.description, record.key],
  );

  const form = useForm<TranslationKeyFormValues>({
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

  const categoryUnavailable =
    options.fetching ||
    Boolean(options.error) ||
    options.categoryOptions.length === 0;

  const submit = handleSubmit(async (values) => {
    if (inFlight.current || categoryUnavailable) {
      return;
    }

    clearErrors();

    setRequestError(undefined);

    /**
     * First validate the complete editable form.
     *
     * This intentionally reuses the create schema because:
     *
     * - key must still be valid
     * - category remains required
     * - description normalization is identical
     *
     * Only after obtaining one valid normalized object do we derive
     * a partial PATCH.
     */
    const normalized = createTranslationKeyInputSchema.safeParse({
      key: values.key,
      description: values.description.trim() || null,
      categoryId: Number(values.categoryId),
    });

    if (!normalized.success) {
      for (const issue of normalized.error.issues) {
        const field = issue.path[0];

        if (
          field === "key" ||
          field === "description" ||
          field === "categoryId"
        ) {
          setError(field, {
            type: "schema",

            message: issue.message,
          });
        }
      }

      return;
    }

    const categoryExists = options.categoryOptions.some(
      (option) => String(option.value) === String(normalized.data.categoryId),
    );

    if (!categoryExists) {
      setError("categoryId", {
        type: "validate",
        message: "Choose an available category.",
      });

      return;
    }

    const patch: UpdateTranslationKeyInput = {};

    if (normalized.data.key !== record.key) {
      patch.key = normalized.data.key;
    }

    const originalDescription = record.description?.trim() || null;

    if (normalized.data.description !== originalDescription) {
      patch.description = normalized.data.description;
    }

    if (normalized.data.categoryId !== record.categoryId) {
      patch.categoryId = normalized.data.categoryId;
    }

    /**
     * RHF can be dirty even when normalization reduces the form
     * back to the same effective server value.
     *
     * Example:
     *
     *   existing: "auth_login"
     *   user:     " auth_login "
     *
     * Do not manufacture an empty PATCH.
     */
    if (Object.keys(patch).length === 0) {
      reset({
        key: normalized.data.key,
        description: normalized.data.description ?? "",
        categoryId: String(normalized.data.categoryId),
      });

      return;
    }

    const parsedPatch = updateTranslationKeyInputSchema.safeParse(patch);

    if (!parsedPatch.success) {
      setRequestError(
        parsedPatch.error.issues[0]?.message ??
          "Unable to prepare translation key update.",
      );

      return;
    }

    inFlight.current = true;

    setPending(true);

    onPendingChange?.(true);

    let updated: TranslationKey;

    try {
      updated = (await updateTranslationKey(record.id, parsedPatch.data)).data;
    } catch (failure: unknown) {
      /**
       * The server remains authoritative for race-sensitive
       * constraints such as key uniqueness.
       *
       * When the backend identifies one of our actual form fields,
       * surface that error at the field rather than reducing it to
       * a dialog-level alert.
       */
      if (failure instanceof TranslationKeyApiError) {
        const field = failure.payload?.field;

        if (
          field === "key" ||
          field === "description" ||
          field === "categoryId"
        ) {
          setError(field, {
            type: "server",

            message: failure.message,
          });

          return;
        }
      }

      setRequestError(
        failure instanceof Error
          ? failure.message
          : "Unable to update translation key.",
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
        submitDisabled={categoryUnavailable || !isDirty}
        cancelLabel={cancelLabel}
        submitLabel="Save changes"
        pendingLabel="Saving..."
        onCancel={onCancel}
        onSubmit={submit}
      >
        {requestError && <Alert severity="error">{requestError}</Alert>}

        {options.error ? (
          <Alert
            severity="error"
            action={
              <Button
                type="button"
                color="inherit"
                disabled={pending}
                onClick={options.refresh}
              >
                Retry categories
              </Button>
            }
          >
            Categories could not be loaded.
          </Alert>
        ) : options.fetching ? (
          <Alert severity="info">Loading categories...</Alert>
        ) : options.categoryOptions.length === 0 ? (
          <Alert severity="warning">No categories are available.</Alert>
        ) : null}

        <TranslationKeyFormFields
          autoFocusKey
          disabled={pending}
          categoryDisabled={categoryUnavailable}
          categoryOptions={options.categoryOptions}
        />
      </TranslationKeyFormShell>
    </FormProvider>
  );
}
