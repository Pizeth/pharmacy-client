"use client";

import { Alert, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent } from "react";
import { z } from "zod";
import { RecordCard } from "@/components/Tables/ResourceRecordPage";
import { TOKEN_KEY } from "@/types/constants";

const settingsSchema = z.object({
  phone: z.string().nullable(),
  providers: z.array(z.object({ id: z.number(), name: z.string() })),
  links: z.array(z.object({
    id: z.number().int().positive(),
    handle: z.string(),
    url: z.string().nullish(),
    provider: z.object({ name: z.string() }),
  })),
});

type SettingsPath = "" | "/phone" | "/social-links";

async function request(path: SettingsPath, method: string, body?: object, signal?: AbortSignal) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const options: RequestInit = {
    method,
    redirect: "error",
    signal,
    credentials: "include",
    headers: {
      ...(body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };
  let response: Response;
  switch (path) {
    case "/phone":
      response = await fetch("/api/account/settings/phone", options);
      break;
    case "/social-links":
      response = await fetch("/api/account/settings/social-links", options);
      break;
    default:
      response = await fetch("/api/account/settings", options);
  }
  const result = await response.json();
  if (!response.ok) throw new Error(result?.message || "Could not save account settings.");
  return result?.data ?? result;
}

export function ContactSettings({ userId }: { readonly userId: string }) {
  const queryClient = useQueryClient();
  const queryKey = ["account-contact-settings", userId];
  const settings = useQuery({
    queryKey,
    queryFn: async ({ signal }) => settingsSchema.parse(await request("", "GET", undefined, signal)),
  });
  const mutation = useMutation({
    mutationFn: ({ path, method, body }: { path: SettingsPath; method: string; body?: object }) => request(path, method, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  function savePhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    mutation.mutate({ path: "/phone", method: "PATCH", body: { phone: String(data.get("phone") ?? "").trim() || null } });
  }

  function saveLink(event: FormEvent<HTMLFormElement>, id?: number) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = {
      handle: String(data.get("handle") ?? "").trim(),
      url: String(data.get("url") ?? "").trim() || null,
      ...(id === undefined ? { providerId: Number(data.get("providerId")) } : {}),
    };
    mutation.mutate({
      path: "/social-links",
      method: id === undefined ? "POST" : "PATCH",
      body: id === undefined ? body : { id, changes: body },
    }, { onSuccess: () => { if (id === undefined) form.reset(); } });
  }

  if (settings.isPending) return <Typography role="status">Loading contact settings…</Typography>;
  const loadError = settings.isError ? (<Alert severity="error" action={<Button onClick={() => { settings.refetch().catch(() => { console.error("Account settings request failed."); }); }}>Retry</Button>}>Could not load contact settings.</Alert>) : null;
  if (!settings.data) return loadError;
  const { phone, providers, links } = settings.data;
  return <>
    {loadError}
    {mutation.error && <Alert severity="error">{mutation.error.message}</Alert>}
    {mutation.isSuccess && <Alert severity="success">Contact settings saved.</Alert>}
    <RecordCard title="Contact phone" description="This number is displayed in your officer profile.">
      <Stack component="form" key={phone ?? ""} spacing={2} onSubmit={savePhone}>
        <TextField name="phone" label="Phone number" type="tel" defaultValue={phone ?? ""} />
        <Button type="submit" variant="contained" disabled={mutation.isPending}>Save phone</Button>
      </Stack>
    </RecordCard>
    <RecordCard title="Social profile links">
      {links.map(link => (
        <Stack component="form" key={link.id} spacing={2} onSubmit={event => { saveLink(event, link.id); }}>
          <Typography component="h3" variant="subtitle2">{link.provider.name}</Typography>
          <TextField name="handle" label="Profile handle" required defaultValue={link.handle} />
          <TextField name="url" label="Profile URL" type="url" defaultValue={link.url ?? ""} />
          <Stack direction="row" spacing={1}>
            <Button type="submit" disabled={mutation.isPending}>Save link</Button>
            <Button color="error" disabled={mutation.isPending} onClick={() => { mutation.mutate({ path: "/social-links", method: "DELETE", body: { id: link.id } }); }}>Remove link</Button>
          </Stack>
        </Stack>
      ))}
      {providers.length > 0 && (
        <Stack component="form" spacing={2} onSubmit={event => { saveLink(event); }}>
          <TextField select name="providerId" label="Social network" defaultValue={providers[0].id}>
            {providers.map(provider => <MenuItem key={provider.id} value={provider.id}>{provider.name}</MenuItem>)}
          </TextField>
          <TextField name="handle" label="New profile handle" required />
          <TextField name="url" label="New profile URL" type="url" />
          <Button type="submit" variant="contained" disabled={mutation.isPending}>Add social link</Button>
        </Stack>
      )}
    </RecordCard>
  </>;
}
