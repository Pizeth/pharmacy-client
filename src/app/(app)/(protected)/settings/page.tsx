"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { RecordCard, RecordSection } from "@/components/Tables/ResourceRecordPage";
import { authClient, type ClientUser } from "@/lib/auth-client";
import { API_URL } from "@/types/constants";
import { ContactSettings } from "./ContactSettings";

export default function AccountSettingsPage() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const emailCallback = searchParams.get("flow") === "email-change";
  const { data: session, isPending } = authClient.useSession();
  const user: ClientUser | undefined = session?.user;
  const accounts = useQuery({
    queryKey: ["settings-linked-accounts", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const result = await authClient.listAccounts();
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
  });
  const providers = useQuery({
    queryKey: ["settings-sign-in-providers"],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${API_URL}/api/auth-info/providers`, { signal });
      if (!response.ok) throw new Error("Could not load sign-in providers.");
      const result: { data?: { social?: string[]; generic?: string[] } } = await response.json();
      return [...(result.data?.social ?? []), ...(result.data?.generic ?? [])];
    },
  });
  const [feedback, setFeedback] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const [pending, setPending] = useState(false);
  const linkedProviders = new Set(accounts.data?.map(account => account.providerId));

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setPending(true);
    setFeedback(null);
    try {
      const name = String(fields.get("name") ?? "").trim();
      const username = String(fields.get("username") ?? "").trim();
      if (!name) throw new Error("Enter a display name.");
      if (user?.username && !username) throw new Error("Enter a username or keep your existing username.");
      const result = await authClient.updateUser({
        name,
        ...(username && username !== user?.username ? { username } : {}),
      });
      if (result.error) throw new Error(result.error.message);
      setFeedback({ message: "Profile updated.", severity: "success" });
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : "Could not update your profile.", severity: "error" });
    } finally {
      setPending(false);
    }
  }

  async function connect(provider: "google" | "facebook" | "telegram") {
    setPending(true);
    setFeedback(null);
    try {
      const result = await authClient.linkSocial({
        provider,
        callbackURL: new URL("/settings", window.location.origin).href,
        errorCallbackURL: new URL("/settings", window.location.origin).href,
      });
      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : "Could not connect the provider.", severity: "error" });
    } finally {
      setPending(false);
    }
  }

  async function changeEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setFeedback(null);
    try {
      const result = await authClient.changeEmail({
        newEmail: String(data.get("email") ?? "").trim(),
        callbackURL: new URL("/settings?flow=email-change", window.location.origin).href,
      });
      if (result.error) throw new Error(result.error.message);
      setFeedback({ message: "Check your new email address for the verification link.", severity: "success" });
    } catch (error) {
      setFeedback({ message: error instanceof Error ? error.message : "Could not request an email change.", severity: "error" });
    } finally {
      setPending(false);
    }
  }

  return (
    <ResourcePage title="Account settings" titleComponent="h1" maxWidth="md">
      <RecordSection>
        {callbackError && <Alert severity="error">
          {emailCallback
            ? "The email change link could not be verified. Request a new link."
            : callbackError === "account_already_linked_to_different_user"
            ? "This sign-in method is already connected to another account."
            : "Could not connect the sign-in method. Please try again."}
        </Alert>}
        {feedback && <Alert severity={feedback.severity}>{feedback.message}</Alert>}
        {isPending && <Typography role="status">Loading account settings…</Typography>}
        {!isPending && !user && <Alert severity="error">Your session could not be loaded.</Alert>}
        {user && <>
          <RecordCard title="Profile">
            <Stack component="form" key={user.id} spacing={2} onSubmit={event => { saveProfile(event).catch(() => { console.error("Account settings request failed."); }); }}>
              <TextField name="name" label="Display name" required defaultValue={user.name} />
              <TextField name="username" label="Username" defaultValue={user.username ?? ""} />
              <Button type="submit" variant="contained" disabled={pending}>Save profile</Button>
            </Stack>
          </RecordCard>
          <RecordCard title="Email address" description={`Current email: ${user.email}`}>
            <Stack component="form" spacing={2} onSubmit={event => { changeEmail(event).catch(() => { console.error("Account settings request failed."); }); }}>
              <TextField name="email" type="email" label="New email address" required />
              <Button type="submit" variant="contained" disabled={pending}>Send verification email</Button>
            </Stack>
          </RecordCard>
          {user.isLinked === true && <ContactSettings userId={user.id} />}
          <RecordCard title="Connected sign-in accounts">
            {accounts.isPending && <Typography role="status">Loading connected accounts…</Typography>}
            {accounts.isError && <Alert severity="error" action={<Button onClick={() => { accounts.refetch().catch(() => { console.error("Account settings request failed."); }); }}>Retry</Button>}>Could not load connected accounts.</Alert>}
            {providers.isError && <Alert severity="error" action={<Button onClick={() => { providers.refetch().catch(() => { console.error("Could not reload sign-in providers."); }); }}>Retry providers</Button>}>Could not load available sign-in providers.</Alert>}
            {accounts.data && <>
              {accounts.data.length === 0 && <Typography>No connected accounts.</Typography>}
              {Array.from(linkedProviders).map(provider =>
                <Typography key={provider}>{provider === "credential" ? "Password" : provider}</Typography>
              )}
              {(["google", "facebook", "telegram"] as const).filter(provider =>
                providers.data?.includes(provider) && !linkedProviders.has(provider)
              ).map(provider => (
                <Button key={provider} variant="outlined" disabled={pending} onClick={() => { connect(provider).catch(() => { console.error("Account settings request failed."); }); }}>
                  Connect {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </Button>
              ))}
            </>}
          </RecordCard>
        </>}
      </RecordSection>
    </ResourcePage>
  );
}
