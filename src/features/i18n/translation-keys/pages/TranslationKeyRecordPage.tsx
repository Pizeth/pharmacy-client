"use client";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { useQuery } from "@tanstack/react-query";
import { ResourceRecordPage, isResourceIntegerId } from "@/components/Tables/ResourceRecordPage";
import { TranslationKeyRecordContent } from "./TranslationKeyRecordContent";
import { readTranslationKey } from "../api";
export function TranslationKeyRecordPage({ id }: { id: string }) {
  const valid = isResourceIntegerId(id);
  const query = useQuery({ queryKey: ["translation-keys", "detail-page", id], queryFn: ({ signal }) => readTranslationKey(Number(id), signal), enabled: valid, retry: false });
  const record = query.data;
  useBreadcrumbLabel(`/admin/i18n/${encodeURIComponent(id)}`, record?.key);
  return <ResourceRecordPage title="Translation key details" subtitle="Locale coverage, full translation values and category information." backHref="/admin/i18n" editHref={`/admin/i18n/edit/${id}`} loading={query.isLoading} error={!valid ? "Invalid translation key ID." : query.error?.message} onRetry={() => { if (valid) void query.refetch(); }}>
    {record && <TranslationKeyRecordContent record={record} onChanged={() => { void query.refetch(); }} />}
  </ResourceRecordPage>;
}
