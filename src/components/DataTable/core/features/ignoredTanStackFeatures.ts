// src/components/DataTable/core/features/ignoredTanStackFeatures.ts

import { TanStackStockFeatureSlot } from "./featureAliases";

/**
 * TanStack stock features that DataTable intentionally does
 * not expose yet.
 *
 * Why keep this explicit?
 *
 * The synchronization generator compares:
 *
 *   all TanStack stock features
 *
 * against:
 *
 *   exposed features
 *   +
 *   intentionally ignored features
 *
 * If TanStack introduces a NEW stock feature that appears in
 * neither collection, generation/checking fails immediately.
 *
 * We are then forced to consciously decide whether the new
 * feature should:
 *
 * 1. become part of the DataTable public API, or
 * 2. be explicitly ignored.
 */
export const ignoredTanStackFeatures = [
  "cellSelectionFeature",
  "cellSpanningFeature",

  "columnFacetingFeature",
  "columnGroupingFeature",
  "columnOrderingFeature",
  "columnResizingFeature",

  "rowAggregationFeature",
  "rowExpandingFeature",
  "rowPinningFeature",
] as const satisfies readonly TanStackStockFeatureSlot[];
