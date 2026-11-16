"use client";
import { useQuery } from "@tanstack/react-query";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { ResourceRecordPage } from "@/components/Tables/ResourceRecordPage";
import { useAdminAccess } from "../social/useAdminAccess";
import { usersApi } from "./api";
import { UserRecordContent } from "./UserRecordContent";
export function UserRecordPage({ id }: { id: string }) {
  const access = useAdminAccess();
  const valid = /^[a-zA-Z0-9_-]+$/.test(id);
  const query = useQuery({ queryKey: ["admin-users", "detail", id], queryFn: ({ signal }) => usersApi.detail(id, signal), enabled: access.allowed && valid, retry: false });
  useBreadcrumbLabel(`/admin/users/${encodeURIComponent(id)}`, access.allowed ? query.data?.name : undefined);
  const error = !valid ? "Invalid user ID." : !access.isLoading && !access.allowed ? "Administrator access is required." : query.error?.message;
  return <ResourceRecordPage title="User profile" subtitle="Personal information, account details and connected services." backHref="/admin/users" editHref={`/admin/users/edit/${encodeURIComponent(id)}`} loading={access.isLoading || query.isLoading} error={error} onRetry={() => { if (valid && access.allowed) void query.refetch(); }}>
    {query.data && <UserRecordContent user={query.data} isSelf={String(access.data?.id) === id} canManageRole={(access.data?.role ?? "").split(",").some(role => /^(super|sys|system)[_-]?admin$/i.test(role.trim()))} />}
  </ResourceRecordPage>;
}
