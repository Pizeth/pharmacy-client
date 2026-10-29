"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { EditOutlined, DeleteOutline } from "@mui/icons-material";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import { FormDialog } from "@/components/forms/FormDialog";
import { ResourceFormLoading } from "@/components/forms/ResourceFormLoading";
import {
  rolesApi,
  type ApplicationRole,
  type RoleMode,
  type RoleMetadata,
} from "./api";
import { RoleForm } from "./RoleForm";
export function RoleEditor({
  mode,
  id,
  metadata,
  onClose,
  onSuccess,
}: {
  readonly mode: RoleMode;
  readonly id?: number;
  readonly metadata: RoleMetadata;
  readonly onClose: () => void;
  readonly onSuccess: (record: ApplicationRole) => void;
}) {
  const [pending, setPending] = useState(false);
  const record = useQuery({
    queryKey: ["admin-roles", "editor", mode, id],
    queryFn: ({ signal }) => rolesApi.get(id!, signal),
    enabled: mode !== "create" && !!id,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
  const close = () => {
    if (!pending) onClose();
  };
  return (
    <FormDialog
      open
      title={`${mode === "create" ? "Create" : mode === "edit" ? "Edit" : "Delete"} role`}
      subtitle={record.data?.name}
      pending={pending}
      icon={mode === "edit" ? <EditOutlined /> : mode === "delete" ? <DeleteOutline /> : <AdminPanelSettingsOutlined />}
      onClose={close}
      maxWidth="md"
      dedicatedPageHref={`/admin/roles/${mode}${id ? `/${id}` : ""}`}
      dedicatedPageLabel={`Open dedicated ${mode} page`}
    >
      {record.isLoading ? (
        <ResourceFormLoading message="Loading role…" />
      ) : record.error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => record.refetch()}>Retry</Button>}
        >
          {record.error.message}
        </Alert>
      ) : (
        (mode === "create" || record.data) && (
          <RoleForm
            mode={mode}
            record={record.data}
            metadata={metadata}
            onCancel={close}
            onSuccess={onSuccess}
            onPendingChange={setPending}
          />
        )
      )}
    </FormDialog>
  );
}
