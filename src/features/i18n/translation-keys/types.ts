// src/features/i18n/translation-keys/types.ts

import type {
  StandardApiPaginatedResponse,
  StandardApiResponse,
} from "@/components/DataTable/adapters";

import type {
  DeletedTranslation,
  DeletedTranslationKey,
  TranslationCategory,
  TranslationKey,
  TranslationValue,
} from "./schemas";

/**
 * ------------------------------------------------------------------
 * DataTable query response
 * ------------------------------------------------------------------
 *
 * DO NOT recreate:
 *
 *   requestStatus
 *   statusCode
 *   statusText
 *   pagination metadata
 *
 * Those belong to the generic Standard API adapter.
 */
export type TranslationKeyQueryResponse =
  StandardApiPaginatedResponse<TranslationKey>;

/**
 * ------------------------------------------------------------------
 * TranslationKey CRUD responses
 * ------------------------------------------------------------------
 */

export type TranslationKeyResponse = StandardApiResponse<TranslationKey>;

export type DeleteTranslationKeyResponse =
  StandardApiResponse<DeletedTranslationKey>;

/**
 * ------------------------------------------------------------------
 * Categories
 * ------------------------------------------------------------------
 */

export type TranslationCategoriesResponse = StandardApiResponse<
  TranslationCategory[]
>;

/**
 * ------------------------------------------------------------------
 * Translation CRUD
 * ------------------------------------------------------------------
 */

export type TranslationValueResponse = StandardApiResponse<TranslationValue>;

export type DeleteTranslationResponse = StandardApiResponse<DeletedTranslation>;
