import type { RowData, Table, TableFeatures } from "@tanstack/table-core";

/**
 * Minimum type contract understood by the DataTable framework.
 *
 * Framework subsystems that only need access to the table's
 * feature set and row-data type can constrain themselves to
 * this type instead of depending on the complete DataTable
 * type map.
 */
export type DataTableTypesBase = {
  /**
   * TanStack features registered for the table.
   */
  features: TableFeatures;

  /**
   * Shape of one row's application data.
   */
  row: RowData;
};

/**
 * Extract the concrete TanStack feature set from a
 * DataTable type map.
 */
export type FeaturesOf<TTypes extends DataTableTypesBase> = TTypes["features"];

/**
 * Extract the concrete row-data type from a
 * DataTable type map.
 */
export type RowOf<TTypes extends DataTableTypesBase> = TTypes["row"];

/**
 * Construct the corresponding TanStack Table v9 instance
 * type from a DataTable type map.
 *
 * TanStack Table v9 uses:
 *
 *   Table<TFeatures, TData>
 */
export type TableOf<TTypes extends DataTableTypesBase> = Table<
  FeaturesOf<TTypes>,
  RowOf<TTypes>
>;
