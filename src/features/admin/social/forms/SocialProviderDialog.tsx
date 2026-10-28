"use client";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { socialApi } from "../api";
import { useState } from "react";
import { AddRounded, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { FormDialog } from "@/components/forms/FormDialog";
import { SocialProviderForm, type ProviderFormMode } from "./SocialProviderForm";
import type { SocialProvider } from "../api";

export function SocialProviderDialog({ mode, record, onClose, onSuccess }: {
  readonly mode: ProviderFormMode; readonly record?: SocialProvider;
  readonly onClose: () => void; readonly onSuccess: (record: SocialProvider) => void;
}) {
  const fresh = useQuery({
    queryKey: ["admin-social", "dialog-editor", mode, record?.id],
    queryFn: async ({ signal }) => {
      const result = (await socialApi.providers(signal)).find(item => item.id === record?.id);
      if (!result) throw new Error("Social provider not found.");
      return result;
    },
    enabled: mode !== "create" && !!record, gcTime: 0, refetchOnWindowFocus: false, retry: false,
  });
  const [pending, setPending] = useState(false);
  const title = mode === "create" ? "Create social provider" : mode === "edit" ? "Edit social provider" : "Delete social provider";
  const href = `/admin/social-provider/${mode}${record ? `/${record.id}` : ""}`;
  return <FormDialog open title={title} subtitle={record?.name} pending={pending} onClose={onClose} dedicatedPageHref={href} dedicatedPageLabel={`Open dedicated ${mode} page`}
    icon={mode === "create" ? <AddRounded /> : mode === "edit" ? <EditOutlined /> : <DeleteOutline />}>
    {mode !== "create" && fresh.isLoading ? <ResourceTableLoading message="Loading social provider…" /> : fresh.error ? <Alert severity="error" action={<Button onClick={() => fresh.refetch()}>Retry</Button>}>{fresh.error.message}</Alert> : (mode === "create" || fresh.data) && <SocialProviderForm mode={mode} record={fresh.data} onCancel={onClose} onSuccess={onSuccess} onPendingChange={setPending} />}
  </FormDialog>;
}
