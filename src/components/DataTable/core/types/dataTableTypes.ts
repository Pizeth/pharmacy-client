import type { RowData, TableFeatures } from "@tanstack/table-core";

/**
 * Root type map representing one DataTable configuration.
 *
 * Framework modules should normally receive this type map
 * as a single generic rather than separately carrying:
 *
 *   TFeatures
 *   TRow
 *
 * throughout the framework.
 *
 * Additional framework-level type slots may be introduced
 * here later as the architecture grows.
 */
export type DataTableTypes<
  TFeatures extends TableFeatures,
  TRow extends RowData,
> = {
  /**
   * Concrete TanStack feature set.
   */
  features: TFeatures;

  /**
   * Concrete application row-data type.
   */
  row: TRow;
};
