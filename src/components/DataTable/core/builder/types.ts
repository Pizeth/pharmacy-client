import type { RowData } from "@tanstack/table-core";

import type { DataTableFeatureConfig } from "../features/types";

/**
 * Framework-level input used to build TanStack TableOptions.
 *
 * TConfig remains generic so feature literals are preserved.
 */
export interface BuildTableOptionsInput<
  TData extends RowData,
  TConfig extends DataTableFeatureConfig,
> {
  /**
   * Table row data.
   */
  data: TData[];

  /**
   * Column definitions.
   *
   * Kept broad until we finalize the v9 column-helper layer.
   */
  columns: unknown[];

  /**
   * Public framework feature configuration.
   */
  features: TConfig;
}
