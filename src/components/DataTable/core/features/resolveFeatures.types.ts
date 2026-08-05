import type { FeatureMap } from "./featureMap";

import type { DataTableFeatureConfig } from "./types";

/**
 * Converts:
 *
 * {
 *   sorting:true,
 *   pagination:true
 * }
 *
 * into:
 *
 * {
 *   rowSortingFeature: typeof rowSortingFeature;
 *   rowPaginationFeature: typeof rowPaginationFeature;
 * }
 */

export type ResolveFeatures<TConfig extends DataTableFeatureConfig> = {
  [K in keyof TConfig as K extends keyof FeatureMap
    ? TConfig[K] extends true
      ? FeatureMap[K]["slot"]
      : never
    : never]: K extends keyof FeatureMap ? FeatureMap[K]["feature"] : never;
};

// export type ResolveFeatures<TConfig extends DataTableFeatureConfig> = {
//   [K in keyof TConfig as TConfig[K] extends true
//     ? FeatureMap[K]["slot"]
//     : never]: FeatureMap[K]["feature"];
// };

const config = {
  sorting: true,
  pagination: true,
} as const;

console.log(config);
