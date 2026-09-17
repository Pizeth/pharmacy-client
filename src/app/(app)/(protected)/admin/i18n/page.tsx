import { ResourcePage } from "@/components/layouts/ResourcePage";
import { TranslationKeyTable } from "@/features/i18n/translation-keys";

export default function TranslationKeysPage() {
  return (
    <ResourcePage
      title="Translation key management"
      subtitle="Manage application translation keys, categories, locales, and values."
      maxWidth="xl"
    >
      <TranslationKeyTable />
    </ResourcePage>
  );
}
