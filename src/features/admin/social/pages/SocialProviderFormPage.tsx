"use client";
import { ResourceFormLoading } from "@/components/forms/ResourceFormLoading";
import { ShareOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { SocialProviderForm, type ProviderFormMode } from "../forms/SocialProviderForm";
import { socialApi } from "../api";
import { useAdminAccess } from "../useAdminAccess";
import * as S from "../styles";

export function SocialProviderFormPage({ mode, recordId }: { readonly mode: ProviderFormMode; readonly recordId?: number }) {
  const router = useRouter();
  const access = useAdminAccess();
  const providers = useQuery({ queryKey: ["admin-social", "page-editor", mode, recordId], queryFn: ({ signal }) => socialApi.providers(signal), gcTime: 0, refetchOnWindowFocus: false, enabled: access.allowed && mode !== "create" });
  const record = providers.data?.find(provider => provider.id === recordId);
  useBreadcrumbLabel(`/admin/social-provider/${mode}/${recordId ?? ""}`, mode !== "create" && access.allowed && record ? `${mode === "edit" ? "Edit" : "Delete"} ${record.name}` : undefined);
  const back = () => router.push("/admin/social-provider");
  return <ResourcePage titleIcon={mode === "create" ? <ShareOutlined /> : mode === "edit" ? <EditOutlined /> : <DeleteOutline />} title={`${mode === "create" ? "Create" : mode === "edit" ? "Edit" : "Delete"} social provider`} subtitle={record?.name} maxWidth="xl"><S.Root>
    {access.isLoading ? <ResourceFormLoading /> : !access.allowed ? <Alert severity="error">Administrator access is required.</Alert> :
      mode !== "create" && providers.isLoading ? <ResourceFormLoading /> :
      providers.error ? <Alert severity="error" action={<Button onClick={() => providers.refetch()}>Retry</Button>}>{providers.error.message}</Alert> :
      mode !== "create" && !record ? <Alert severity="error" action={<Button onClick={back}>Back to providers</Button>}>Social provider not found.</Alert> :
      <S.Panel><SocialProviderForm key={`${mode}-${recordId ?? "new"}`} mode={mode} record={record} onCancel={back} onSuccess={back} /></S.Panel>}
  </S.Root></ResourcePage>;
}
