// src/features/documents/documentTableRefineAdapter.ts

import {
  createRefineDataTableAdapter,
  createRefineOrContainsSearchFilters,
} from "@/components/DataTable";

import { documentTableSemanticQuery } from "./documentTableQuery";
import type { DocumentRecord } from "./types";

/**
 * Stable Refine resource identity for the modern Document list contract.
 *
 * The production backend does not yet expose this endpoint. Keeping the
 * identity resource-local lets the fixture acceptance proof and the future
 * production provider share the same table/controller code.
 */
export const DOCUMENT_REFINE_RESOURCE = "documents";

/**
 * Refine transport adapter for the Document/FTS resource.
 *
 * Refine remains an execution/transport concern. No Refine type or hook enters
 * the generic MUI renderer.
 */
export const documentRefineDataTableAdapter =
  createRefineDataTableAdapter<DocumentRecord>({
    semanticAdapter: documentTableSemanticQuery,
    resource: DOCUMENT_REFINE_RESOURCE,

    /**
     * Refine has no universal global-search parameter.
     *
     * Encode the semantic search descriptor as an explicit OR group of
     * contains filters. Searchable fields still originate in the resource
     * semantic mapper.
     */
    createSearchFilters: createRefineOrContainsSearchFilters,
  });
