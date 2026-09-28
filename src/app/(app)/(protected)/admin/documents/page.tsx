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
      subtitle="Fixture-backed Refine proof with runtime table/card switching through the shared DataTable toolbar."
      maxWidth="xl"
    >
      <DocumentTableFixturePreview defaultDisplayMode={displayMode} />
    </ResourcePage>
  );
}
