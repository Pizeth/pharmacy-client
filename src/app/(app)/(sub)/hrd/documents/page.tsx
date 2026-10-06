import type { Metadata } from "next";
import { ResourcePage } from "@/components/layouts/ResourcePage";
import { PublicDocumentsTable } from "@/components/hrd/PublicDocumentsTable";

export const metadata: Metadata = {
  title: "បណ្ដុំឯកសារ | នាយកដ្ឋានធនធានមនុស្ស",
  description: "ស្វែងរក និងទាញយកទម្រង់ពាក្យស្នើសុំ និងលិខិតបទដ្ឋានគតិយុត្តិ",
};

export default function HrdDocumentsPage() {
  return (
      <ResourcePage
        title="ទម្រង់ពាក្យស្នើសុំ"
        subtitle="ស្វែងរក និងទាញយកទម្រង់ពាក្យស្នើសុំ និងលិខិតបទដ្ឋានគតិយុត្តិ"
        maxWidth="xl"
        hero
        badgeLabel="ឯកសារផ្លូវការ"
      >
        <PublicDocumentsTable />
      </ResourcePage>
  );
}

