"use client";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { useQuery } from "@tanstack/react-query";
import { ResourceRecordPage, isResourceIntegerId } from "@/components/Tables/ResourceRecordPage";
import { rolesApi } from "./api";
import { RoleRecordContent } from "./RoleRecordContent";
export function RoleRecordPage({ id }: { id: string }) {
  const valid = isResourceIntegerId(id);
  const metadata = useQuery({ queryKey: ["admin-roles", "metadata"], queryFn: ({ signal }) => rolesApi.metadata(signal), enabled: valid, retry: false });
  const query = useQuery({ queryKey: ["admin-roles", "detail", id], queryFn: ({ signal }) => rolesApi.get(Number(id), signal), enabled: valid && metadata.data?.canManage === true, retry: false });
  useBreadcrumbLabel(`/admin/roles/${encodeURIComponent(id)}`, metadata.data?.canManage ? query.data?.name : undefined);
  const error = !valid ? "Invalid role ID." : metadata.error?.message ?? (metadata.data && !metadata.data.canManage ? "Super administrator access is required." : query.error?.message);
  return <ResourceRecordPage title="Role details" subtitle="Identity, policy grants and assigned accounts." backHref="/admin/roles" editHref={`/admin/roles/edit/${id}`} loading={valid && (metadata.isLoading || query.isLoading)} error={error} onRetry={() => { if (!valid) return; void metadata.refetch(); if (metadata.data?.canManage) void query.refetch(); }}>
    {query.data && metadata.data && <RoleRecordContent record={query.data} metadata={metadata.data} />}
  </ResourceRecordPage>;
}
