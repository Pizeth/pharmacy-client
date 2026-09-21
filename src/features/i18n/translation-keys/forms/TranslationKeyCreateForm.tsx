"use client";

import { useRef, useState } from "react";
import { Alert, Button, Stack } from "@mui/material";
import { CloseRounded, SaveRounded } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";
import { createTranslationKey } from "../api";
import { createTranslationKeyInputSchema } from "../schemas";
import type { TranslationKey } from "../schemas";
import { useTranslationKeyFilterOptions } from "../table/useTranslationKeyFilterOptions";
import {
  EMPTY_TRANSLATION_KEY_FORM_VALUES,
  TranslationKeyFormFields,
} from "./TranslationKeyFormFields";

import type { TranslationKeyFormValues } from "./TranslationKeyFormFields";
import { TranslationKeyFormShell } from "./TranslationKeyFormShell";

export interface TranslationKeyCreateFormProps {
  readonly onCreated: (record: TranslationKey) => void;
  readonly onCancel: () => void;
  readonly onPendingChange?: (pending: boolean) => void;
  readonly cancelLabel?: string;
}

/**
 * TranslationKey creation form.
 *
 * Ownership:
 *
 * React Hook Form
 *   - editable UI values
 *   - field errors
 *
 * TranslationKey schema
 *   - canonical client mutation validation
 *   - trimming
 *   - field limits
 *   - numeric category contract
 *
 * Resource API
 *   - HTTP mutation
 *   - response validation
 *
 * Parent
 *   - post-success navigation/dialog closure
 *   - table refresh
 */
export function TranslationKeyCreateForm(props: TranslationKeyCreateFormProps) {
  const {
    onCreated,
    onCancel,
    onPendingChange,
    cancelLabel = "Cancel",
  } = props;

  const options = useTranslationKeyFilterOptions();

  const form = useForm<TranslationKeyFormValues>({
    defaultValues: EMPTY_TRANSLATION_KEY_FORM_VALUES,
    mode: "onSubmit",
  });

  const { handleSubmit, clearErrors, setError } = form;

  const [requestError, setRequestError] = useState<string>();

  const [pending, setPending] = useState(false);

  /**
   * React's disabled render happens after the event which begins the
   * request.
   *
   * This synchronous guard prevents two submit events in the same
   * render frame from creating duplicate requests.
   */
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
     * UI values become the mutation candidate only here.
     *
     * Do not teach individual fields about HTTP DTO normalization.
     */
    const parsed = createTranslationKeyInputSchema.safeParse({
      key: values.key,
      description: values.description.trim() || null,
      categoryId: Number(values.categoryId),
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
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

    /**
     * Positive integer validation alone is not enough.
     *
     * A category ID must correspond to an option actually loaded
     * from the canonical category endpoint.
     */
    const categoryExists = options.categoryOptions.some(
      (option) => String(option.value) === values.categoryId,
    );

    if (!categoryExists) {
      setError("categoryId", {
        type: "validate",
        message: "Choose an available category.",
      });

      return;
    }

    inFlight.current = true;

    setPending(true);

    onPendingChange?.(true);

    let record: TranslationKey;

    try {
      record = (await createTranslationKey(parsed.data)).data;
    } catch (failure: unknown) {
      setRequestError(
        failure instanceof Error
          ? failure.message
          : "Unable to create translation key.",
      );

      return;
    } finally {
      inFlight.current = false;
      setPending(false);
      onPendingChange?.(false);
    }

    onCreated(record);
  });

  return (
    <FormProvider {...form}>
      {/* <Stack
        component="form"
        noValidate
        spacing={3}
        aria-busy={pending}
        onSubmit={submit}
      > */}
      <TranslationKeyFormShell
        pending={pending}
        submitDisabled={categoryUnavailable}
        cancelLabel={cancelLabel}
        submitLabel="Create key"
        pendingLabel="Creating..."
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
          <Alert severity="warning">
            No categories are available. Create a category before adding a key.
          </Alert>
        ) : null}

        <TranslationKeyFormFields
          autoFocusKey
          disabled={pending}
          categoryDisabled={categoryUnavailable}
          categoryOptions={options.categoryOptions}
        />

        {/* <Stack
          direction={{
            xs: "column-reverse",
            sm: "row",
          }}
          spacing={1}
          justifyContent="flex-end"
        >
          <Button
            type="button"
            variant="outlined"
            startIcon={<CloseRounded />}
            onClick={onCancel}
            disabled={pending}
          >
            {cancelLabel}
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="success"
            startIcon={<SaveRounded />}
            loading={pending}
            loadingPosition="start"
            disabled={pending || categoryUnavailable}
          >
            {pending ? "Creating..." : "Create key"}
          </Button>
        </Stack> */}
      </TranslationKeyFormShell>

      {/* </Stack> */}
    </FormProvider>
  );
}
