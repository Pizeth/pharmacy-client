// src/app/(app)/layout.tsx  ← new group for Refine
import RefineContext from "../refineContext";
import { Suspense } from "react";
import PulseLoader from "@/components/effect/loaders/loader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PulseLoader />}>
      <RefineContext>{children}</RefineContext>
    </Suspense>
  );
}
