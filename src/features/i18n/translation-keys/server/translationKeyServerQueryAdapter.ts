// src/features/i18n/translation-keys/server/translationKeyServerQueryAdapter.ts

import {
  createDataTableNumberServerFilter,
  createDataTableSelectServerFilter,
  createDataTableServerQueryMapper,
  createDataTableTextServerFilter,
} from "@/components/DataTable/mui/server-query";
import { createStandardApiDataTableQueryAdapter } from "@/components/DataTable/adapters";
import {
  TRANSLATION_KEY_COLUMN_IDS,
  TRANSLATION_KEY_FILTER_FIELDS,
  TRANSLATION_KEY_GLOBAL_SEARCH_FIELDS,
  TRANSLATION_KEY_SORT_FIELDS,
} from "./translationKeyServerFields";

/**
 * ------------------------------------------------------------------
 * TranslationKey semantic query adapter
 * ------------------------------------------------------------------
 *
 * Converts:
 *
 *   TanStack/DataTable query state
 *
 * into:
 *
 *   backend-independent semantic query
 *
 *
 * This is the RESOURCE boundary where UI column IDs are explicitly
 * connected to public API fields.
 *
 * No HTTP objects and no Prisma objects are constructed here.
 */
export const translationKeySemanticQueryAdapter =
  createDataTableServerQueryMapper({
    /**
     * --------------------------------------------------------------
     * Sorting
     * --------------------------------------------------------------
     *
     * Only fields explicitly listed here can participate in
     * server-side sorting.
     *
     * Notably absent:
     *
     *   description
     *   locale
     *
     * because the current backend TranslationKey policy does not
     * expose those as sortable fields.
     */
    sorting: {
      // [TRANSLATION_KEY_COLUMN_IDS.id]: TRANSLATION_KEY_SORT_FIELDS.id,
      [TRANSLATION_KEY_COLUMN_IDS.key]: TRANSLATION_KEY_SORT_FIELDS.key,
      [TRANSLATION_KEY_COLUMN_IDS.category]:
        TRANSLATION_KEY_SORT_FIELDS.category,
      [TRANSLATION_KEY_COLUMN_IDS.createdAt]:
        TRANSLATION_KEY_SORT_FIELDS.createdAt,
      [TRANSLATION_KEY_COLUMN_IDS.updatedAt]:
        TRANSLATION_KEY_SORT_FIELDS.updatedAt,
    },

    /**
     * --------------------------------------------------------------
     * Filtering
     * --------------------------------------------------------------
     */

    filtering: {
      /**
       * Numeric exact match:
       *
       * TanStack:
       *
       *   column id = "id"
       *   value = 6
       *
       * semantic:
       *
       *   {
       *     field: "id",
       *     operator: "equals",
       *     value: 6
       *   }
       */
      // [TRANSLATION_KEY_COLUMN_IDS.id]: createDataTableNumberServerFilter(
      //   TRANSLATION_KEY_FILTER_FIELDS.id,
      // ),

      /**
       * Text containment:
       *
       *   key contains "auth"
       */
      [TRANSLATION_KEY_COLUMN_IDS.key]: createDataTableTextServerFilter(
        TRANSLATION_KEY_FILTER_FIELDS.key,
      ),

      /**
       * Text containment:
       *
       *   description contains "login"
       */
      [TRANSLATION_KEY_COLUMN_IDS.description]: createDataTableTextServerFilter(
        TRANSLATION_KEY_FILTER_FIELDS.description,
      ),

      /**
       * ------------------------------------------------------------
       * Category is intentionally asymmetric.
       * ------------------------------------------------------------
       *
       * The visible column is:
       *
       *   category
       *
       * and displays:
       *
       *   translationCategory.name
       *
       *
       * Sorting uses:
       *
       *   category
       *
       * because the backend sorts the relation by category name.
       *
       *
       * Filtering uses:
       *
       *   categoryId
       *
       * because the category select control can store the stable
       * numeric category ID rather than the category's mutable name.
       *
       *
       * UI:
       *
       *   column = category
       *   filter value = 2
       *
       * semantic:
       *
       *   {
       *     field: "categoryId",
       *     operator: "equals",
       *     value: 2
       *   }
       */
      [TRANSLATION_KEY_COLUMN_IDS.category]: createDataTableNumberServerFilter(
        TRANSLATION_KEY_FILTER_FIELDS.categoryId,
      ),

      /**
       * Locale is a synthetic/relation-backed table column.
       *
       * The filter itself is a scalar select:
       *
       *   "en"
       *   "km"
       *
       * which becomes:
       *
       *   locale equals "km"
       *
       * and Nest later maps that to:
       *
       *   translations.some.locale
       */
      [TRANSLATION_KEY_COLUMN_IDS.locale]: createDataTableSelectServerFilter(
        TRANSLATION_KEY_FILTER_FIELDS.locale,
      ),
    },

    /**
     * Global-search fields are semantic only for the Standard API.
     *
     * createStandardApiDataTableQueryRequest() deliberately sends
     * only:
     *
     *   {
     *     search: {
     *       term
     *     }
     *   }
     *
     * and discards `fields`.
     *
     * The Nest resource policy remains the source of truth.
     */
    globalSearchFields: TRANSLATION_KEY_GLOBAL_SEARCH_FIELDS,

    /**
     * Resource configuration mistakes should fail loudly during
     * development.
     *
     * If a sortable/filterable column reaches server state without a
     * mapping, silently ignoring it would make the UI appear broken.
     */
    unknownSortingColumnPolicy: "throw",

    unknownFilterColumnPolicy: "throw",
  });

/**
 * ------------------------------------------------------------------
 * Standard API query adapter
 * ------------------------------------------------------------------
 *
 * Compose:
 *
 *   DataTableServerQueryState
 *
 *        ↓
 *
 *   translationKeySemanticQueryAdapter
 *
 *        ↓
 *
 *   DataTableServerSemanticQuery
 *
 *        ↓
 *
 *   StandardApiDataTableQueryRequest
 *
 *
 * This is the adapter that the TranslationKey server data source will
 * actually use.
 */
export const translationKeyStandardQueryAdapter =
  createStandardApiDataTableQueryAdapter(translationKeySemanticQueryAdapter);
