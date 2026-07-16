"use client";
import PulseLoader from "@/components/effect/loaders/loader";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";
import { Authenticated, useGetIdentity } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfileGate({ children }: { children: React.ReactNode }) {
  const { data: identity, isLoading } = useGetIdentity<{
    isLinked?: boolean;
  }>();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && identity && identity.isLinked === false) {
      router.replace("/verify-id");
    }
  }, [isLoading, identity, router]);

  if (isLoading) return <PulseLoader />;
  if (identity?.isLinked === false) return <PulseLoader />; // brief flash before redirect

  return <>{children}</>;
}

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
      loading={<PulseLoader />} // 👈 shown while authProvider.check() is pending
      // If not authenticated, redirect to /login
      fallback={<NavigateToResource resource="login" />}
    >
      <DrawerAppBar>{children}</DrawerAppBar>
    </Authenticated>
  );
}
