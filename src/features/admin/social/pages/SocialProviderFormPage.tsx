"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, LinearProgress } from "@mui/material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { SocialProviderForm, type ProviderFormMode } from "../forms/SocialProviderForm";
import { socialApi } from "../api";
import { useAdminAccess } from "../useAdminAccess";
import * as S from "../styles";

export function SocialProviderFormPage({ mode, recordId }: { readonly mode: ProviderFormMode; readonly recordId?: number }) {
  const router = useRouter();
  const access = useAdminAccess();
  const providers = useQuery({ queryKey: ["admin-social", "providers"], queryFn: ({ signal }) => socialApi.providers(signal), enabled: access.allowed && mode !== "create" });
  const record = providers.data?.find(provider => provider.id === recordId);
  const back = () => router.push("/admin/social-provider");
  return <ResourcePage title={`${mode === "create" ? "Create" : mode === "edit" ? "Edit" : "Delete"} social provider`} subtitle={record?.name} maxWidth="xl"><S.Root>
    {access.isLoading ? <LinearProgress /> : !access.allowed ? <Alert severity="error">Administrator access is required.</Alert> :
      mode !== "create" && providers.isLoading ? <LinearProgress /> :
      providers.error ? <Alert severity="error" action={<Button onClick={() => providers.refetch()}>Retry</Button>}>{providers.error.message}</Alert> :
      mode !== "create" && !record ? <Alert severity="error" action={<Button onClick={back}>Back to providers</Button>}>Social provider not found.</Alert> :
      <S.Panel><SocialProviderForm key={`${mode}-${recordId ?? "new"}`} mode={mode} record={record} onCancel={back} onSuccess={back} /></S.Panel>}
  </S.Root></ResourcePage>;
}
