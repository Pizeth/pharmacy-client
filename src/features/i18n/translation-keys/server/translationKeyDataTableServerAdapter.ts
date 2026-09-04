// src/features/i18n/translation-keys/server/translationKeyDataTableServerAdapter.ts

import type { DataTableServerQueryState } from "@/components/DataTable/mui/server-state";
import { createDataTableServerAdapter } from "@/components/DataTable/mui/server-data";
import type { DataTableServerResult } from "@/components/DataTable/mui/server-data";
import { createStandardPaginatedResponseAdapter } from "@/components/DataTable/adapters";
import type { StandardApiDataTableQueryRequest } from "@/components/DataTable/adapters";
import { queryTranslationKeys } from "../api";
import type { TranslationKey } from "../schemas";
import type { TranslationKeyQueryResponse } from "../types";
import { translationKeyStandardQueryAdapter } from "./translationKeyServerQueryAdapter";

/**
 * ------------------------------------------------------------------
 * Response adapter
 * ------------------------------------------------------------------
 *
 * Reuse the existing generic Standard API pagination adapter.
 *
 * It converts:
 *
 *   StandardApiPaginatedResponse<TranslationKey>
 *
 * into:
 *
 *   DataTableServerResult<TranslationKey>
 *
 * including:
 *
 *   currentPage 1
 *
 *       ↓
 *
 *   pageIndex 0
 */
export const translationKeyStandardResponseAdapter =
  createStandardPaginatedResponseAdapter<TranslationKey>();

/**
 * ------------------------------------------------------------------
 * Complete TranslationKey server adapter
 * ------------------------------------------------------------------
 *
 * Request direction:
 *
 *   DataTableServerQueryState
 *       ↓
 *   StandardApiDataTableQueryRequest
 *
 *
 * Response direction:
 *
 *   TranslationKeyQueryResponse
 *       ↓
 *   DataTableServerResult<TranslationKey>
 */
export const translationKeyDataTableServerAdapter =
  createDataTableServerAdapter<
    StandardApiDataTableQueryRequest,
    TranslationKeyQueryResponse,
    TranslationKey
  >({
    createRequest: translationKeyStandardQueryAdapter.createRequest,
    readResponse: translationKeyStandardResponseAdapter.readResponse,
  });

/**
 * ------------------------------------------------------------------
 * TranslationKey DataTable loader
 * ------------------------------------------------------------------
 *
 * This is the only resource-specific operation required by a query
 * library / request lifecycle.
 *
 * It deliberately performs three distinct steps:
 *
 *   1. query state -> HTTP request
 *   2. execute HTTP request
 *   3. HTTP response -> normalized DataTable result
 *
 *
 * The loader does NOT know anything about:
 *
 *   React
 *   useEffect
 *   Refine
 *   TanStack Query
 *   loading state
 *   previous-result preservation
 *   refresh indicators
 *
 * Those concerns remain outside the transport/resource layer.
 */
export async function loadTranslationKeyDataTableResult(
  query: DataTableServerQueryState,
  signal?: AbortSignal,
): Promise<DataTableServerResult<TranslationKey>> {
  /**
   * --------------------------------------------------------------
   * DataTable query state -> Standard API request
   * --------------------------------------------------------------
   */
  const request = translationKeyDataTableServerAdapter.createRequest(query);

  /**
   * --------------------------------------------------------------
   * Standard API request -> actual HTTP response
   * --------------------------------------------------------------
   */
  const response = await queryTranslationKeys(request, signal);

  /**
   * --------------------------------------------------------------
   * Standard API response -> normalized DataTable server result
   * --------------------------------------------------------------
   */
  return translationKeyDataTableServerAdapter.readResponse(response);
}
