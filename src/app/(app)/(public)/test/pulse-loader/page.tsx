import type { Metadata } from "next";
import PulseLoader from "@/components/effect/loaders/loader";

export const metadata: Metadata = {
  title: "Pulse loader preview",
  robots: { index: false, follow: false },
};

/** Keep the real fullscreen loader mounted for visual inspection. */
export default function PulseLoaderPreviewPage() {
  return <PulseLoader />;
}
