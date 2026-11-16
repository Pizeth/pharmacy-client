import type { Metadata } from "next";
import { HrdAboutPage } from "@/features/hrd/pages/about/HrdAboutPage";

export const metadata: Metadata = {
  title: "រចនាសម្ព័ន្ធ | HRD",
  description: "រចនាសម្ព័ន្ធ នាយកដ្ឋានធនធានមនុស្ស ក្រសួងមុខងារសាធារណៈ",
};

export default function Page() {
  return <HrdAboutPage section="structure" />;
}
