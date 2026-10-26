"use client";
import { useState } from "react";
import NextLink from "next/link";
import { Button } from "@mui/material";
import { AddRounded, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { FormDialog } from "@/components/forms/FormDialog";
import { SocialProviderForm, type ProviderFormMode } from "./SocialProviderForm";
import type { SocialProvider } from "../api";

export function SocialProviderDialog({ mode, record, onClose, onSuccess }: {
  readonly mode: ProviderFormMode; readonly record?: SocialProvider;
  readonly onClose: () => void; readonly onSuccess: (record: SocialProvider) => void;
}) {
  const [pending, setPending] = useState(false);
  const title = mode === "create" ? "Create social provider" : mode === "edit" ? "Edit social provider" : "Delete social provider";
  const href = `/admin/social-provider/${mode}${record ? `/${record.id}` : ""}`;
  return <FormDialog open title={title} subtitle={record?.name} pending={pending} onClose={onClose}
    icon={mode === "create" ? <AddRounded /> : mode === "edit" ? <EditOutlined /> : <DeleteOutline />}>
    <Button component={NextLink} href={href} disabled={pending}>Open dedicated {mode} page</Button>
    <SocialProviderForm mode={mode} record={record} onCancel={onClose} onSuccess={onSuccess} onPendingChange={setPending} />
  </FormDialog>;
}
