import type { Metadata } from "next";
import SideImagePreview from "@/components/auth/SideImagePreview";

export const metadata: Metadata = { title: "Login background preview", robots: { index: false, follow: false } };
export default function LoginBackgroundPreviewPage() { return <SideImagePreview />; }
