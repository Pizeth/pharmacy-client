import {
  createRefineDataTableAdapter,
  createRefineOrContainsSearchFilters,
} from "@/components/DataTable";
import { documentTableSemanticQuery } from "../documentTableQuery";
import type { DocumentRecord } from "../types";

export const DOCUMENT_REFINE_RESOURCE = "documents";
export const DOCUMENT_REFINE_DATA_PROVIDER = "documentProof";

/**
 * Second-resource proof for the generic Refine bridge.
 *
 * The renderer remains completely unaware of Refine. Only the resource
 * composes its semantic query mapper with the transport adapter.
 */
export const documentRefineAdapter =
  createRefineDataTableAdapter<DocumentRecord>({
    semanticAdapter: documentTableSemanticQuery,
    resource: DOCUMENT_REFINE_RESOURCE,
    dataProviderName: DOCUMENT_REFINE_DATA_PROVIDER,
    createSearchFilters: createRefineOrContainsSearchFilters,
  });
