import type { Metadata } from "next";
import { HrdAboutPage } from "@/features/hrd/pages/about/HrdAboutPage";

export const metadata: Metadata = {
  title: "ព័ត៌មានសង្ខេបនាយកដ្ឋាន | HRD",
  description: "ព័ត៌មានសង្ខេបនាយកដ្ឋាន នាយកដ្ឋានធនធានមនុស្ស ក្រសួងមុខងារសាធារណៈ",
};

export default function Page() {
  return <HrdAboutPage section="overview" />;
}
