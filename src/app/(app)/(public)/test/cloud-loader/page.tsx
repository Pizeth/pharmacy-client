import type { Metadata } from "next";
import CloudLoader, { CloudLoaderMessage } from "@/components/effect/loaders/CloudLoader/CloudLoader";

export const metadata: Metadata = { title: "Cloud loader preview", robots: { index: false, follow: false } };
export default function CloudLoaderPreviewPage() {
  return <><CloudLoader /><CloudLoaderMessage variant="body2">Loading translation keys…</CloudLoaderMessage></>;
}
