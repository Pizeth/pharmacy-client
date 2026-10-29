"use client";
import { FormActions } from "@/components/forms/FormActions";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, Button, Typography } from "@mui/material";
import { PersonOutline as UserRound, MailOutline as Mail, LockOutlined, AccountCircleOutlined } from "@mui/icons-material";
import { TextField, PasswordField } from "@/components/inputs";
import { usersApi, userInputSchema, createUserInputSchema, type AdminUser, type AdminUserInput, type UserMode } from "./api";
import { useAsyncFieldRule } from "@/lib/hooks/useFieldValidation";
import hybridResolver from "@/lib/validations/hybridResolver";
import * as S from "../social/styles";
export function UserForm({ mode, record, onCancel, onSuccess, onPendingChange }: { mode: UserMode; record?: AdminUser; onCancel: () => void; onSuccess: () => void; onPendingChange?: (pending: boolean) => void }) {
  const { validate: emailValidate, invalidate: invalidateEmail } = useAsyncFieldRule("email");
  const { validate: usernameValidate, invalidate: invalidateUsername } = useAsyncFieldRule("username");
  const asyncMap = useMemo(() => mode === "delete" ? {} : ({
    email: (value: string) => mode === "edit" && value.toLowerCase() === record?.email.toLowerCase() ? Promise.resolve(true) : emailValidate(value),
    username: (value: string) => mode === "edit" && value.toLowerCase() === record?.username?.toLowerCase() ? Promise.resolve(true) : usernameValidate(value),
  }), [mode, record?.email, record?.username, emailValidate, usernameValidate]);
  const form = useForm({
    defaultValues: { name: record?.name ?? "", username: record?.username ?? "", email: record?.email ?? "", password: "" },
    resolver: hybridResolver(mode === "create" ? createUserInputSchema : userInputSchema, asyncMap),
    mode: "onChange",
  });
  const [validation, setValidation] = useState("");
  const inFlight = useRef(false);
  const client = useQueryClient();
  const mutation = useMutation({ mutationFn: (values: AdminUserInput) => usersApi.save(mode, values, record), onSuccess: async () => { await client.invalidateQueries({ queryKey: ["admin-users"] }); onSuccess(); } });
  const pending = mutation.isPending || form.formState.isValidating;
  useEffect(() => { onPendingChange?.(pending); }, [pending, onPendingChange]);
  return <FormProvider {...form}><S.Form noValidate aria-busy={pending} onSubmit={async event => {
    event.preventDefault(); if (inFlight.current) return;
    setValidation(""); inFlight.current = true;
    try {
      const values = form.getValues();
      if (mode !== "delete") { invalidateEmail(); invalidateUsername(); }
      if (mode !== "delete" && !await form.trigger()) return;
      if (JSON.stringify(values) !== JSON.stringify(form.getValues())) { setValidation("Fields changed during validation. Review and submit again."); return; }
      await mutation.mutateAsync(values);
      invalidateEmail(); invalidateUsername();
    } catch { /* Keep the form open and present the API error. */ } finally { inFlight.current = false; }
  }}>
    {mode === "delete" ? <><Typography>Delete user <strong>{record?.name}</strong> ({record?.email})?</Typography><Alert severity="warning">This permanently removes the account. This cannot be undone.</Alert></> : <>
      <TextField name="name" label="Name" required fullWidth iconStart={<UserRound fontSize="small" />} disabled={mutation.isPending} />
      <TextField name="username" label="Username" required={mode === "create"} fullWidth autoComplete="off" iconStart={<AccountCircleOutlined fontSize="small" />} disabled={mutation.isPending} />
      <TextField name="email" label="Email" type="email" required fullWidth iconStart={<Mail fontSize="small" />} disabled={mutation.isPending} />
      {mode === "create" && <PasswordField name="password" label="Temporary password" iconStart={<LockOutlined fontSize="small" />} required fullWidth autoComplete="new-password" helperText="At least 8 characters. Share securely with the account owner." disabled={mutation.isPending} />}
    </>}
    {(validation || mutation.error) && <Alert severity="error">{validation || mutation.error?.message}</Alert>}
    <FormActions><Button disabled={pending} onClick={onCancel}>Cancel</Button><Button type="submit" variant="contained" color={mode === "delete" ? "error" : "primary"} disabled={pending}>{mutation.isPending ? "Saving…" : form.formState.isValidating ? "Checking…" : mode === "create" ? "Create user" : mode === "edit" ? "Save user" : "Delete user"}</Button></FormActions>
  </S.Form></FormProvider>;
}
