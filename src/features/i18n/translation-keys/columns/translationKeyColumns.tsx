"use client";

// src/features/i18n/translation-keys/columns/translationKeyColumns.tsx

import { Tooltip, Typography } from "@mui/material";
// import {
//   createMuiDataTableColumnHelper,
//   DataTableRowNumberCell,
// } from "@/components/DataTable";
import { DataTableRowNumberCell } from "@/components/DataTable/mui/components";
import { createMuiDataTableColumnHelper } from "@/components/DataTable/mui/table";
import type { TranslationKey } from "../schemas";
import type { MuiDataTableFilterOption } from "@/components/DataTable/mui/meta";
import { TRANSLATION_KEY_COLUMN_IDS } from "../server";
import {
  TranslationKeyCategoryCell,
  TranslationKeyDateTimeCell,
  TranslationKeyEmptyCell,
  TranslationKeyLocalesCell,
  TranslationKeyValuesCell,
} from "./translationKeyCells";
import { TRANSLATION_KEY_LOCALE_FILTER_OPTIONS } from "./translationKeyFilterOptions";

/**
 * ------------------------------------------------------------------
 * Dynamic TranslationKey column configuration
 * ------------------------------------------------------------------
 *
 * Category options come from the resource API and therefore cannot be
 * embedded permanently into a static column definition.
 *
 * The column factory receives resource-owned option collections while
 * keeping the generic DataTable completely unaware of TranslationKey.
 */
export interface CreateTranslationKeyColumnsOptions {
  /**
   * Category options returned by:
   *
   *   GET /api/v1/i18n/categories
   *
   * Expected shape:
   *
   *   [
   *     {
   *       label: "auth",
   *       value: 2
   *     }
   *   ]
   */
  readonly categoryFilterOptions: readonly MuiDataTableFilterOption[];

  /**
   * Locale options remain overridable so the application's future
   * supported-locale registry can become the source without requiring
   * another column refactor.
   */
  readonly localeFilterOptions?: readonly MuiDataTableFilterOption[];
}

/**
 * ------------------------------------------------------------------
 * MUI-family column helper
 * ------------------------------------------------------------------
 *
 * This is NOT TanStack's generic createColumnHelper().
 *
 * It comes from our configured:
 *
 *   createTableHook({
 *     features: muiDataTableFeatures,
 *     ...
 *   })
 *
 * and therefore permanently carries the MUI DataTable feature family.
 *
 * The configured DataTable MUI family gives us a column helper whose
 * feature set and registered App components are already bound.
 *
 * This is the v9 path:
 *
 *   createTableHook()
 *       ↓
 *   createMuiDataTableColumnHelper<TData>()
 *
 * rather than creating raw v8 MRT-style column definitions.
 */
const columnHelper = createMuiDataTableColumnHelper<TranslationKey>();

/**
 * Create the TranslationKey column family.
 *
 * This is deliberately a pure function.
 *
 * It:
 *
 * - performs no fetching
 * - owns no React state
 * - owns no query lifecycle
 * - knows nothing about HTTP
 *
 * Resource data required by column presentation is supplied by the
 * caller.
 */
