"use client";

import { useEffect } from "react";
import { useQueryClient, type QueryFilters } from "@tanstack/react-query";
import { createProductionLiveProvider } from "@/lib/realtime/productionLiveProvider";

const provider = createProductionLiveProvider({
  enabled: process.env.NEXT_PUBLIC_DOCUMENT_REALTIME_ENABLED === "true",
  resource: "tracked-documents",
});

export function useDocumentTrackingRealtime(active: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!active) return undefined;
    const subscription = provider.subscribe({
      channel: "resources/tracked-documents",
      types: ["invalidate"],
      params: { subscriptionType: "useList" },
      callback: () => {
        // Keep open forms and optimistic versions stable. Lists and reads refetch
        // through the same authorization checks used by manual refresh.
        const filters: QueryFilters = {
          queryKey: ["document-tracking"],
          predicate: ({ queryKey }) => queryKey[1] === "list" || queryKey[1] === "detail",
        };
        return queryClient.cancelQueries(filters).then(() =>
          queryClient.invalidateQueries(filters),
        ).catch(() => {
          // The query observers own errors and retry behavior.
        });
      },
    });
    return () => { provider.unsubscribe(subscription); };
  }, [active, queryClient]);
}
