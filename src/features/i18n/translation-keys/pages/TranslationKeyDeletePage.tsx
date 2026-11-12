"use client";

import { Alert, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ResourceFormLoading } from "@/components/forms/ResourceFormLoading";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { getTranslationKey } from "../api";
import { TranslationKeyDeleteConfirmation } from "../forms/TranslationKeyDeleteDialog";

const listPath = "/admin/i18n";

export function TranslationKeyDeletePage({ recordId }: { readonly recordId: number }) {
  const router = useRouter();
  const query = useQuery({
    queryKey: ["translation-key-delete", recordId],
    queryFn: async ({ signal }) => (await getTranslationKey(recordId, signal)).data,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  const record = query.data;
  useBreadcrumbLabel(`${listPath}/delete/${recordId}`, record ? `Delete ${record.key}` : undefined);
  return (
    <ResourcePage title="Delete translation key" subtitle="This action cannot be undone." maxWidth="md" surface>
      {query.isPending ? <ResourceFormLoading message="Loading translation key…" /> :
        query.isError ? (
          <Alert severity="error" action={<Button onClick={() => { query.refetch().catch(console.error); }}>Retry</Button>}>
            {query.error.message}
          </Alert>
        ) : record ? (
          <TranslationKeyDeleteConfirmation
            key={record.id}
            record={record}
            presentation="page"
            onClose={() => { router.push(listPath); }}
            onDeleted={() => {
              router.replace(listPath);
              router.refresh();
            }}
          />
        ) : null}
    </ResourcePage>
  );
}
