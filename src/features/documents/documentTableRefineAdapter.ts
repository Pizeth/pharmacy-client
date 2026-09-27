// src/features/documents/documentTableRefineAdapter.ts

import {
  createRefineDataTableAdapter,
  createRefineOrContainsSearchFilters,
} from "@/components/DataTable";

import { documentTableSemanticQuery } from "./documentTableQuery";
import type { DocumentRecord } from "./types";

/**
 * Refine transport adapter for the Document/FTS resource.
 *
 * This is the second real resource to consume the generic adapter family and
 * therefore proves that Refine integration is not TranslationKey-specific.
 *
 * The adapter owns only Refine transport concerns:
 *
 * - resource name,
 * - semantic-search -> Refine filter encoding,
 * - Refine list response -> DataTable result normalization.
 *
 * It does NOT own:
 *
 * - column definitions,
 * - React state,
 * - table rendering,
 * - MUI presentation,
 * - database/Prisma expressions.
 */
export const documentRefineDataTableAdapter =
  createRefineDataTableAdapter<DocumentRecord>({
    semanticAdapter: documentTableSemanticQuery,
    resource: "documents",

    /**
     * Refine has no universal global-search field. For the Document resource
     * we intentionally encode the semantic search targets as one OR group.
     *
     * The searchable field list originates in documentTableSemanticQuery, so
     * browser input cannot manufacture arbitrary backend field names.
     */
    createSearchFilters: createRefineOrContainsSearchFilters,
  });
