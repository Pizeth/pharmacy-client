// src/components/DataTable/core/table/createDataTable.ts

import { constructTable } from "@tanstack/react-table";

import type { RowData, TableFeatures, Table } from "@tanstack/table-core";

import { buildTableOptions } from "../builder/buildTableOptions";
import type { CreateDataTableInput } from "./createDataTable.types";
import type { DataTableFeatureConfig } from "../features/types";
import type { ResolveFeatures } from "../features/resolveFeatures.types";
import type { FrameworkFeatures } from "../defaults/frameworkFeatures";
import type { MergeFeatures } from "../types/mergeFeatures";

import type { DataTableInstance } from "./types.instance";
import { DataTableOptions } from "./types";

/**
 * Creates our framework table instance.
 *
 * This is NOT a React hook.
 *
 * It is pure table creation logic.
 */
// export function createDataTable<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
// >(options: DataTableOptions<TFeatures, TData>): Table<TFeatures, TData> {
export function createDataTable<
  const TConfig extends DataTableFeatureConfig,
  TData extends RowData,
>(
  input: CreateDataTableInput<TData, TConfig>,
): Table<MergeFeatures<FrameworkFeatures, ResolveFeatures<TConfig>>, TData> {
  // ): DataTableInstance<TFeatures, TData> {
  /**
   * v9 table creation will happen here.
   *
   * We intentionally isolate this.
   *
   * Nothing else in the application
   * should know how TanStack creates
   * the instance.
   */
  const options = buildTableOptions(input);
  return constructTable(options);
}
