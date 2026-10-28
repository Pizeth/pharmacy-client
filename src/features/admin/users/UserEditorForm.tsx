"use client";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { ResourceTableLoading } from "@/components/Tables/ResourceTableLoading";
import { UserForm } from "./UserForm";
import { usersApi } from "./api";
import type { ComponentProps } from "react";
export function UserEditorForm(props: ComponentProps<typeof UserForm>) {
  const fresh = useQuery({ queryKey: ["admin-users", "dialog-editor", props.mode, props.record?.id],
    queryFn: () => usersApi.get(props.record!.id), enabled: props.mode !== "create" && !!props.record,
    gcTime: 0, refetchOnWindowFocus: false, retry: false });
  if (props.mode !== "create" && fresh.isLoading) return <ResourceTableLoading message="Loading user…" />;
  if (fresh.error) return <Alert severity="error" action={<Button onClick={() => fresh.refetch()}>Retry</Button>}>{fresh.error.message}</Alert>;
  if (props.mode !== "create" && !fresh.data) return null;
  return <UserForm {...props} record={fresh.data} />;
}
