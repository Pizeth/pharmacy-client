import type { Metadata } from "next";
import { HrdContactPage } from "@/features/hrd/pages/contact/HrdContactPage";

export const metadata: Metadata = {
  title: "ទំនាក់ទំនង | HRD",
  description: "ទីតាំង និងព័ត៌មានទំនាក់ទំនងនាយកដ្ឋានធនធានមនុស្ស ក្រសួងមុខងារសាធារណៈ",
};

export default function Page() {
  return <HrdContactPage />;
}
