import type { RowData, TableFeatures } from "@tanstack/table-core";

import type { DataTableTypesBase } from "./baseTypes";

/**
 * Root type map for the framework.
 *
 * Every module receives exactly a single generic:
 *
 * TTypes representing the entire table.
 */
export type DataTableTypes<
  TFeatures extends TableFeatures,
  TRow extends RowData,
> = DataTableTypesBase & {
  features: TFeatures;
  row: TRow;
};
