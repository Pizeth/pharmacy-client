// src/components/DataTable/core/features/featureAliases.ts

import type { StockFeatures } from "@tanstack/table-core";

/**
 * Every stock feature slot currently known by the installed
 * TanStack Table version.
 */
export type TanStackStockFeatureSlot = keyof StockFeatures;

/**
 * Maps the DataTable framework's stable public feature names
 * to TanStack Table's stock feature slots and implementations.
 *
 * This file is intentionally handwritten.
 *
 * It defines OUR public API.
 *
 * TanStack may rename, add, or remove internal/stock feature
 * slots in future versions, but application code using
 * DataTable should continue to use stable names such as:
 *
 *   sorting
 *   filtering
 *   ordering
 *   pagination
 *   selection
 *
 * rather than upstream implementation names such as:
 *
 *   rowSortingFeature
 *   columnOrderingFeature
 *   rowPaginationFeature
 *
 * Only this adapter layer needs to change when the upstream
 * TanStack API changes.
 */
export const featureAliases = {
  /**
   * Row sorting.
   */
  sorting: "rowSortingFeature",

  /**
   * Per-column filtering.
   */
  filtering: "columnFilteringFeature",

  /**
   * Global filtering/search.
   */
  globalFiltering: "globalFilteringFeature",

  /**
   * Leaf-column ordering.
   */
  ordering: "columnOrderingFeature",

  /**
   * Row pagination.
   */
  pagination: "rowPaginationFeature",

  /**
   * Row selection.
   */
  selection: "rowSelectionFeature",

  /**
   * Row expansion / hierarchical rows / detail-panel state.
   */
  expanding: "rowExpandingFeature",

  /**
   * Column visibility.
   */
  visibility: "columnVisibilityFeature",

  /**
   * Logical start/end column pinning.
   */
  pinning: "columnPinningFeature",

  /**
   * Persistent committed column widths.
   */
  sizing: "columnSizingFeature",

  /**
   * Interactive column resizing.
   *
   * TanStack requires columnSizingFeature to also be present when
   * column resizing is installed.
   */
  resizing: "columnResizingFeature",
} as const satisfies Record<string, TanStackStockFeatureSlot>;

/**
 * Stable public DataTable feature names.
 *
 * Derived from featureAliases so the public feature-config type
 * automatically follows this adapter.
 */
export type DataTableFeatureName = keyof typeof featureAliases;

/**
 * TanStack stock feature slots currently exposed through DataTable.
 */
export type ExposedTanStackFeatureSlot =
  (typeof featureAliases)[DataTableFeatureName];
