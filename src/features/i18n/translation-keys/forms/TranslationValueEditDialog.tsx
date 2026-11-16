"use client";

import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { ResourceFormLoading } from "@/components/forms/ResourceFormLoading";
import { readTranslationKey } from "../api";
import { useState } from "react";
import { EditOutlined } from "@mui/icons-material";

import { FormDialog } from "@/components/forms/FormDialog";

import type {
  TranslationKey,
  TranslationValue,
} from "../schemas";

import {
  getTranslationKeyLocaleLabel,
} from "../locales";

import {
  TranslationValueEditForm,
} from "./TranslationValueEditForm";

export interface TranslationValueEditDialogProps {
  readonly record: TranslationKey | null;
  readonly translation: TranslationValue | null;
  readonly onClose: () => void;
  readonly onUpdated: (translation: TranslationValue) => void;
}

export function TranslationValueEditDialog(
  props: TranslationValueEditDialogProps,
) {
  const {
    record,
    translation,
    onClose,
    onUpdated,
  } = props;

  const [pending, setPending] = useState(false);

  const open = record !== null && translation !== null;
  const fresh = useQuery({ queryKey: ["translation-keys", "value-dialog-editor", record?.id, translation?.id],
    queryFn: async ({ signal }) => {
      const key = await readTranslationKey(Number(record!.id), signal);
      const value = key.translations.find(item => item.id === translation?.id);
      if (!value) throw new Error("Translation no longer exists.");
      return { key, value };
    }, enabled: open, gcTime: 0, refetchOnWindowFocus: false, retry: false });

  return (
    <FormDialog
      open={open}
      title="Edit translation"
      subtitle={
        record && translation
          ? `Update ${getTranslationKeyLocaleLabel(
              translation.locale,
            )} for ${record.key}.`
          : undefined
      }
      icon={<EditOutlined />}
      pending={pending}
      maxWidth="sm"
      closeAriaLabel="Close edit translation dialog"
      onClose={onClose}
    >
      {open && fresh.isLoading && <ResourceFormLoading message="Loading translation…" />}
      {fresh.error && <Alert severity="error" action={<Button onClick={() => fresh.refetch()}>Retry</Button>}>{fresh.error.message}</Alert>}
      {record && translation && fresh.data && (
        <TranslationValueEditForm
          key={`${record.id}:${translation.locale}`}
          record={fresh.data.key}
          translation={fresh.data.value}
          cancelLabel="Close"
          onPendingChange={setPending}
          onCancel={onClose}
          onUpdated={onUpdated}
        />
      )}
    </FormDialog>
  );
}
