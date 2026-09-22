"use client";

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
      {record && translation && (
        <TranslationValueEditForm
          key={`${record.id}:${translation.locale}`}
          record={record}
          translation={translation}
          cancelLabel="Close"
          onPendingChange={setPending}
          onCancel={onClose}
          onUpdated={onUpdated}
        />
      )}
    </FormDialog>
  );
}
