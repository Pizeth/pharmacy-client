"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, Button, Typography } from "@mui/material";
import { PersonOutline as UserRound, MailOutline as Mail } from "@mui/icons-material";
import { TextField, PasswordField } from "@/components/inputs";
import { usersApi, userInputSchema, type AdminUser, type UserMode } from "./api";
import * as S from "../social/styles";
export function UserForm({ mode, record, onCancel, onSuccess, onPendingChange }: { mode: UserMode; record?: AdminUser; onCancel: () => void; onSuccess: () => void; onPendingChange?: (pending: boolean) => void }) {
  const form = useForm({ defaultValues: { name: record?.name ?? "", email: record?.email ?? "", password: "" } });
  const [validation, setValidation] = useState("");
  const inFlight = useRef(false);
  const client = useQueryClient();
  const mutation = useMutation({ mutationFn: () => usersApi.save(mode, form.getValues(), record), onSuccess: async () => { await client.invalidateQueries({ queryKey: ["admin-users"] }); onSuccess(); } });
  useEffect(() => { onPendingChange?.(mutation.isPending); }, [mutation.isPending, onPendingChange]);
  return <FormProvider {...form}><S.Form noValidate aria-busy={mutation.isPending} onSubmit={async event => {
    event.preventDefault(); if (inFlight.current) return;
    const parsed = userInputSchema.safeParse(form.getValues());
    if (mode !== "delete" && !parsed.success) { setValidation(parsed.error.issues[0].message); return; }
    setValidation(""); inFlight.current = true;
    try { await mutation.mutateAsync(); } catch { /* Keep the form open and present the API error. */ } finally { inFlight.current = false; }
  }}>
    {mode === "delete" ? <><Typography>Delete user <strong>{record?.name}</strong> ({record?.email})?</Typography><Alert severity="warning">This permanently removes the account. This cannot be undone.</Alert></> : <>
      <TextField name="name" label="Name" required fullWidth iconStart={<UserRound fontSize="small" />} disabled={mutation.isPending} />
      <TextField name="email" label="Email" type="email" required fullWidth iconStart={<Mail fontSize="small" />} disabled={mutation.isPending} />
      {mode === "create" && <PasswordField name="password" label="Temporary password" required fullWidth autoComplete="new-password" helperText="At least 8 characters. Share securely with the account owner." disabled={mutation.isPending} />}
    </>}
    {(validation || mutation.error) && <Alert severity="error">{validation || mutation.error?.message}</Alert>}
    <S.Actions><Button disabled={mutation.isPending} onClick={onCancel}>Cancel</Button><Button type="submit" variant="contained" color={mode === "delete" ? "error" : "primary"} disabled={mutation.isPending}>{mutation.isPending ? "Saving…" : mode === "create" ? "Create user" : mode === "edit" ? "Save user" : "Delete user"}</Button></S.Actions>
  </S.Form></FormProvider>;
}
