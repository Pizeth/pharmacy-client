import { featureMap } from "./featureMap";
import type { ResolveFeatures } from "./resolveFeatures.types";
import type { DataTableFeatureConfig } from "./types";

// export function resolveFeatures(config: DataTableFeatureConfig = {}) {
//   const features = {} as Record<string, unknown>;

//   for (const key in config) {
//     if (config[key as keyof typeof config]) {
//       const definition = featureMap[key as keyof typeof featureMap];

//       features[definition.key] = definition.feature;
//     }
//   }

//   return features;
// }

export function resolveFeatures<const TConfig extends DataTableFeatureConfig>(
  config: TConfig,
): ResolveFeatures<TConfig> {
  const features = {} as ResolveFeatures<TConfig>;

  for (const key in config) {
    if (config[key as keyof TConfig] === true) {
      const definition = featureMap[key as keyof typeof featureMap];

      (features as Record<string, unknown>)[definition.slot] =
        definition.feature;
    }
  }

  return features;
}

const features = resolveFeatures({
  sorting: true,
  pagination: true,
} as const);

console.log(features);
