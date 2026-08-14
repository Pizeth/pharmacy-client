import type { RowData, Table, TableFeatures } from "@tanstack/table-core";

/**
 * Compile-time identity of a DataTable family.
 *
 * This is not runtime context.
 *
 * Minimum type contract shared by the DataTable framework.
 *
 * Framework subsystems that only need access to the table's
 * feature set and row-data type can constrain themselves to
 * this type instead of depending on the complete DataTable
 * type map.
 *
 * Higher-level framework objects may contain additional
 * information, but anything that satisfies this shape can
 * participate in the core type system.
 */
export type DataTableTypesBase = {
  /**
   * Concrete TanStack feature set.
   */
  features: TableFeatures;

  /**
   * Application row-data shape.
   */
  row: RowData;
};

/**
 * Extract the concrete feature set from a framework type map.
 */
export type FeaturesOf<TTypes extends DataTableTypesBase> = TTypes["features"];

/**
 * Extract the concrete row-data type from a framework type map.
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
