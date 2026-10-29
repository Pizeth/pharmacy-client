"use client";

import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { ResourceFormLoading } from "@/components/forms/ResourceFormLoading";
import { readTranslationKey } from "../api";
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

  const fresh = useQuery({ queryKey: ["translation-keys", "dialog-editor", record?.id],
    queryFn: ({ signal }) => readTranslationKey(Number(record!.id), signal), enabled: !!record,
    gcTime: 0, refetchOnWindowFocus: false, retry: false });
  const [pending, setPending] = useState(false);

  return (
    <FormDialog
      open={record !== null}
      title="Edit translation key"
      dedicatedPageHref={record ? `/admin/i18n/edit/${encodeURIComponent(record.id)}` : undefined}
      dedicatedPageLabel="Open dedicated edit page"
      subtitle={record ? `Update metadata for ${record.key}.` : undefined}
      icon={<EditOutlined />}
      pending={pending}
      closeAriaLabel="Close edit translation key dialog"
      onClose={onClose}
    >
      {record && fresh.isLoading && <ResourceFormLoading message="Loading translation key…" />}
      {fresh.error && <Alert severity="error" action={<Button onClick={() => fresh.refetch()}>Retry</Button>}>{fresh.error.message}</Alert>}
      {record && fresh.data && (
        <TranslationKeyEditForm
          key={record.id}
          record={fresh.data}
          cancelLabel="Close"
          onPendingChange={setPending}
          onCancel={onClose}
          onUpdated={onUpdated}
        />
      )}
    </FormDialog>
  );
}