export function createTranslationKeyColumns(
  options: CreateTranslationKeyColumnsOptions,
) {
  const {
    categoryFilterOptions,
    localeFilterOptions = TRANSLATION_KEY_LOCALE_FILTER_OPTIONS,
  } = options;

  /**
   * ------------------------------------------------------------------
   * TranslationKey column family
   * ------------------------------------------------------------------
   *
   * Server capabilities:
   *
   *                 sort    filter
   * --------------------------------
   * id               yes      yes
   * key              yes      yes
   * description       no      yes
   * category          yes      yes
   * locale            no      yes
   * translations      no       no
   * createdAt         yes       no
   * updatedAt         yes       no
   *
   * IMPORTANT:
   *
   * These capabilities deliberately mirror:
   *
   *   translationKeyServerQueryAdapter
   *
   * because unknown server mappings currently use:
   *
   *   "throw"
   */
  return columnHelper.columns([
    /**
     * ==============================================================
     * Sequential row number
     * ==============================================================
     *
     * Presentation-only.
     *
     * Never exposed to:
     *
     * - sorting
     * - filtering
     * - API
     * - Prisma
     */
    columnHelper.display({
      id: TRANSLATION_KEY_COLUMN_IDS.rowNumber,
      header: "No.",
      /**
       * This is presentation only.
       *
       * It is NOT a database/API field, so the server must never receive:
       *
       * sorting:
       *   rowNumber
       *
       * or:
       *
       * filtering:
       *   rowNumber
       */
      enableSorting: false,
      enableColumnFilter: false,

      /**
       * Structural presentation column.
       *
       * Normally users should not hide the sequential number.
       */
      enableHiding: false,

      /**
       * Keep it compact and stable.
       */
      enableResizing: false,

      /**
       * Its size is intentionally compact and stable.
       */
      size: 64,
      minSize: 56,
      maxSize: 72,
      meta: {
        align: "center",
        headerAlign: "center",

        /**
         * Presentation-only columns do not need column actions.
         */
        enableColumnMenu: false,
      },

      /**
       * Sequential position across SERVER pages.
       *
       * Current page:
       *
       *   row.index = 0..24
       *
       * pageIndex 0:
       *
       *   0 * 25 + row.index + 1
       *     ↓
       *   1..25
       *
       * pageIndex 1:
       *
       *   1 * 25 + row.index + 1
       *     ↓
       *   26..50
       */
      cell: ({ row }) => <DataTableRowNumberCell rowIndex={row.index} />,
    }),

    /**
     * ==============================================================
     * Translation key
     * ==============================================================
     *
     * Server:
     *
     * sorting:
     *   key
     *
     * filtering:
     *   key contains string
     */
    columnHelper.accessor("key", {
      id: TRANSLATION_KEY_COLUMN_IDS.key,
      header: "Key",
      enableSorting: true,
      enableColumnFilter: true,
      size: 240,
      minSize: 160,
      maxSize: 420,
      meta: {
        filterVariant: "text",
        filterLabel: "Key contains",
      },
      cell: ({ getValue }) => (
        <Tooltip title={getValue()}>
          <Typography
            component="span"
            variant="body2"
            noWrap
            sx={{
              /**
               * Existing styling retained for now.
               *
               * This moves into a resource/MUI slot during the later
               * styling audit.
               */
              fontFamily: "monospace",
              fontWeight: 600,
            }}
          >
            {getValue()}
          </Typography>
        </Tooltip>
      ),
    }),

    /**
     * ==============================================================
     * Description
     * ==============================================================
     *
     * Backend policy allows filtering but currently does NOT expose
     * description as a sorting field.
     *
     * Server:
     *
     * sorting:
     *   unsupported
     *
     * filtering:
     *   description contains string
     */
    columnHelper.accessor("description", {
      id: TRANSLATION_KEY_COLUMN_IDS.description,
      header: "Description",

      /**
       * Backend policy currently does not expose Description as a
       * sortable field.
       */
      enableSorting: false,
      enableColumnFilter: true,
      size: 280,
      minSize: 180,
      meta: {
        filterVariant: "text",
        filterLabel: "Description contains",
      },
      cell: ({ getValue }) => {
        const description = getValue();

        return description ? (
          <Typography component="span" variant="body2" noWrap>
            {description}
          </Typography>
        ) : (
          <TranslationKeyEmptyCell />
        );
      },
    }),

    /**
     * ==============================================================
     * Category
     * ==============================================================
     *
     * This column is intentionally asymmetric.
     *
     * DISPLAY
     *
     *   row.translationCategory.name
     *
     * SORT
     *
     *   column "category"
     *       ↓
     *   API field "category"
     *       ↓
     *   Nest categoryName
     *       ↓
     *   Prisma translationCategory.name
     *
     * FILTER
     *
     *   category select
     *       ↓
     *   numeric category ID
     *       ↓
     *   API field "categoryId"
     *       ↓
     *   Prisma categoryId
     *
     * Example:
     *
     *   visible:
     *     auth
     *
     *   stored filter value:
     *     2
     */
    columnHelper.accessor((row) => row.translationCategory.name, {
      id: TRANSLATION_KEY_COLUMN_IDS.category,
      header: "Category",
      enableSorting: true,
      enableColumnFilter: true,
      size: 180,
      minSize: 140,
      maxSize: 280,
      meta: {
        align: "center",

        /**
         * IMPORTANT:
         *
         * This replaces the previous incorrect:
         *
         *   filterVariant: "text"
         *
         * because the server mapper expects categoryId:number.
         */
        filterVariant: "select",

        filterLabel: "Category",
        filterOptions: categoryFilterOptions,
      },
      cell: ({ getValue }) => <TranslationKeyCategoryCell name={getValue()} />,
    }),

    /**
     * ==============================================================
     * Locale availability
     * ==============================================================
     *
     * One TranslationKey may contain multiple translations.
     *
     * The accessor is useful for display, but sorting is disabled
     * because there is no meaningful singular locale ordering.
     *
     * Filtering remains enabled:
     *
     *   column id "locale"
     *       ↓
     *   semantic "locale"
     *       ↓
     *   Nest translations.some.locale
     *
     * Presentation value:
     *
     *   en, km, ...
     *
     * but filtering uses an individual selected locale:
     *
     *   "km"
     *
     * which becomes:
     *
     *   locale equals "km"
     *
     * on the server.
     *
     * Display:
     *
     *   EN KM ...
     *
     * Filter value:
     *
     *   "en"
     *
     * Server:
     *
     *   locale equals "en"
     *
     * Nest:
     *
     *   translations.some.locale
     */
    columnHelper.accessor(
      (row) =>
        row.translations.map((translation) => translation.locale).join(", "),
      {
        id: TRANSLATION_KEY_COLUMN_IDS.locale,
        header: "Locales",

        /**
         * Locale is not currently a server-sortable field.
         */
        enableSorting: false,
        enableColumnFilter: true,
        size: 180,
        minSize: 140,
        maxSize: 320,
        meta: {
          align: "center",
          filterVariant: "select",
          filterLabel: "Locale",
          filterOptions: localeFilterOptions,
        },
        cell: ({ row, column }) => (
          <TranslationKeyLocalesCell
            translations={row.original.translations}
            align={column.columnDef.meta?.align}
          />
        ),
      },
    ),

    /**
     * ==============================================================
     * Translation values
     * ==============================================================
     *
     * This is a presentation-only column.
     *
     * Global search still searches translation values through the
     * server-owned global-search policy.
     *
     * That does NOT mean this individual column needs a column filter.
     *
     * It must NEVER enter sorting/filter state because the resource
     * semantic adapter intentionally has no mapping for this column.
     */
    columnHelper.accessor(
      (row) =>
        row.translations.map((translation) => translation.value).join(" | "),
      {
        id: TRANSLATION_KEY_COLUMN_IDS.translations,
        header: "Translations",
        enableSorting: false,
        enableColumnFilter: false,
        size: 420,
        minSize: 240,
        maxSize: 550,
        cell: ({ row }) => (
          <TranslationKeyValuesCell translations={row.original.translations} />
        ),
      },
    ),

    /**
     * ==============================================================
     * Created
     * ==============================================================
     *
     * Server sorting supported.
     *
     * Date filtering remains disabled until the date/date-range
     * protocol is implemented explicitly.
     */
    columnHelper.accessor("createdAt", {
      id: TRANSLATION_KEY_COLUMN_IDS.createdAt,
      header: "Created",
      enableSorting: true,
      enableColumnFilter: false,
      size: 190,
      minSize: 170,
      cell: ({ getValue }) => <TranslationKeyDateTimeCell value={getValue()} />,
    }),

    /**
     * ==============================================================
     * Updated
     * ==============================================================
     */
    columnHelper.accessor("updatedAt", {
      id: TRANSLATION_KEY_COLUMN_IDS.updatedAt,
      header: "Updated",
      enableSorting: true,
      enableColumnFilter: false,
      size: 190,
      minSize: 170,
      maxSize: 260,
      cell: ({ getValue }) => <TranslationKeyDateTimeCell value={getValue()} />,
    }),
  ]);
}
