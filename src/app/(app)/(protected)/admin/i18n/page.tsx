import { ResourcePage } from "@/components/layouts/ResourcePage";
import { TranslationKeyShareableTable } from "@/features/i18n/translation-keys";

export default function TranslationKeysPage() {
  return (
    <ResourcePage showHeader={false}
      title="Translation key management"
      subtitle="Manage application translation keys, categories, locales, and values."
      maxWidth="xl"
    >
      <TranslationKeyShareableTable />
    </ResourcePage>
  );
}
