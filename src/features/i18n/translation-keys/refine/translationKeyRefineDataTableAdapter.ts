// src/features/i18n/translation-keys/refine/translationKeyRefineDataTableAdapter.ts

import {
  createRefineDataTableAdapter,
  createRefineOrContainsSearchFilters,
} from "@/components/DataTable/adapters/refine";
import type {
  RefineDataTableAdapter,
} from "@/components/DataTable/adapters/refine";
import type {
  StandardApiDataTableQueryRequest,
} from "@/components/DataTable/adapters/standard-api";
import type {
  DataTableServerQueryState,
} from "@/components/DataTable/mui/server-state";

import type {
  TranslationKey,
} from "../schemas";
import {
  translationKeySemanticQueryAdapter,
  translationKeyStandardQueryAdapter,
} from "../server";

/**
 * Existing Refine resource identity registered by the application.
 */
export const TRANSLATION_KEY_REFINE_RESOURCE =
  "translations" as const;

/**
 * Named Refine provider which executes the existing TranslationKey Standard
 * API contract.
 *
 * Keeping it named means the application's default NestJS CRUD provider remains
 * untouched for unrelated resources.
 */
export const TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME =
  "translationKeyStandardApi" as const;

/**
 * Opaque provider metadata key carrying the already-authoritative Standard API
 * query request.
 *
 * Refine's sort/filter descriptors remain useful for cache/query identity and
 * developer inspection, while the provider executes this exact request so the
 * browser still sends only search.term and never sends global-search fields.
 */
export const TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY =
  "translationKeyStandardApiRequest" as const;

export interface TranslationKeyRefineMeta {
  readonly [TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY]:
    StandardApiDataTableQueryRequest;
}

const baseRefineAdapter =
  createRefineDataTableAdapter<TranslationKey>({
    semanticAdapter:
      translationKeySemanticQueryAdapter,

    resource:
      TRANSLATION_KEY_REFINE_RESOURCE,

    dataProviderName:
      TRANSLATION_KEY_REFINE_DATA_PROVIDER_NAME,

    /**
     * Refine still receives a public semantic representation for query-key
     * identity/debugging. The named provider does NOT serialize these search
     * fields to the Standard API wire contract; it executes the meta request
     * below instead.
     */
    createSearchFilters:
      createRefineOrContainsSearchFilters,
  });

/**
 * TranslationKey's production Refine adapter.
 *
 * Pipeline:
 *
 * DataTableServerQueryState
 *        ↓
 * resource semantic mapper
 *        ↓
 * Refine GetListParams (query/cache identity)
 *        +
 * canonical Standard API request in provider meta
 *        ↓
 * named TranslationKey Refine DataProvider
 *        ↓
 * POST /api/v1/i18n/keys/query
 *
 * This lets production use Refine's list/query lifecycle without replacing or
 * weakening the backend's established Standard API query contract.
 */
export const translationKeyRefineDataTableAdapter:
  RefineDataTableAdapter<TranslationKey> =
  {
    createRequest: (
      query:
        DataTableServerQueryState,
    ) => {
      const refineRequest =
        baseRefineAdapter.createRequest(
          query,
        );

      const standardApiRequest =
        translationKeyStandardQueryAdapter.createRequest(
          query,
        );

      return {
        ...refineRequest,

        meta: {
          ...(refineRequest.meta ??
            {}),

          [TRANSLATION_KEY_REFINE_STANDARD_API_REQUEST_META_KEY]:
            standardApiRequest,
        } satisfies TranslationKeyRefineMeta,
      };
    },

    readResponse:
      baseRefineAdapter.readResponse,
  };
