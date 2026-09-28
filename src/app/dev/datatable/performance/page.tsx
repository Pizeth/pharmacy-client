import {
  notFound,
} from "next/navigation";

import {
  DataTablePerformanceAcceptance,
} from "@/components/DataTable/mui/dev/performance/DataTablePerformanceAcceptance";

export default function DataTablePerformancePage() {
  if (
    process.env.NODE_ENV !==
    "development"
  ) {
    notFound();
  }

  return (
    <DataTablePerformanceAcceptance />
  );
}
