"use client";

import { useRouter } from "next/navigation";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { TranslationKeyCreateForm } from "@/features/i18n/translation-keys/forms";

export default function CreateTranslationPage() {
  const router = useRouter();

  return (
    <ResourcePage
      title="Create translation key"
      subtitle="Add key metadata to the translation registry."
      maxWidth="md"
      surface
    >
      <TranslationKeyCreateForm
        cancelLabel="Back to translation keys"
        onCancel={() => {
          router.push("/admin/i18n");
        }}
        onCreated={() => {
          router.replace("/admin/i18n");

          router.refresh();
        }}
      />
    </ResourcePage>
  );
}
