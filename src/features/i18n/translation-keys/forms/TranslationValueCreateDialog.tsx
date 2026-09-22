"use client";

import { useState } from "react";
import { TranslateOutlined } from "@mui/icons-material";
import { FormDialog } from "@/components/forms/FormDialog";
import type { TranslationKey, TranslationValue } from "../schemas";
import { TranslationValueCreateForm } from "./TranslationValueCreateForm";

export interface TranslationValueCreateDialogProps {
  readonly record: TranslationKey | null;
  readonly onClose: () => void;
  readonly onCreated: (translation: TranslationValue) => void;
}

/**
 * Nested TranslationValue create surface.
 *
 * FormDialog gives this the same safety contract as TranslationKey
 * create/edit/delete:
 *
 * - backdrop cannot dismiss
 * - Escape cannot dismiss
 * - X closes only while idle
 * - form Cancel closes only while idle
 * - successful mutation closes through the parent
 */
export function TranslationValueCreateDialog(
  props: TranslationValueCreateDialogProps,
) {
  const { record, onClose, onCreated } = props;

  const [pending, setPending] = useState(false);

  return (
    <FormDialog
      open={record !== null}
      title="Add translation"
      subtitle={record ? `Add a locale value for ${record.key}.` : undefined}
      icon={<TranslateOutlined />}
      pending={pending}
      maxWidth="sm"
      closeAriaLabel="Close add translation dialog"
      onClose={onClose}
    >
      {record && (
        <TranslationValueCreateForm
          key={record.id}
          record={record}
          cancelLabel="Close"
          onPendingChange={setPending}
          onCancel={onClose}
          onCreated={onCreated}
        />
      )}
    </FormDialog>
  );
}
