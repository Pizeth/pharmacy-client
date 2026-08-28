// src/features/documents/documentTableQuery.ts

import {
  createDataTableBooleanServerFilter,
  createDataTableNumberRangeServerFilter,
  createDataTableSelectServerFilter,
  createDataTableServerQueryMapper,
  createDataTableTextServerFilter,
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
