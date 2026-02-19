"use client";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";

/* Layout UI */
export default function FTSLayout({ children }: { children: React.ReactNode }) {
  /* Place children where you want to render a page or nested layout */
  return <DrawerAppBar>{children}</DrawerAppBar>;
}
