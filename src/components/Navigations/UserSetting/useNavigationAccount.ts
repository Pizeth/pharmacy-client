"use client";

import { useGetIdentity, useIsAuthenticated } from "@refinedev/core";
import type { UserMenuProps } from "@/interfaces/component-props.interface";

export function useNavigationAccount() {
  const { data: auth, isLoading: authLoading } = useIsAuthenticated({
    queryOptions: {
      // Authenticated unmounts its children during auth checks. Rechecking on
      // each drawer mount would restart that cycle and every page request.
      // An uncached public-page mount still checks auth; invalidation still works.
      refetchOnMount: false,
    },
  });
  const authenticated = auth?.authenticated === true;
  const { data: identity } = useGetIdentity<NonNullable<UserMenuProps["data"]>>({
    queryOptions: { enabled: authenticated },
  });
  return {
    authenticated,
    authLoading,
    account: authenticated ? identity : undefined,
  };
}
