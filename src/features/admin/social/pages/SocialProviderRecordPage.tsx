"use client";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { useQuery } from "@tanstack/react-query";
import { ResourceRecordPage, isResourceIntegerId } from "@/components/Tables/ResourceRecordPage";
import { socialApi } from "../api";
import { useAdminAccess } from "../useAdminAccess";
import { SocialProviderRecordContent } from "./SocialProviderRecordContent";
export function SocialProviderRecordPage({ id }: { id: string }) {
  const access = useAdminAccess();
  const valid = isResourceIntegerId(id);
  const query = useQuery({ queryKey: ["admin-social", "detail", id], queryFn: async ({ signal }) => {
    const record = (await socialApi.providers(signal)).find(item => item.id === Number(id));
    if (!record) throw new Error("Social provider not found.");
    return record;
  }, enabled: access.allowed && valid, retry: false });
  const record = query.data;
  useBreadcrumbLabel(`/admin/social-provider/${encodeURIComponent(id)}`, access.allowed ? record?.name : undefined);
  const error = !valid ? "Invalid social provider ID." : !access.isLoading && !access.allowed ? "Administrator access is required." : query.error?.message;
  return <ResourceRecordPage title="Social provider details" subtitle="Platform identity, availability and public links." backHref="/admin/social-provider" editHref={`/admin/social-provider/edit/${id}`} loading={access.isLoading || query.isLoading} error={error} onRetry={() => { if (valid && access.allowed) void query.refetch(); }}>
    {record && <SocialProviderRecordContent record={record} />}
  </ResourceRecordPage>;
}
