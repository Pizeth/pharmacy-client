import type { Metadata } from "next";
import { HrdAboutPage } from "@/components/hrd/about/HrdAboutPage";

export const metadata: Metadata = {
  title: "អំពីប្រធាននាយកដ្ឋាន | HRD",
  description: "អំពីប្រធាននាយកដ្ឋាន នាយកដ្ឋានធនធានមនុស្ស ក្រសួងមុខងារសាធារណៈ",
};

export default function Page() {
  return <HrdAboutPage section="director" />;
}
