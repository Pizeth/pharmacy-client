// src/features/i18n/translation-keys/server/translationKeyQueryUrlState.ts

import {
  createDataTableQueryUrlCodec,
} from "@/components/DataTable/mui/query-url";

import type {
  DataTableQueryUrlFilterValue,
} from "@/components/DataTable/mui/query-url";

import {
  createDataTableServerQueryState,
} from "@/components/DataTable/mui/server-state";

import type {
  DataTableServerQueryState,
} from "@/components/DataTable/mui/server-state";

import {
  TRANSLATION_KEY_COLUMN_IDS,
  TRANSLATION_KEY_FILTER_COLUMN_FIELDS,
  TRANSLATION_KEY_SORT_COLUMN_FIELDS,
} from "./translationKeyServerFields";

/**
 * Canonical TranslationKey server-query defaults.
 *
 * This object is shared by the normal resource controller and the URL codec so
 * opening a clean route and resetting the table mean the same thing.
 */
export const TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE:
  DataTableServerQueryState =
  createDataTableServerQueryState(
    {
      pagination: {
        pageIndex:
          0,
        pageSize:
          25,
      },
      sorting:
        [],
      columnFilters:
        [],
      globalFilter:
        "",
    },
    25,
  );

function encodeString(
  value: unknown,
): string | undefined {
  return typeof value ===
    "string"
    ? value
    : undefined;
}

function decodeString(
  value:
    DataTableQueryUrlFilterValue,
): string | undefined {
  return typeof value ===
    "string"
    ? value
    : undefined;
}

function encodePositiveInteger(
  value: unknown,
): number | undefined {
  return (
    typeof value ===
      "number" &&
    Number.isInteger(
      value,
    ) &&
    value > 0
  )
    ? value
    : undefined;
}

function decodePositiveInteger(
  value:
    DataTableQueryUrlFilterValue,
): number | undefined {
  return encodePositiveInteger(
    value,
  );
}

/**
 * Shareable TranslationKey semantic query URL contract.
 *
 * The URL stores public semantic field IDs:
 *
 * - key
 * - description
 * - categoryId
 * - locale
 * - createdAt
 * - updatedAt
 *
 * It never stores Prisma paths or other backend-private field names.
 */
export const translationKeyQueryUrlCodec =
  createDataTableQueryUrlCodec({
    namespace:
      "dt",

    defaultState:
      TRANSLATION_KEY_DEFAULT_SERVER_QUERY_STATE,

    limits: {
      pageSizes:
        [
          10,
          25,
          50,
          100,
          200,
        ],
      maxPage:
        100_000,
      maxSearchLength:
        256,
      maxFilterStringLength:
        256,
      maxFilterArrayLength:
        50,
      maxStructuredParamLength:
        8_192,
    },

    fields: {
      sorting:
        TRANSLATION_KEY_SORT_COLUMN_FIELDS,

      filtering: {
        [TRANSLATION_KEY_COLUMN_IDS.key]:
          {
            field:
              TRANSLATION_KEY_FILTER_COLUMN_FIELDS[
                TRANSLATION_KEY_COLUMN_IDS.key
              ],
            encode:
              encodeString,
            decode:
              decodeString,
          },

        [TRANSLATION_KEY_COLUMN_IDS.description]:
          {
            field:
              TRANSLATION_KEY_FILTER_COLUMN_FIELDS[
                TRANSLATION_KEY_COLUMN_IDS.description
              ],
            encode:
              encodeString,
            decode:
              decodeString,
          },

        [TRANSLATION_KEY_COLUMN_IDS.category]:
          {
            field:
              TRANSLATION_KEY_FILTER_COLUMN_FIELDS[
                TRANSLATION_KEY_COLUMN_IDS.category
              ],
            encode:
              encodePositiveInteger,
            decode:
              decodePositiveInteger,
          },

        [TRANSLATION_KEY_COLUMN_IDS.locale]:
          {
            field:
              TRANSLATION_KEY_FILTER_COLUMN_FIELDS[
                TRANSLATION_KEY_COLUMN_IDS.locale
              ],
            encode:
              encodeString,
            decode:
              decodeString,
          },
      },
    },
  });
