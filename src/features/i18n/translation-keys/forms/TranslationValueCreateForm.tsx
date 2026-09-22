"use client";

import { useMemo, useRef, useState } from "react";
import { Alert } from "@mui/material";
import { LanguageOutlined, TranslateOutlined } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";
import { SelectField, TextField } from "@/components/inputs";
import { createTranslation, TranslationKeyApiError } from "../api";
import { createTranslationInputSchema } from "../schemas";
import type { TranslationKey, TranslationValue } from "../schemas";
import { TRANSLATION_KEY_LOCALE_OPTIONS } from "../locales";
import { TranslationKeyFormShell } from "./TranslationKeyFormShell";

export interface TranslationValueCreateFormValues {
  readonly locale: string;
  readonly value: string;
}

const EMPTY_TRANSLATION_VALUE_FORM_VALUES: TranslationValueCreateFormValues = {
  locale: "",
  value: "",
};

export interface TranslationValueCreateFormProps {
  readonly record: TranslationKey;
  readonly onCreated: (translation: TranslationValue) => void;
  readonly onCancel: () => void;
  readonly onPendingChange?: (pending: boolean) => void;
  readonly cancelLabel?: string;
}

/**
 * Create one locale value belonging to one TranslationKey.
 *
 * Ownership:
 *
 * RHF
 *   editable field state
 *
 * createTranslationInputSchema
 *   mutation validation
 *
 * TranslationKey resource
 *   supported-locale policy
 *   duplicate locale prevention
 *
 * API
 *   nested translation creation
 *   runtime response validation
 */
export function TranslationValueCreateForm(
  props: TranslationValueCreateFormProps,
) {
  const {
    record,
    onCreated,
    onCancel,
    onPendingChange,
    cancelLabel = "Close",
  } = props;

  const availableLocaleOptions = useMemo(() => {
    const existingLocales = new Set(
      record.translations.map((translation) => translation.locale),
    );

    return TRANSLATION_KEY_LOCALE_OPTIONS.filter(
      (option) => !existingLocales.has(option.value),
    );
  }, [record.translations]);

  const form = useForm<TranslationValueCreateFormValues>({
    defaultValues: EMPTY_TRANSLATION_VALUE_FORM_VALUES,
    mode: "onSubmit",
  });

  const { handleSubmit, clearErrors, setError } = form;

  const [requestError, setRequestError] = useState<string>();

  /**
   * React's disabled state does not become visible until the render
   * following the submit event.
   *
   * Protect the transport synchronously as well.
   */
  const inFlight = useRef(false);

  const [pending, setPending] = useState(false);

  const noAvailableLocales = availableLocaleOptions.length === 0;

  const submit = handleSubmit(async (values) => {
    if (inFlight.current || noAvailableLocales) {
      return;
    }

    clearErrors();

    setRequestError(undefined);

    const parsed = createTranslationInputSchema.safeParse({
      locale: values.locale,
      value: values.value,
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (field === "locale" || field === "value") {
          setError(field, {
            type: "schema",
            message: issue.message,
          });
        }
      }

      return;
    }

    /**
     * Schema validity is not enough.
     *
     * The current UI exposes only supported application locales, and
     * one key may have at most one value for each exposed locale.
     */
    const localeIsAvailable = availableLocaleOptions.some(
      (option) => option.value === parsed.data.locale,
    );

    if (!localeIsAvailable) {
      setError("locale", {
        type: "validate",
        message: "Choose an available locale.",
      });

      return;
    }

    inFlight.current = true;

    setPending(true);

    onPendingChange?.(true);

    let created: TranslationValue;

    try {
      created = (await createTranslation(record.id, parsed.data)).data;
    } catch (failure: unknown) {
      /**
       * Preserve backend field-level validation when the Standard API
       * identifies the offending nested resource field.
       */
      if (failure instanceof TranslationKeyApiError) {
        const field = failure.payload?.field;

        if (field === "locale" || field === "value") {
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
          : "Unable to add translation.",
      );

      return;
    } finally {
      inFlight.current = false;

      setPending(false);

      onPendingChange?.(false);
    }

    onCreated(created);
  });

  return (
    <FormProvider {...form}>
      <TranslationKeyFormShell
        pending={pending}
        submitDisabled={noAvailableLocales}
        cancelLabel={cancelLabel}
        submitLabel="Add translation"
        pendingLabel="Adding..."
        onCancel={onCancel}
        onSubmit={submit}
      >
        {requestError && <Alert severity="error">{requestError}</Alert>}

        {noAvailableLocales && (
          <Alert severity="info">
            All supported locales already have translations for this key.
          </Alert>
        )}

        <SelectField
          name="locale"
          label="Locale"
          required
          disabled={pending || noAvailableLocales}
          iconStart={<LanguageOutlined />}
          options={availableLocaleOptions}
          placeholder="Choose a locale"
          helperText="Locale for this translation value."
        />

        <TextField
          name="value"
          label="Translation value"
          required
          multiline
          minRows={4}
          disabled={pending}
          resettable
          iconStart={<TranslateOutlined />}
          helperText="Text displayed for the selected locale."
        />
      </TranslationKeyFormShell>
    </FormProvider>
  );
}
