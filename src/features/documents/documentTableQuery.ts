// src/features/documents/documentTableQuery.ts

import {
  createDataTableBooleanServerFilter,
  createDataTableNumberRangeServerFilter,
  createDataTableSelectServerFilter,
  createDataTableServerQueryMapper,
  createDataTableTextServerFilter,
  createStandardApiDataTableQueryAdapter,
} from "@/components/DataTable";

import { DOCUMENT_COLUMN_IDS } from "./types";

/**
 * DataTable state -> semantic Document query.
 *
 * This mapping knows about stable DataTable column IDs and public Document
 * fields. It deliberately does not know about Refine, HTTP, or Prisma.
 */
export const documentTableSemanticQuery = createDataTableServerQueryMapper({
  sorting: {
    [DOCUMENT_COLUMN_IDS.documentNumber]: "documentNumber",
    [DOCUMENT_COLUMN_IDS.title]: "title",
    [DOCUMENT_COLUMN_IDS.status]: "status",
    [DOCUMENT_COLUMN_IDS.createdAt]: "createdAt",
  },

  filtering: {
    [DOCUMENT_COLUMN_IDS.documentNumber]:
      createDataTableTextServerFilter("documentNumber"),
    [DOCUMENT_COLUMN_IDS.title]:
      createDataTableTextServerFilter("title"),
    [DOCUMENT_COLUMN_IDS.status]:
      createDataTableSelectServerFilter("status"),
    [DOCUMENT_COLUMN_IDS.processingDays]:
      createDataTableNumberRangeServerFilter("processingDays"),
    [DOCUMENT_COLUMN_IDS.isEnabled]:
      createDataTableBooleanServerFilter("isEnabled"),
  },

  /**
   * Search targets are resource-owned capabilities.
   *
   * Transport adapters may encode this descriptor differently, but browser
   * state never gets to manufacture backend field names.
   */
  globalSearchFields: ["documentNumber", "title", "description"],
});

/**
 * Existing Standard API transport proof.
 */
export const documentTableApiQuery = createStandardApiDataTableQueryAdapter(
  documentTableSemanticQuery,
);
