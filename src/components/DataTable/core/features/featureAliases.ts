// src/components/DataTable/core/features/featureAliases.ts

import type { StockFeatures } from "@tanstack/table-core";

/**
 * Every stock feature slot currently known by the installed
 * TanStack Table version.
 */
export type TanStackStockFeatureSlot = keyof StockFeatures;

/**
 * Maps the DataTable framework's stable public feature names
 * to TanStack Table's stock feature slots.
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
 *   pagination
 *   selection
 *
 * Only this adapter layer needs to change when the upstream
 * TanStack API changes.
 */
export const featureAliases = {
  sorting: "rowSortingFeature",

  filtering: "columnFilteringFeature",

  globalFiltering: "globalFilteringFeature",

  pagination: "rowPaginationFeature",

  selection: "rowSelectionFeature",

  visibility: "columnVisibilityFeature",

  pinning: "columnPinningFeature",

  sizing: "columnSizingFeature",
} as const satisfies Record<string, TanStackStockFeatureSlot>;

/**
 * Stable public feature names exposed by DataTable.
 */
export type DataTableFeatureName = keyof typeof featureAliases;

/**
 * TanStack feature slots currently exposed by DataTable.
 */
export type ExposedTanStackFeatureSlot =
  (typeof featureAliases)[DataTableFeatureName];
