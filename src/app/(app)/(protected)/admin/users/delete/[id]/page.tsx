import { UserFormPage } from "@/features/admin/users/UserFormPage";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <UserFormPage mode="delete" id={id} />; }
