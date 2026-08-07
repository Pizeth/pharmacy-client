import type {
  DataTableTypesBase,
  FeaturesOf,
  RowOf,
  TableOf,
} from "./baseTypes";

/**
 * Extract row model.
 */
export type ExtractRow<TTypes extends DataTableTypesBase> = RowOf<TTypes>;

/**
 * Extract feature registry.
 */
export type ExtractFeatures<TTypes extends DataTableTypesBase> =
  FeaturesOf<TTypes>;

/**
 * Extract TanStack table.
 */
export type ExtractTable<TTypes extends DataTableTypesBase> = TableOf<TTypes>;
