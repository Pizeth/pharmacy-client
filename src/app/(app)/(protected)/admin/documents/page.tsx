import { ResourcePage } from "@/components/layouts/ResourcePage";
import type { DataTableDisplayMode } from "@/components/DataTable";
import { DocumentTableFixturePreview } from "@/features/documents/testing";

export interface DocumentsVisualTestPageProps {
  readonly searchParams: Promise<{
    readonly display?: string | string[];
  }>;
}

function resolveDisplayMode(
  value: string | string[] | undefined,
): DataTableDisplayMode {
  const candidate = Array.isArray(value) ? value[0] : value;

  return candidate === "table" ? "table" : "card";
}

export default async function DocumentsVisualTestPage(
  props: DocumentsVisualTestPageProps,
) {
  const searchParams = await props.searchParams;
  const displayMode = resolveDisplayMode(searchParams.display);

  return (
    <ResourcePage
      title="Document DataTable visual proof"
      subtitle={
        displayMode === "card"
          ? "Fixture-backed card presentation. Use ?display=table to compare the shared table presentation."
          : "Fixture-backed table presentation. Use ?display=card to compare the shared card presentation."
      }
      maxWidth="xl"
    >
      <DocumentTableFixturePreview displayMode={displayMode} />
    </ResourcePage>
  );
}
