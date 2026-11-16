import { notFound } from "next/navigation";
import { SocialProviderFormPage } from "@/features/admin/social/pages/SocialProviderFormPage";
export default async function DeleteProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recordId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(recordId) || recordId <= 0) notFound();
  return <SocialProviderFormPage mode="delete" recordId={recordId} />;
}
