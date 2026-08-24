// src/components/DataTable/core/features/ignoredTanStackFeatures.ts

import { TanStackStockFeatureSlot } from "./featureAliases";

/**
 * TanStack stock features that DataTable intentionally does not
 * expose through its stable public feature configuration yet.
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
 * The feature synchronization generator verifies that every upstream
 * stock feature belongs to exactly one of two conceptual groups:
 *
 *   1. exposed through featureAliases
 *
 *   or
 *
 *   2. explicitly ignored here
 *
 * If TanStack adds a new stock feature and it appears in neither
 * collection, generation/checking fails.
 *
 * We are then forced to consciously decide whether the new
 * feature should:
 *
 * 1. become part of the DataTable public API, or
 * 2. be explicitly ignored.
 *
 * New features therefore require conscious review.
 */
export const ignoredTanStackFeatures = [
  /**
   * Cell-level functionality not yet exposed.
   */
  "cellSelectionFeature",
  "cellSpanningFeature",

  /**
   * Advanced column processing not yet exposed.
   */
  "columnFacetingFeature",
  "columnGroupingFeature",

  /**
   * Advanced row processing not yet exposed.
   *
   * rowExpandingFeature will move out of this list when we begin
   * Phase 1.6.3.
   */
  "rowAggregationFeature",
  "rowPinningFeature",
] as const satisfies readonly TanStackStockFeatureSlot[];
