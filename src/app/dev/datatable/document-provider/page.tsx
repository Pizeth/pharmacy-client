import { notFound } from "next/navigation";
import { DocumentProviderAcceptance } from "@/features/documents/testing/DocumentProviderAcceptance";

/** Local-only proof for the older independent Refine resource, not tracked documents. */
export default function DocumentProviderAcceptancePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <DocumentProviderAcceptance />;
}
