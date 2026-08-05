import type {
  RowData,
  TableFeature,
  TableOptions,
} from "@tanstack/react-table";

/**
 * Public feature flags.
 *
 * These are stable and independent of TanStack.
 */
export interface DataTableFeatureConfig {
  sorting?: boolean;
  filtering?: boolean;
  globalFiltering?: boolean;
  pagination?: boolean;
  selection?: boolean;
  visibility?: boolean;
  pinning?: boolean;
  sizing?: boolean;
}

/**
 * Internal options passed directly to constructTable().
 *
 * Never recreate this type.
 */
export type DataTableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions<TFeatures, TData>;

/**
 * Feature configuration exposed
 * to application code.
 */
// export type DataTableFeatureConfig = Partial<
//   Record<DataTableFeatureName, boolean>
// >;

/**
 * Feature list passed internally
 * to TanStack.
 */
export type ResolvedTableFeatures = TableFeature;
