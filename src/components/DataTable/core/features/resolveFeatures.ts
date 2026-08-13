// import { FeatureMap, featureMap } from "./featureMap";
import { featureMap } from "./featureMap.generated";
import type { FeatureMap } from "./featureMap.generated";
import type { ResolveFeatures } from "./resolveFeatures.types";
import type { DataTableFeatureConfig } from "./types";

/**
 * Resolve DataTable's public feature configuration into the
 * corresponding TanStack feature-slot object.
 *
 * TypeScript cannot preserve the dynamic relationship between:
 *
 *   public feature name
 *       ->
 *   TanStack slot
 *       ->
 *   TanStack feature implementation
 *
 * while iterating at runtime.
 *
 * The assertion is therefore deliberately isolated inside
 * this resolver.
 */
export function resolveFeatures<const TConfig extends DataTableFeatureConfig>(
  config: TConfig,
): ResolveFeatures<TConfig> {
  const features = {} as ResolveFeatures<TConfig>;

  for (const key in config) {
    if (config[key as keyof TConfig] === true) {
      const definition = featureMap[key as keyof typeof featureMap];

      (features as Record<PropertyKey, unknown>)[definition.slot] =
        definition.feature;
    }
  }

  return features;
}

// /**
//  * Runtime feature object used while dynamically resolving
//  * public feature flags.
//  *
//  * At runtime we cannot retain TypeScript's key-dependent
//  * relationship between:
//  *
//  *   feature name -> TanStack feature slot -> feature value
//  *
//  * That relationship is restored at the return boundary by
//  * ResolveFeatures<TConfig>.
//  */
// type RuntimeResolvedFeatures = Partial<{
//   [K in keyof FeatureMap as FeatureMap[K]["slot"]]: FeatureMap[K]["feature"];
// }>;

// /**
//  * Resolve public DataTable feature flags into TanStack
//  * feature slots.
//  */
// export function resolveFeatures1<const TConfig extends DataTableFeatureConfig>(
//   config: TConfig,
// ): ResolveFeatures<TConfig> {
//   const features: RuntimeResolvedFeatures = {};

//   for (const key of Object.keys(config) as Array<keyof FeatureMap>) {
//     if (config[key] !== true) {
//       continue;
//     }

//     const definition = featureMap[key];

//     /**
//      * TypeScript loses the correlation between the dynamically
//      * selected slot and its corresponding feature value here.
//      *
//      * Keep that unavoidable mutation boundary local.
//      */
//     (features as Record<PropertyKey, unknown>)[definition.slot] =
//       definition.feature;
//   }

//   return features as ResolveFeatures<TConfig>;
// }
