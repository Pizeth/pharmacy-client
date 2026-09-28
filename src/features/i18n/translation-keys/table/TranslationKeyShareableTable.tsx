"use client";

import {
  useDataTableServerQueryUrlState,
} from "@/components/DataTable";
import {
  translationKeyQueryUrlCodec,
} from "../server/translationKeyQueryUrlState";
import {
  TranslationKeyTable,
} from "./TranslationKeyTable";

/**
 * Route-level TranslationKey composition for shareable semantic query state.
 *
 * Next.js routing remains outside:
 *
 * - the generic MUI renderer,
 * - TranslationKey request adapters,
 * - the reusable TranslationKey table/controller.
 */
export function TranslationKeyShareableTable() {
  const query =
    useDataTableServerQueryUrlState({
      codec:
        translationKeyQueryUrlCodec,

      /**
       * Search/filter typing should not create dozens of browser-history
       * entries. The current table query remains shareable at every settled
       * URL.
       */
      historyMode:
        "replace",

      resetPageOnSortingChange:
        true,
      resetPageOnColumnFiltersChange:
        true,
      resetPageOnGlobalFilterChange:
        true,
    });

  return (
    <TranslationKeyTable
      queryController={
        query
      }
    />
  );
}
