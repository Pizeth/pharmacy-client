import type { RowData, Table, TableFeatures } from "@tanstack/table-core";

/**
 * Root type constraint shared by the entire framework.
 *
 * Every strongly typed framework object extends this shape.
 */
export type DataTableTypesBase = {
  /**
   * Registered TanStack features.
   */
  features: TableFeatures;

  /**
   * Row model.
   */
  row: RowData;
};

/**
 * Extracts the feature registry.
 */
export type FeaturesOf<TTypes extends DataTableTypesBase> = TTypes["features"];

/**
 * Extracts the row type.
 */
export type RowOf<TTypes extends DataTableTypesBase> = TTypes["row"];

/**
 * Extracts the TanStack table instance.
 */
export type TableOf<TTypes extends DataTableTypesBase> = Table<
  FeaturesOf<TTypes>,
  RowOf<TTypes>
>;
