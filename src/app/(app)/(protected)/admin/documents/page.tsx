import { ResourcePage } from "@/components/layouts/ResourcePage";
import { DocumentTableFixturePreview } from "@/features/documents/testing";

export default function DocumentsVisualTestPage() {
  return (
    <ResourcePage
      title="Document DataTable visual proof"
      subtitle="Fixture-backed route for visual acceptance of the modern Document table while the production Document API is still unavailable."
      maxWidth="xl"
    >
      <DocumentTableFixturePreview />
    </ResourcePage>
  );
}
