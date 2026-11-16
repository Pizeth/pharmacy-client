// src/app/(app)/layout.tsx  ← new group for Refine
import RefineContext from "../refineContext";
import { Suspense } from "react";
import { RouteContentLoading } from "@/components/layouts/RouteContentLoading";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<RouteContentLoading />}>
      <RefineContext>{children}</RefineContext>
    </Suspense>
  );
}
