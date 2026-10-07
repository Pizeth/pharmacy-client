import type { Metadata } from "next";
import { HrdDocumentsPageRoot } from "@/features/hrd/components/layout/HrdPageLayout";
import { PublicDocumentsTable } from "@/features/hrd/documents/table/PublicDocumentsTable";

export const metadata: Metadata = {
  title: "បណ្ដុំឯកសារ | នាយកដ្ឋានធនធានមនុស្ស",
  description: "ស្វែងរក និងទាញយកលិខិតរដ្ឋបាលសាធារណៈ និងលិខិតបទដ្ឋានគតិយុត្តិ",
};

export default function HrdDocumentsPage() {
  return (
    <HrdDocumentsPageRoot
      title="បណ្ដុំឯកសារ"
      subtitle={metadata.description}
      maxWidth="xl"
      // hero
      // badgeLabel="ឯកសារផ្លូវការ"
    >
      <PublicDocumentsTable />
    </HrdDocumentsPageRoot>
  );
}
