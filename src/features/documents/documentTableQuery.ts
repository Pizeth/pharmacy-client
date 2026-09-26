// src/features/documents/documentTableQuery.ts

import {
  createDataTableBooleanServerFilter,
  createDataTableNumberRangeServerFilter,
  createDataTableSelectServerFilter,
  createDataTableServerQueryMapper,
  createDataTableTextServerFilter,
  createRefineDataTableAdapter,
  createRefineOrContainsSearchFilters,
  createStandardApiDataTableQueryAdapter,
} from "@/components/DataTable";

/**
 * ---------------------------------------------------------------
 * DataTable state -> semantic document query
 * ---------------------------------------------------------------
 *
 * This mapping knows about:
 *
 *   DataTable column IDs
 *
 * and:
 *
 *   public Document API field keys
 *
 * It does NOT know about Prisma.
 */
export const documentTableSemanticQuery = createDataTableServerQueryMapper({
  sorting: {
    documentNumber: "documentNumber",
    title: "title",
    status: "status",
    createdAt: "createdAt",
  },

  filtering: {
    documentNumber: createDataTableTextServerFilter("documentNumber"),
    title: createDataTableTextServerFilter("title"),
    status: createDataTableSelectServerFilter("status"),
    processingDays: createDataTableNumberRangeServerFilter("processingDays"),
    isEnabled: createDataTableBooleanServerFilter("isEnabled"),
  },

  /**
   * These remain useful to semantic adapters which need explicit
   * searchable fields.
   *
   * The Standard API transport adapter intentionally does NOT send
   * them to NestJS.
   */
  globalSearchFields: ["documentNumber", "title", "description"],
});

/**
 * ---------------------------------------------------------------
 * DataTable state -> actual Standard API request
 * ---------------------------------------------------------------
 */
export const documentTableApiQuery = createStandardApiDataTableQueryAdapter(
  documentTableSemanticQuery,
);

/**
 * ---------------------------------------------------------------
 * DataTable state -> Refine list request/response adapter
 * ---------------------------------------------------------------
 *
 * This is intentionally composed from the SAME semantic resource mapper used
 * by the Standard API adapter above.
 *
 * The document resource therefore proves that transport choice does not leak
 * back into:
 *
 * - TanStack column IDs
 * - filter semantics
 * - sorting semantics
 * - global-search field policy
 */
export const documentTableRefineAdapter = createRefineDataTableAdapter({
  semanticAdapter: documentTableSemanticQuery,
  resource: "documents",

  /**
   * Refine has no dedicated global-search field in GetListParams.
   *
   * Convert the resource-owned semantic search descriptor into an explicit OR
   * of contains filters. Searchable fields still originate from
   * documentTableSemanticQuery rather than browser input.
   */
  createSearchFilters: createRefineOrContainsSearchFilters,
});
