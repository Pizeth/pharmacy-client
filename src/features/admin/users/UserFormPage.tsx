"use client";
import { ResourceFormLoading } from "@/components/forms/ResourceFormLoading";
import { PersonAddOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { useBreadcrumbLabel } from "@/components/layouts/breadcrumbLabels";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { useAdminAccess } from "../social/useAdminAccess";
import { usersApi, type UserMode } from "./api";
import { UserForm } from "./UserForm";
import * as S from "../social/styles";
export function UserFormPage({ mode, id }: { mode: UserMode; id?: string }) {
  const access = useAdminAccess(); const router = useRouter();
  const validId = !!id && /^[a-zA-Z0-9_-]+$/.test(id);
  const user = useQuery({ queryKey: ["admin-users", "page-editor", mode, id], queryFn: () => usersApi.get(id!), enabled: access.allowed && mode !== "create" && validId, retry: false, gcTime: 0, refetchOnWindowFocus: false });
  useBreadcrumbLabel(`/admin/users/${mode}/${encodeURIComponent(id ?? "")}`, access.allowed && mode !== "create" && user.data ? `${mode === "edit" ? "Edit" : "Delete"} ${user.data.name}` : undefined);
  const back = () => router.push("/admin/users");
  const selfDelete = mode === "delete" && id === String(access.data?.id);
  return <ResourcePage titleIcon={mode === "create" ? <PersonAddOutlined /> : mode === "edit" ? <EditOutlined /> : <DeleteOutline />} title={`${mode === "create" ? "Create" : mode === "edit" ? "Edit" : "Delete"} user`} maxWidth="xl"><S.Root>
    {access.isLoading ? <ResourceFormLoading /> : !access.allowed ? <Alert severity="error">Administrator access is required.</Alert> : mode !== "create" && !validId ? <Alert severity="error">Invalid user ID.</Alert> : user.isLoading ? <ResourceFormLoading /> : user.error ? <Alert severity="error" action={<Button onClick={() => user.refetch()}>Retry</Button>}>{user.error.message}</Alert> : selfDelete ? <Alert severity="error">You cannot delete your own account here.</Alert> : mode !== "create" && !user.data ? <Alert severity="error">User not found.</Alert> : <S.Panel><UserForm key={`${mode}-${id ?? "new"}`} mode={mode} record={user.data} onCancel={back} onSuccess={back} /></S.Panel>}
  </S.Root></ResourcePage>;
}
