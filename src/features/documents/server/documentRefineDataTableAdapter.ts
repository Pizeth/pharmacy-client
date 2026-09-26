// src/features/documents/server/documentRefineDataTableAdapter.ts

import {
  createRefineDataTableAdapter,
  createRefineOrContainsSearchFilters,
} from "@/components/DataTable";
import type { DocumentRecord } from "../types";
import { documentTableSemanticQuery } from "../documentTableQuery";

/**
 * Refine resource identity for the future production Document endpoint.
 *
 * IMPORTANT:
 *
 * The current API repository does not yet expose a concrete "documents"
 * controller/model. Keeping the resource name centralized here gives the
 * client a single migration boundary when that endpoint lands.
 */
export const DOCUMENT_REFINE_RESOURCE = "documents";

/**
 * Complete Document <-> Refine adapter.
 *
 * This is the second real resource configuration using the generic Refine
 * adapter family.
 *
 * Pipeline:
 *
 *   TanStack/DataTable state
 *           ↓
 *   documentTableSemanticQuery
 *           ↓
 *   Refine GetListParams
 *           ↓
 *   dataProvider.getList()
 *           ↓
 *   GetListResponse<DocumentRecord>
 *           ↓
 *   normalized DataTableServerResult<DocumentRecord>
 *
 * Global search uses the explicit OR/contains mapping rather than relying on
 * an undocumented provider-specific "search" parameter.
 */
export const documentRefineDataTableAdapter =
  createRefineDataTableAdapter<DocumentRecord>({
    semanticAdapter: documentTableSemanticQuery,
    resource: DOCUMENT_REFINE_RESOURCE,
    createSearchFilters: createRefineOrContainsSearchFilters,
  });
