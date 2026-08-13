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
   * Application rows.
   */
  data: TData[];

  /**
   * Column definitions.
   *
   * Intentionally temporary.
   *
   * We will replace this with the correct TanStack v9
   * column type when we audit the column architecture.
   */
  columns: unknown[];

  /**
   * Stable DataTable feature configuration.
   */
  features: TConfig;
}
