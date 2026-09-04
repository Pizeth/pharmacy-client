"use client";

import { Tooltip, Typography } from "@mui/material";

import { createMuiDataTableColumnHelper } from "@/components/DataTable";

import type { TranslationKey } from "../schemas";

import { TRANSLATION_KEY_COLUMN_IDS } from "../server";

import {
  TranslationKeyCategoryCell,
  TranslationKeyDateTimeCell,
  TranslationKeyEmptyCell,
  TranslationKeyLocalesCell,
  TranslationKeyValuesCell,
} from "./translationKeyCells";

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
export const translationKeyColumns = columnHelper.columns([
  /**
   * ==============================================================
   * ID
   * ==============================================================
   *
   * Server:
   *
   *   sorting  -> id
   *   filtering -> id equals number
   */
  columnHelper.accessor("id", {
    id: TRANSLATION_KEY_COLUMN_IDS.id,
    header: "ID",
    enableSorting: true,
    enableColumnFilter: true,
    size: 90,
    minSize: 70,
    maxSize: 140,
    cell: ({ getValue }) => (
      <Typography
        component="span"
        variant="body2"
        sx={{
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {getValue()}
      </Typography>
    ),
  }),

  /**
   * ==============================================================
   * Translation key
   * ==============================================================
   */
  columnHelper.accessor("key", {
    id: TRANSLATION_KEY_COLUMN_IDS.key,
    header: "Key",
    enableSorting: true,
    enableColumnFilter: true,
    size: 240,
    minSize: 160,
    maxSize: 420,
    cell: ({ getValue }) => (
      <Tooltip title={getValue()}>
        <Typography
          component="span"
          variant="body2"
          noWrap
          sx={{
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
   */
  columnHelper.accessor("description", {
    id: TRANSLATION_KEY_COLUMN_IDS.description,
    header: "Description",
    enableSorting: false,
    enableColumnFilter: true,
    size: 280,
    minSize: 180,
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
   * The row does not have a flat:
   *
   *   category
   *
   * property.
   *
   * Therefore this uses an accessor function and explicitly owns the
   * stable TanStack column ID:
   *
   *   "category"
   *
   *
   * Server semantics:
   *
   * sorting:
   *   category
   *
   * filtering:
   *   categoryId
   *
   * The semantic adapter handles that asymmetry.
   *
   * This is intentionally relation-backed.
   *
   * Display:
   *
   *   row.translationCategory.name
   *
   * Sort:
   *
   *   column id "category"
   *      ↓
   *   API field "category"
   *
   * Filter:
   *
   *   column id "category"
   *      ↓
   *   selected numeric category ID
   *      ↓
   *   API field "categoryId"
   */
  columnHelper.accessor((row) => row.translationCategory.name, {
    id: TRANSLATION_KEY_COLUMN_IDS.category,
    header: "Category",
    enableSorting: true,
    enableColumnFilter: true,
    size: 180,
    minSize: 140,
    maxSize: 280,
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
   */
  columnHelper.accessor(
    (row) =>
      row.translations.map((translation) => translation.locale).join(", "),
    {
      id: TRANSLATION_KEY_COLUMN_IDS.locale,
      header: "Locales",
      enableSorting: false,
      enableColumnFilter: true,
      size: 180,
      minSize: 140,
      maxSize: 320,
      cell: ({ row }) => (
        <TranslationKeyLocalesCell translations={row.original.translations} />
      ),
    },
  ),

  /**
   * ==============================================================
   * Translation preview
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
      maxSize: 640,
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
   * Sorting supported.
   *
   * Filtering intentionally disabled until the server date-filter
   * protocol is explicitly implemented.
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
