"use client";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";

/* Layout UI */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Place children where you want to render a page or nested layout */
  //   return <DrawerAppBar>{children}</DrawerAppBar>;

  return (
    <Authenticated
      key="protected-layout"
      // If not authenticated, redirect to /login
      fallback={<NavigateToResource resource="login" />}
    >
      <DrawerAppBar>{children}</DrawerAppBar>
    </Authenticated>
  );
}
