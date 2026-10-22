import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SideImagePreview from "@/components/auth/SideImagePreview";

export const metadata: Metadata = { title: "Login background preview", robots: { index: false, follow: false } };
export default function LoginBackgroundPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <SideImagePreview />;
}
