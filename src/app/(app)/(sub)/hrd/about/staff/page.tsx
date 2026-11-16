import type { Metadata } from "next";
import { HrdAboutPage } from "@/features/hrd/pages/about/HrdAboutPage";

export const metadata: Metadata = {
  title: "ថ្នាក់ដឹកនាំ និងមន្រ្តី | HRD",
  description: "ថ្នាក់ដឹកនាំ និងមន្រ្តី នាយកដ្ឋានធនធានមនុស្ស ក្រសួងមុខងារសាធារណៈ",
};

export default function Page() {
  return <HrdAboutPage section="staff" />;
}
