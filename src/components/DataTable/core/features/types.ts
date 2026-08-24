import { DataTableFeatureName } from "./featureAliases";

/**
 * Stable public DataTable feature configuration.
 *
 * Feature names are derived directly from featureMap so this
 * type automatically tracks the framework's supported features.
 *
 * Example:
 *
 * features: {
 *   sorting: true,
 *   ordering: true,
 *   pagination: true,
 *   selection: true,
 * }
 */
export type DataTableFeatureConfig = Partial<
  Record<DataTableFeatureName, boolean>
>;
