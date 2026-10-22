import { notFound } from "next/navigation";
import { SelectionDependenciesAcceptance } from "@/components/DataTable/mui/dev/SelectionDependenciesAcceptance";

export default function SelectionDependenciesPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <SelectionDependenciesAcceptance />;
}
