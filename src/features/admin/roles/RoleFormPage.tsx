"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { rolesApi, type RoleMode } from "./api";
import { RoleForm } from "./RoleForm";
import * as S from "./styles";
export function RoleFormPage({
  mode,
  recordId,
}: {
  readonly mode: RoleMode;
  readonly recordId?: string;
}) {
  const router = useRouter();
  const valid =
    mode === "create" ||
    (!!recordId &&
      /^[1-9]\d*$/.test(recordId) &&
      Number.isSafeInteger(Number(recordId)));
  const metadata = useQuery({
    queryKey: ["admin-roles", "metadata"],
    queryFn: ({ signal }) => rolesApi.metadata(signal),
    enabled: valid,
    retry: false,
  });
  const record = useQuery({
    queryKey: ["admin-roles", "editor", mode, recordId],
    queryFn: ({ signal }) => rolesApi.get(Number(recordId), signal),
    enabled: valid && mode !== "create" && metadata.data?.canManage === true,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  const back = () => router.push("/admin/roles");
  return (
    <ResourcePage
      title={`${mode === "create" ? "Create" : mode === "edit" ? "Edit" : "Delete"} role`}
      subtitle={record.data?.name}
      maxWidth="xl"
    >
      <S.Root>
        {!valid ? (
          <Alert severity="error">Invalid role ID.</Alert>
        ) : metadata.isLoading || record.isLoading ? (
          <ResourceTableLoading message="Loading role…" />
        ) : metadata.error || record.error ? (
          <Alert
            severity="error"
            action={
              <Button
                onClick={() => {
                  void metadata.refetch();
                  if (metadata.data?.canManage && mode !== "create")
                    void record.refetch();
                }}
              >
                Retry
              </Button>
            }
          >
            {metadata.error?.message || record.error?.message}
          </Alert>
        ) : (
          metadata.data?.canManage &&
          (mode === "create" || record.data) && (
            <S.Panel>
              <RoleForm
                key={`${mode}-${recordId ?? "new"}`}
                mode={mode}
                record={record.data}
                metadata={metadata.data}
                onCancel={back}
                onSuccess={back}
              />
            </S.Panel>
          )
        )}
      </S.Root>
    </ResourcePage>
  );
}
