"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { providerInputSchema, socialApi, type ProviderInput, type SocialProvider } from "../api";
import { FormProvider, useForm } from "react-hook-form";
import { TextField } from "@/components/inputs";
import { KeyOutlined as KeyRound, Title as Type, PublicOutlined as Globe, ImageOutlined as Image } from "@mui/icons-material";
import * as S from "../styles";

export type ProviderFormMode = "create" | "edit" | "delete";
export interface SocialProviderFormProps {
  readonly mode: ProviderFormMode;
  readonly record?: SocialProvider;
  readonly onCancel: () => void;
  readonly onSuccess: (record: SocialProvider) => void;
  readonly onPendingChange?: (pending: boolean) => void;
}
const empty: ProviderInput = { key: "", name: "", websiteUrl: null, icon: null, isEnabled: true };

/** One validation/mutation contract shared by modal and dedicated routes. */
export function SocialProviderForm({ mode, record, onCancel, onSuccess, onPendingChange }: SocialProviderFormProps) {
  const client = useQueryClient();
  const form = useForm<ProviderInput>({ defaultValues: record ? {
    key: record.key, name: record.name, websiteUrl: record.websiteUrl, icon: record.icon, isEnabled: record.isEnabled,
  } : empty });
  const draft = form.watch();
  const [validation, setValidation] = useState("");
  const inFlight = useRef(false);
  const mutation = useMutation({
    mutationFn: (data: ProviderInput) => mode === "delete"
      ? socialApi.deleteProvider(record!.id)
      : socialApi.saveProvider(data, mode === "edit" ? record!.id : undefined),
    onSuccess: async result => {
      await Promise.all([client.invalidateQueries({ queryKey: ["admin-social"] }), client.invalidateQueries({ queryKey: ["site-footer"] })]);
      onSuccess(result);
    },
  });
  useEffect(() => { onPendingChange?.(mutation.isPending); }, [mutation.isPending, onPendingChange]);
  const pending = mutation.isPending;
  const destructive = mode === "delete";
  return <FormProvider {...form}><S.Form noValidate aria-busy={pending} onSubmit={async event => {
    event.preventDefault();
    if (inFlight.current || (mode !== "create" && !record)) return;
    const parsed = providerInputSchema.safeParse({ ...form.getValues(), websiteUrl: form.getValues("websiteUrl") || null, icon: form.getValues("icon") || null });
    if (!destructive && !parsed.success) { setValidation(parsed.error.issues[0].message); return; }
    setValidation(""); inFlight.current = true;
    try { await mutation.mutateAsync(parsed.success ? parsed.data : draft); }
    catch { /* Mutation state presents the API error without dismissing the form. */ }
    finally { inFlight.current = false; }
  }}>
    {destructive ? <>
      <Typography>Delete provider <strong>{record?.name}</strong> ({record?.key})?</Typography>
      <Alert severity="warning">This cannot be undone. Providers in use cannot be deleted; disable them instead.</Alert>
    </> : <>
      <TextField name="key" iconStart={<KeyRound fontSize="small" />} fullWidth label="Provider key" required helperText="Lowercase letters, numbers, hyphens and underscores; starts with a letter." disabled={pending} />
      <TextField name="name" iconStart={<Type fontSize="small" />} fullWidth label="Name" required disabled={pending} />
      <TextField name="websiteUrl" iconStart={<Globe fontSize="small" />} fullWidth label="Website URL" type="url" disabled={pending} />
      <TextField name="icon" iconStart={<Image fontSize="small" />} fullWidth label="Icon key" helperText="For example: telegram, facebook, instagram or youtube." disabled={pending} />
      <FormControlLabel label="Enabled" control={<Checkbox checked={draft.isEnabled} onChange={(_, checked) => form.setValue("isEnabled", checked)} disabled={pending} />} />
    </>}
    {(validation || mutation.error) && <Alert severity="error">{validation || mutation.error?.message}</Alert>}
    <S.Actions>
      <Button autoFocus={destructive} variant="outlined" disabled={pending} onClick={onCancel}>Cancel</Button>
      <Button variant="contained" color={destructive ? "error" : "success"} type="submit" disabled={pending || (mode !== "create" && !record)} loading={pending}>
        {destructive ? "Delete provider" : mode === "edit" ? "Save changes" : "Create provider"}
      </Button>
    </S.Actions>
  </S.Form></FormProvider>;
}
