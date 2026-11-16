import { UserRecordPage } from "@/features/admin/users/UserRecordPage";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserRecordPage id={id} />;
}
