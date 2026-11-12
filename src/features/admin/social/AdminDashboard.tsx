"use client";
import { setFormIssues } from "@/components/forms/formValidationFeedback";
import { FormActions } from "@/components/forms/FormActions";
import NextLink from "next/link";
import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Typography } from "@mui/material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { profileInputSchema, socialApi, type ProfileInput, type SocialProfile } from "./api";
import { useAdminAccess } from "./useAdminAccess";
import { Controller, FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { BaseInput, SelectField, TextField } from "@/components/inputs";
import { PersonOutline as UserRound, AlternateEmail as AtSign, PublicOutlined as Globe, ShareOutlined as Share2 } from "@mui/icons-material";
import { DashboardAnalytics } from "../DashboardAnalytics";
import * as S from "./styles";

const empty: ProfileInput = { providerId: 0, handle: "", url: null };
export function AdminDashboard() {
  const access = useAdminAccess();
  const providers = useAdminProviders(access.allowed);
  return <ResourcePage showHeader={false} title="Administration dashboard" subtitle="Manage application resources and administrator social profiles." maxWidth="xl"><S.Root data-page-content>
    {access.isLoading ? <LinearProgress /> : !access.allowed ? <Alert severity="error">Administrator access is required.</Alert> : <>
      <DashboardAnalytics />
      <S.Overview>{[
        ["Users", "/admin/users", "Manage user accounts"],
        ["Social providers", "/admin/social-provider", providers.data ? `${providers.data.filter(p => p.isEnabled).length} enabled / ${providers.data.length} total` : "Manage available platforms"],
        ["Translations", "/admin/i18n", "Manage keys, locales and translations"],
        ["Documents", "/admin/documents", "Open document administration"],
      ].map(([title, href, detail]) => <S.Panel key={href}><Typography variant="h6">{title}</Typography><Typography>{detail}</Typography><Button component={NextLink} href={href}>Open {title}</Button></S.Panel>)}</S.Overview>
      <AdminSocialProfiles adminId={access.data?.id} providers={providers} />
    </>}
  </S.Root></ResourcePage>;
}

function AdminSocialProfiles({ adminId, providers }: {
  readonly adminId: NonNullable<ReturnType<typeof useAdminAccess>["data"]>["id"] | undefined;
  readonly providers: ReturnType<typeof useAdminProviders>;
}) {
  const client = useQueryClient();
  const [userInput, setUserInput] = useState("");
  const userForm = useForm({ values: { userId: userInput || String(adminId ?? "") } });
  const userId = Number(userInput || adminId);
  const validUser = Number.isSafeInteger(userId) && userId > 0;
  const form = useForm<{ providerId: string; handle: string; url: string }>({ defaultValues: { providerId: "", handle: "", url: "" } });
  const draft = form.watch();
  const setDraft = (value: ProfileInput) => form.reset({ providerId: value.providerId ? String(value.providerId) : "", handle: value.handle, url: value.url ?? "" });
  const [editing, setEditing] = useState<SocialProfile | null>(null);
  const [deleting, setDeleting] = useState<SocialProfile | null>(null);
  const profiles = useAdminProfiles(userId, validUser);
  const invalidate = async () => { await Promise.all([client.invalidateQueries({ queryKey: ["admin-social", "profiles"] }), client.invalidateQueries({ queryKey: ["site-footer"] })]); };
  const save = useMutation({ mutationFn: (data: ProfileInput) => socialApi.saveProfile(userId, data, editing?.id), onSuccess: async () => { setDraft(empty); setEditing(null); await invalidate(); } });
  const remove = useMutation({ mutationFn: (profile: SocialProfile) => socialApi.deleteProfile(userId, profile.id), onSuccess: async () => { setDeleting(null); await invalidate(); } });
  const pending = save.isPending || remove.isPending;
  const reset = () => { setEditing(null); setDraft(empty); form.clearErrors(); save.reset(); };
  const profileCards = profiles.data?.map(profile => <S.Panel key={profile.id}><Typography variant="h6">{profile.provider.name}</Typography><Typography>{profile.handle}</Typography><Typography>{profile.url || "No profile URL"}</Typography><S.Actions><Button disabled={pending} onClick={() => { setEditing(profile); setDraft({ providerId: profile.providerId, handle: profile.handle, url: profile.url }); form.clearErrors(); save.reset(); }}>Edit {profile.provider.name} profile</Button><Button color="error" disabled={pending} onClick={() => { remove.reset(); setDeleting(profile); }}>Delete {profile.provider.name} profile</Button></S.Actions></S.Panel>);
  const profileEditor = (
    <ProfileEditor form={form} onSave={save.mutate}>
    <Controller name="userId" control={userForm.control} render={({ field, fieldState }) => <BaseInput field={{ ...field, onChange: event => { field.onChange(event); setUserInput(event.target.value); reset(); } }} fieldState={fieldState} name="userId" iconStart={<UserRound fontSize="small" />} fullWidth label="User ID" type="number" disabled={pending} helperText="Defaults to your account. Enter another administrator's numeric user ID to manage their profiles." />} />
    {!validUser && <Alert severity="info">Enter a positive numeric user ID.</Alert>}
    <ProfileQueryStatus providers={providers} profiles={profiles} />
    <SelectField name="providerId" label="Provider" required iconStart={<Share2 fontSize="small" />} disabled={pending || !providers.data} placeholder={providers.isLoading ? "Loading providers…" : "Select a provider"} options={(providers.data ?? []).filter(provider => provider.isEnabled || provider.id === Number(draft.providerId)).map(provider => ({ value: String(provider.id), label: `${provider.name}${!provider.isEnabled ? " (disabled)" : ""}` }))} />
    <TextField name="handle" iconStart={<AtSign fontSize="small" />} fullWidth label="Handle" required disabled={pending} />
    <TextField name="url" iconStart={<Globe fontSize="small" />} fullWidth label="Profile URL" type="url" disabled={pending} helperText="Use the full https:// profile URL." />
    {save.error && <Alert severity="error">{save.error.message}</Alert>}
    {save.isSuccess && <Alert severity="success">Social profile saved.</Alert>}
    <FormActions>{editing && <Button disabled={pending} onClick={reset}>Cancel edit</Button>}<Button type="submit" variant="contained" disabled={pending || !validUser || !providers.data?.some(p => p.isEnabled)}>{save.isPending ? "Saving…" : editing ? "Save profile" : "Add profile"}</Button></FormActions>
  </ProfileEditor>
  );
  return <>
      <ProfileSettingsSection>
        {profileEditor}
      {profiles.data?.length === 0 && <Alert severity="info">This user has no social profiles.</Alert>}
        {profileCards}
      </ProfileSettingsSection>
      <DeleteProfileDialog
        profile={deleting}
        pending={pending}
        error={remove.error}
        onClose={() => { setDeleting(null); }}
        onConfirm={remove.mutate}
      />
  </>;
}

function useAdminProviders(allowed: boolean) {
  return useQuery({ queryKey: ["admin-social", "providers"], queryFn: ({ signal }) => socialApi.providers(signal), enabled: allowed });
}

function DeleteProfileDialog({ profile, pending, error, onClose, onConfirm }: {
  readonly profile: SocialProfile | null;
  readonly pending: boolean;
  readonly error: Error | null;
  readonly onClose: () => void;
  readonly onConfirm: (profile: SocialProfile) => void;
}) {
  return (
    <Dialog open={Boolean(profile)} onClose={() => { if (!pending) onClose(); }} aria-labelledby="delete-profile-title">
      <DialogTitle id="delete-profile-title">Delete social profile?</DialogTitle>
      <DialogContent>
        This removes the profile link from this user.
        {error && <Alert severity="error">{error.message}</Alert>}
      </DialogContent>
      <DialogActions disableSpacing>
        <FormActions>
          <Button disabled={pending} onClick={onClose}>Cancel</Button>
          <Button color="error" disabled={pending} onClick={() => { if (profile) onConfirm(profile); }}>
            Delete profile
          </Button>
        </FormActions>
      </DialogActions>
    </Dialog>
  );
}

function ProfileQueryStatus({ providers, profiles }: {
  readonly providers: ReturnType<typeof useAdminProviders>;
  readonly profiles: ReturnType<typeof useAdminProfiles>;
}) {
  return (
    <>
      {providers.isLoading || profiles.isLoading ? <LinearProgress /> : null}
      {providers.error && <Alert severity="error" action={<Button onClick={() => providers.refetch()}>Retry</Button>}>{providers.error.message}</Alert>}
      {profiles.error && <Alert severity="error" action={<Button onClick={() => profiles.refetch()}>Retry</Button>}>{profiles.error.message}</Alert>}
    </>
  );
}

function useAdminProfiles(userId: number, enabled: boolean) {
  return useQuery({ queryKey: ["admin-social", "profiles", userId], queryFn: ({ signal }) => socialApi.profiles(userId, signal), enabled });
}

function ProfileSettingsSection({ children }: { readonly children: React.ReactNode }) {
  return (
    <S.ProfileSettings>
      <S.ProfileSummary>Profile settings</S.ProfileSummary>
      <S.Root>{children}</S.Root>
    </S.ProfileSettings>
  );
}

function ProfileEditor({ form, onSave, children }: {
  readonly form: UseFormReturn<{ providerId: string; handle: string; url: string }>;
  readonly onSave: (profile: ProfileInput) => void;
  readonly children: ReactNode;
}) {
  return (
    <S.Panel aria-label="Administrator social profiles">
      <Typography variant="h6">Administrator social profiles</Typography>
      <Typography variant="body2">
        Manage social profiles for an administrator. These profiles do not change the shared site-wide footer social links.
      </Typography>
      <FormProvider {...form}>
        <S.Form noValidate onSubmit={event => {
          event.preventDefault();
          form.clearErrors();
          const values = form.getValues();
          const result = profileInputSchema.safeParse({
            ...values,
            providerId: Number(values.providerId),
            url: values.url || null,
          });
          if (!result.success) {
            setFormIssues(form, result.error.issues);
            return;
          }
          onSave(result.data);
        }}>
          {children}
        </S.Form>
      </FormProvider>
    </S.Panel>
  );
}
