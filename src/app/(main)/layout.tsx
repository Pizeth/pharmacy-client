"use client";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";
import { Authenticated } from "@refinedev/core";

/* Layout UI */
export default function FTSLayout({ children }: { children: React.ReactNode }) {
  /* Place children where you want to render a page or nested layout */
  return (
    <Authenticated
      key="protected"
      fallback={null} // Middleware handles the redirect, so we show nothing here
    >
      <DrawerAppBar>{children}</DrawerAppBar>
    </Authenticated>
  );
}
