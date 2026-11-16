"use client";
import { setFormIssues, showFieldIssue } from "@/components/forms/formValidationFeedback";
import { FormActions } from "@/components/forms/FormActions";

import { useEffect, useRef } from "react";
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
  const parse = (values: ProviderInput) => providerInputSchema.safeParse({
    ...values, websiteUrl: values.websiteUrl || null, icon: values.icon || null,
  });
  const valid = destructive || parse(draft).success;
  return <FormProvider {...form}><S.Form noValidate aria-busy={pending} onBlur={event => { const result = parse(form.getValues()); if (!destructive && !result.success) showFieldIssue(form, event.target, result.error.issues); }} onSubmit={async event => {
    event.preventDefault();
    if (inFlight.current || (mode !== "create" && !record)) return;
    form.clearErrors();
    const parsed = parse(form.getValues());
    if (!destructive && !parsed.success) { setFormIssues(form, parsed.error.issues); return; }
    inFlight.current = true;
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
    {mutation.error && <Alert severity="error">{mutation.error.message}</Alert>}
    <FormActions>
      <Button autoFocus={destructive} variant="outlined" disabled={pending} onClick={onCancel}>Cancel</Button>
      <Button variant="contained" color={destructive ? "error" : "success"} type="submit" disabled={pending || !valid || (mode !== "create" && !record)} loading={pending}>
        {destructive ? "Delete provider" : mode === "edit" ? "Save changes" : "Create provider"}
      </Button>
    </FormActions>
  </S.Form></FormProvider>;
}
