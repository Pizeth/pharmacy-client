// src/features/i18n/translation-keys/server/translationKeyServerFields.ts

/**
 * ------------------------------------------------------------------
 * TranslationKey TanStack column IDs
 * ------------------------------------------------------------------
 *
 * These identify UI columns.
 *
 * They are NOT automatically backend fields.
 *
 * Keeping them centralized prevents the column definitions and
 * resource server-query mapper from drifting apart later.
 */
export const TRANSLATION_KEY_COLUMN_IDS = {
  /**
   * Real scalar fields.
   */
  rowNumber: "rowNumber",
  key: "key",
  description: "description",

  /**
   * Relation-backed presentation fields.
   */
  category: "category",
  locale: "locale",

  /**
   * Presentation-only column.
   *
   * This column will not participate in sorting or filtering.
   */
  translations: "translations",

  /**
   * Audit fields.
   */
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export type TranslationKeyColumnId =
  (typeof TRANSLATION_KEY_COLUMN_IDS)[keyof typeof TRANSLATION_KEY_COLUMN_IDS];

/**
 * ------------------------------------------------------------------
 * Public server sorting fields
 * ------------------------------------------------------------------
 *
 * These names correspond to the public fields identifiers accepted
 * by the backend NestJS TranslationKey DataTable policy.
 *
 * IMPORTANT:
 *
 * These are API concepts.
 * They still are NOT Prisma field paths.
 *
 * Backend:
 *
 *   public "category"
 *
 * is later resolved by the resource policy into:
 *
 *   categoryName
 *
 * and only then mapped to:
 *
 *   translationCategory.name
 */
export const TRANSLATION_KEY_SORT_FIELDS = {
  id: "id",
  key: "key",
  category: "category",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const;

export type TranslationKeySortField =
  (typeof TRANSLATION_KEY_SORT_FIELDS)[keyof typeof TRANSLATION_KEY_SORT_FIELDS];

/**
 * ------------------------------------------------------------------
 * Public server filtering fields
 * ------------------------------------------------------------------
 */
export const TRANSLATION_KEY_FILTER_FIELDS = {
  id: "id",
  key: "key",
  description: "description",
  categoryId: "categoryId",
  category: "category",
  locale: "locale",
} as const;

export type TranslationKeyFilterField =
  (typeof TRANSLATION_KEY_FILTER_FIELDS)[keyof typeof TRANSLATION_KEY_FILTER_FIELDS];

/**
 * ------------------------------------------------------------------
 * Semantic global-search fields
 * ------------------------------------------------------------------
 *
 * These express the resource's global-search capability to the
 * backend-independent semantic query layer.
 *
 * These fields never become browser-controlled search targets in the
 * Standard API request.
 *
 * createStandardApiDataTableQueryRequest() intentionally strips the
 * field list and sends only:
 *
 *   search: {
 *     term
 *   }
 *
 * Therefore the browser does NOT choose the real searchable fields.
 *
 * NestJS remains authoritative and currently searches:
 *
 *   key
 *   description
 *   categoryName
 *   translationValue
 */
export const TRANSLATION_KEY_GLOBAL_SEARCH_FIELDS = [
  "key",
  "description",
  "category",
  "translationValue",
] as const;

export type TranslationKeyGlobalSearchField =
  (typeof TRANSLATION_KEY_GLOBAL_SEARCH_FIELDS)[number];
