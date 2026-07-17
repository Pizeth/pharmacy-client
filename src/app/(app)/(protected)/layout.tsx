"use client";
import PulseLoader from "@/components/effect/loaders/loader";
import DrawerAppBar from "@/components/Navigations/DrawerAppBar";
import { VERIFY_ID_PATH } from "@/types/constants";
import { Authenticated, useGetIdentity } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

// export const VERIFY_ID_PATH = "/verify-id";
function ProfileGate({ children }: { children: React.ReactNode }) {
  const { data: identity, isLoading } = useGetIdentity<{
    isLinked?: boolean;
  }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const redirected = useRef(false); // 👈 prevents double-firing during transition

  // 👇 remember WHICH pathname we last fired a redirect FROM,
  // not just "did we ever redirect" — resets naturally on new pathnames
  const redirectedFromPath = useRef<string | null>(null);

  const isOnVerifyPage =
    !!VERIFY_ID_PATH && pathname?.startsWith(VERIFY_ID_PATH);

  console.log("loading", isLoading);
  console.log("identity", identity);
  console.log("pathname:", JSON.stringify(pathname));
  console.log("VERIFY_ID_PATH:", VERIFY_ID_PATH);
  console.log("isOnVerifyPage:", isOnVerifyPage);

  useEffect(() => {
    if (isLoading || !identity) return;
    // if (!identity) return;

    // Already redirected away from this exact pathname — don't refire
    if (redirectedFromPath.current === pathname) return;

    // Unlinked, and not already on the verify page → send there,
    // remembering where the user actually wanted to go
    if (identity.isLinked === false && !isOnVerifyPage) {
      // router.replace(VERIFY_ID_PATH);
      redirectedFromPath.current = pathname;
      const callbackUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      router.replace(
        `${VERIFY_ID_PATH}?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
      return;
    }

    // Already linked but sitting on the verify page → bounce back
    // to wherever they originally came from (or /fts as fallback)
    if (identity.isLinked === true && isOnVerifyPage) {
      // router.replace("/fts");
      redirectedFromPath.current = pathname;
      const callbackUrl = searchParams.get("callbackUrl");
      router.replace(callbackUrl ? decodeURIComponent(callbackUrl) : "/fts");
      return;
    }

    // if (!isLoading && identity && identity.isLinked === false) {
    //   router.replace("/verify-id");
    // }
  }, [isLoading, identity, isOnVerifyPage, pathname, searchParams, router]);

  // 👇 Same principle as the login page: never render real content
  // while a redirect is pending or about to be decided.
  const willRedirectAway =
    (identity?.isLinked === false && !isOnVerifyPage) ||
    (identity?.isLinked === true && isOnVerifyPage);

  console.log("willRedirectAway", willRedirectAway);
  console.log("redirected.current", redirectedFromPath.current);
  console.log("identity", identity);
  console.log("isLoading", isLoading);

  // if (isLoading) return <PulseLoader />;
  if (isLoading || !identity || willRedirectAway) {
    return <PulseLoader />;
  }

  // if (isLoading) return <PulseLoader />;
  // if (identity?.isLinked === false) return <PulseLoader />; // brief flash before redirect

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
      <ProfileGate>
        <DrawerAppBar>{children}</DrawerAppBar>
      </ProfileGate>
    </Authenticated>
  );
}
