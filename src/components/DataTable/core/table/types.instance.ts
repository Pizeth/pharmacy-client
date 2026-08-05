import type { RowData, Table, TableFeatures } from "@tanstack/react-table";

// import type { ResolvedTableFeatures } from "./types";

/**
 * Our framework table instance.
 *
 * Notice:
 *
 * TData alone is not enough.
 *
 * The feature collection participates
 * in the type.
 */
export interface DataTableInstance<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Underlying TanStack table instance.
   *
   * This will later become
   * feature augmented.
   */
  table: Table<TFeatures, TData>;

  /**
   * Enabled features.
   */
  //   features: TFeatures;
}
