// src/components/DataTable/mui/features/muiDataTableFeatures.ts

import {
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludes,
  filterFn_equals,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_weakEquals,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";

import type { MuiDataTableColumnMeta, MuiDataTableMeta } from "../meta";

/**
 * Static TanStack v9 feature family used by the high-level MUI DataTable.
 *
 * This object is intentionally created at module scope.
 *
 * Unlike the low-level `resolveFeatures()` API, this feature family is
 * not rebuilt per table instance. Individual MUI DataTable instances
 * enable/disable behavior through TanStack table and column options.
 */
export const muiDataTableFeatures = tableFeatures({
  /**
   * ------------------------------------------------------------
   * Feature modules
   * ------------------------------------------------------------
   */

  /**
   * Column-specific filtering.
   *
   * This is also a prerequisite for globalFilteringFeature.
   */
  columnFilteringFeature,

  /**
   * Global table search/filtering.
   *
   * TanStack validates that columnFilteringFeature is also present.
   */
  globalFilteringFeature,

  /**
   * Row sorting state and APIs.
   */
  rowSortingFeature,

  /**
   * Pagination state and APIs.
   */
  rowPaginationFeature,

  /**
   * Checkbox/single/multi/range row selection APIs.
   */
  rowSelectionFeature,

  /**
   * Column visibility state and APIs.
   */
  columnVisibilityFeature,

  /**
   * Logical start/end column pinning.
   */
  columnPinningFeature,

  /**
   * Persistent committed column widths.
   */
  columnSizingFeature,

  /**
   * Interactive drag resizing.
   *
   * columnSizingFeature is deliberately registered before this
   * because TanStack declares sizing as a prerequisite of resizing.
   */
  columnResizingFeature,

  /**
   * ------------------------------------------------------------
   * Client-side row model factories
   * ------------------------------------------------------------
   *
   * These factories make the MUI family capable of client-side
   * processing by default.
   *
   * Manual/server-side modes can bypass the corresponding processing
   * through TanStack's `manualSorting`, `manualFiltering`, and
   * `manualPagination` options.
   */

  filteredRowModel: createFilteredRowModel(),

  sortedRowModel: createSortedRowModel(),

  paginatedRowModel: createPaginatedRowModel(),

  /**
   * ------------------------------------------------------------
   * Registered filter functions
   * ------------------------------------------------------------
   *
   * Register individual functions instead of the complete `filterFns`
   * object so unused built-ins remain tree-shakeable.
   *
   * These particular functions cover TanStack's common automatic
   * filtering choices for text, numeric, date, boolean/object,
   * array, and fallback comparison behavior.
   */
  filterFns: {
    includesString: filterFn_includesString,

    equals: filterFn_equals,

    weakEquals: filterFn_weakEquals,

    inNumberRange: filterFn_inNumberRange,

    inDateRange: filterFn_inDateRange,

    arrIncludes: filterFn_arrIncludes,
  },

  /**
   * ------------------------------------------------------------
   * Registered sorting functions
   * ------------------------------------------------------------
   *
   * Same tree-shaking strategy as filtering.
   */
  sortFns: {
    alphanumeric: sortFn_alphanumeric,

    text: sortFn_text,

    datetime: sortFn_datetime,

    basic: sortFn_basic,
  },

  /**
   * ------------------------------------------------------------
   * Type-only metadata slots
   * ------------------------------------------------------------
   *
   * TanStack strips these phantom values from runtime feature
   * registration. Their types flow through TFeatures and therefore
   * strongly type columnDef.meta and table.options.meta.
   */
  columnMeta: {} as MuiDataTableColumnMeta,

  tableMeta: {} as MuiDataTableMeta,
});

/**
 * Exact static feature type used by the MUI DataTable family.
 */
export type MuiDataTableFeatures = typeof muiDataTableFeatures;
