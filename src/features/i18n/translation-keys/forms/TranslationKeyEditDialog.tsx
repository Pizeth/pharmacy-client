"use client";

import { useState } from "react";
import { EditOutlined } from "@mui/icons-material";
import { FormDialog } from "@/components/forms/FormDialog";
import type { TranslationKey } from "../schemas";
import { TranslationKeyEditForm } from "./TranslationKeyEditForm";

export interface TranslationKeyEditDialogProps {
  readonly record: TranslationKey | null;
  readonly onClose: () => void;
  readonly onUpdated: (record: TranslationKey) => void;
}

export function TranslationKeyEditDialog(props: TranslationKeyEditDialogProps) {
  const { record, onClose, onUpdated } = props;

  const [pending, setPending] = useState(false);

  return (
    <FormDialog
      open={record !== null}
      title="Edit translation key"
      subtitle={record ? `Update metadata for ${record.key}.` : undefined}
      icon={<EditOutlined />}
      pending={pending}
      closeAriaLabel="Close edit translation key dialog"
      onClose={onClose}
    >
      {record && (
        <TranslationKeyEditForm
          key={record.id}
          record={record}
          cancelLabel="Close"
          onPendingChange={setPending}
          onCancel={onClose}
          onUpdated={onUpdated}
        />
      )}
    </FormDialog>
  );
}
