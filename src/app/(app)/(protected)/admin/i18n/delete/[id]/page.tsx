import { notFound } from "next/navigation";
import { TranslationKeyDeletePage } from "@/features/i18n/translation-keys/pages/TranslationKeyDeletePage";

export default async function DeleteTranslationKeyRoute({ params }: {
  readonly params: Promise<{ readonly id: string }>;
}) {
  const { id } = await params;
  const recordId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(recordId) || recordId <= 0) notFound();
  return <TranslationKeyDeletePage recordId={recordId} />;
}
