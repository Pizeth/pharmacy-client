import type { RowData, TableFeatures } from "@tanstack/table-core";

import type { DataTableTypes } from "./dataTableTypes";

/**
 * Creates the framework type map.
 *
 * This becomes the only place responsible
 * for constructing DataTableTypes.
 */
export type InferDataTableTypes<
  TFeatures extends TableFeatures,
  TRow extends RowData,
> = DataTableTypes<TFeatures, TRow>;
