import type { Metadata } from "next";
import { HrdHomePage } from "@/components/hrd/HrdHomePage";

export const metadata: Metadata = {
  title: "នាយកដ្ឋានធនធានមនុស្ស | HRD",
  description: "ព័ត៌មាន ទម្រង់ពាក្យស្នើសុំ និងឯកសាររបស់នាយកដ្ឋានធនធានមនុស្ស ក្រសួងមុខងារសាធារណៈ",
};

export default function HrdPage() {
  return <HrdHomePage />;
}
