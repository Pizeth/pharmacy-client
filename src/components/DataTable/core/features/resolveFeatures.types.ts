// import type { FeatureMap } from "./featureMap";

import type { FeatureMap } from "./featureMap.generated";
import type { DataTableFeatureConfig } from "./types";

/**
 * Resolve a public DataTable feature flags configuration into the
 * corresponding TanStack feature-slot object.
 *
 * Example:
 *
 * {
 *   sorting: true;
 *   pagination: true;
 * }
 *
 * becomes:
 *
 * {
 *   rowSortingFeature:
 *     typeof rowSortingFeature;
 *
 *   rowPaginationFeature:
 *     typeof rowPaginationFeature;
 * }
 *
 * Features whose value is false or undefined are omitted.
 */
export type ResolveFeatures<TConfig extends DataTableFeatureConfig> = {
  [K in keyof TConfig as K extends keyof FeatureMap
    ? TConfig[K] extends true
      ? FeatureMap[K]["slot"]
      : never
    : never]: K extends keyof FeatureMap ? FeatureMap[K]["feature"] : never;
};
