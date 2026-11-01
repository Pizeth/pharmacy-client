"use client";

import { useEffect, useRef, useState } from "react";
import { useIsAuthenticated } from "@refinedev/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { resetAllValidationsAtom } from "@/Stores/validationStore";
import { authClient } from "@/lib/auth-client";
import { getAuthRedirectTarget } from "@/lib/auth/redirectTarget";
import { reportLoginFailure } from "@/lib/auth/loginFeedback";
import { LANDING_PAGE } from "@/types/constants";
import type { AuthAction } from "@/types/auth";

export function useAuthSession(defaultMode: AuthAction) {
  const { isLoading, isFetching, data } = useIsAuthenticated();
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = getAuthRedirectTarget(searchParams, LANDING_PAGE);
  const [currentMode, setCurrentMode] = useState<AuthAction>(defaultMode);
  const oneTapTriggered = useRef(false);
  useEffect(() => {
    if(isFetching)
      return;
    if(!data || data.authenticated) {
      if(data?.authenticated) {
        router.replace(data.redirectTo || destination);
      }
      return;
    }
    if(oneTapTriggered.current)
      return;
    oneTapTriggered.current = true;
    void authClient.oneTap({
      fetchOptions: {
        onSuccess: () => {
          router.replace(destination);
        },
      },
    }).catch(() => reportLoginFailure());
  }, [router, data, isFetching, destination]);
  const resetForm = useSetAtom(resetAllValidationsAtom);
  useEffect(() => {
    resetForm();
  }, [currentMode, resetForm]);
  const handleToggle = () => {
    setCurrentMode((prev) => (prev === "signin" ? "signup" : "signin"));
  };
  return { isLoading, authenticated: data?.authenticated, currentMode, handleToggle };
}
