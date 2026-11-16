import type { Metadata } from "next";
import { HrdDocumentsPageRoot } from "@/features/hrd/components/layout/HrdPageLayout";
import { PublicDocumentsTable } from "@/features/hrd/documents/table/PublicDocumentsTable";

export const metadata: Metadata = {
  title: "បណ្ដុំឯកសារ | នាយកដ្ឋានធនធានមនុស្ស",
  description: "ស្វែងរក និងទាញយកលិខិតរដ្ឋបាលសាធារណៈ និងលិខិតបទដ្ឋានគតិយុត្តិ",
};

export default function HrdDocumentsPage() {
  return (
    <HrdDocumentsPageRoot maxWidth="xl">
      <PublicDocumentsTable />
    </HrdDocumentsPageRoot>
  );
}
