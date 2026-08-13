// src/components/DataTable/core/table/createDataTable.ts

import { type RowData, type Table, constructTable } from "@tanstack/table-core";
import {
  buildTableOptions,
  BuiltTableFeatures,
  BuiltTableOptions,
} from "../builder/buildTableOptions";
import type { DataTableFeatureConfig } from "../features/types";
import { BuildTableOptionsInput } from "../builder/types";

/**
 * Creates the underlying TanStack Table v9 instance from the framework's
 * public DataTable configuration.
 *
 * This function is framework-core code:
 *
 * - it is not a React hook
 * - it does not render anything
 * - it does not use `useTable`
 * - it does not use the v8 `useReactTable`
 *
 * The complete construction pipeline is:
 *
 *   DataTableFeatureConfig
 *            ↓
 *   resolveFeatures()
 *            ↓
 *   BuiltTableFeatures<TConfig>
 *            ↓
 *   buildTableOptions()
 *            ↓
 *   BuiltTableOptions<TConfig, TData>
 *            ↓
 *   constructTable<
 *     BuiltTableFeatures<TConfig>,
 *     TData
 *   >()
 *            ↓
 *   Table<
 *     BuiltTableFeatures<TConfig>,
 *     TData
 *   >
 */
export function createDataTable<
  const TConfig extends DataTableFeatureConfig,
  TData extends RowData,
>(
  input: BuildTableOptionsInput<TData, TConfig>,
): Table<BuiltTableFeatures<TConfig>, TData> {
  /**
   * Explicit checkpoint for the resolved options type.
   *
   * Preserve the already-resolved feature relationship
   * produced by our builder.
   *
   * v9 table creation will happen here.
   *
   * We intentionally isolate this.
   *
   * Nothing else in the application
   * should know how TanStack creates
   * the instance.
   */
  const options: BuiltTableOptions<TConfig, TData> = buildTableOptions(input);

  /**
   * Explicitly provide TanStack's two generic arguments.
   *
   * TConfig is our public flag configuration.
   *
   * Do NOT let constructTable infer TFeatures here.
   *
   * The first generic is the resolved TanStack feature set,
   * not our public DataTable feature configuration.
   *
   * BuiltTableFeatures<TConfig> is the actual TanStack
   * feature object.
   */
  return constructTable<BuiltTableFeatures<TConfig>, TData>(options);
}
