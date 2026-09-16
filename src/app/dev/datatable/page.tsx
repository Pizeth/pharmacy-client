import { notFound } from "next/navigation";
import { DataTableAcceptance } from "@/components/DataTable/mui/dev/DataTableAcceptance";

export default function DataTableAcceptancePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DataTableAcceptance />;
}
