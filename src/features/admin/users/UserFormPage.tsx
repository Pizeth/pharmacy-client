"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, LinearProgress } from "@mui/material";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { useAdminAccess } from "../social/useAdminAccess";
import { usersApi, type UserMode } from "./api";
import { UserForm } from "./UserForm";
import * as S from "../social/styles";
export function UserFormPage({ mode, id }: { mode: UserMode; id?: string }) {
  const access = useAdminAccess(); const router = useRouter();
  const validId = !!id && /^[a-zA-Z0-9_-]+$/.test(id);
  const user = useQuery({ queryKey: ["admin-users", "record", id], queryFn: () => usersApi.get(id!), enabled: access.allowed && mode !== "create" && validId, retry: false });
  const back = () => router.push("/admin/users");
  const selfDelete = mode === "delete" && id === String(access.data?.id);
  return <ResourcePage title={`${mode === "create" ? "Create" : mode === "edit" ? "Edit" : "Delete"} user`} maxWidth="xl"><S.Root>
    {access.isLoading ? <LinearProgress /> : !access.allowed ? <Alert severity="error">Administrator access is required.</Alert> : mode !== "create" && !validId ? <Alert severity="error">Invalid user ID.</Alert> : user.isLoading ? <LinearProgress /> : user.error ? <Alert severity="error" action={<Button onClick={() => user.refetch()}>Retry</Button>}>{user.error.message}</Alert> : selfDelete ? <Alert severity="error">You cannot delete your own account here.</Alert> : mode !== "create" && !user.data ? <Alert severity="error">User not found.</Alert> : <S.Panel><UserForm key={`${mode}-${id ?? "new"}`} mode={mode} record={user.data} onCancel={back} onSuccess={back} /></S.Panel>}
  </S.Root></ResourcePage>;
}
