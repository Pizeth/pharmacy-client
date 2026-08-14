"use client";

import { useTable } from "@tanstack/react-table";
import type { RowData, TableState } from "@tanstack/table-core";
import { buildTableOptions } from "../../core/builder";
import type { BuiltTableFeatures } from "../../core/builder";
import type { DataTableFeatureConfig } from "../../core/features";
import type {
  DataTableStateSelector,
  ReactDataTableInstance,
  UseDataTableInput,
} from "../types";

/**
 * Create a reactive TanStack Table v9 instance using the
 * low-level dynamic DataTable feature configuration.
 *
 * When no selector is supplied, TSelected defaults to the
 * complete TableState for the resolved feature set.
 *
 * When a selector is supplied, table.state becomes
 * Readonly<TSelected>.
 */
export function useDataTable<
  const TConfig extends DataTableFeatureConfig,
  TData extends RowData,
  TSelected = TableState<BuiltTableFeatures<TConfig>>,
>(
  input: UseDataTableInput<TData, TConfig>,

  selector?: DataTableStateSelector<TConfig, TSelected>,
): ReactDataTableInstance<TConfig, TData, TSelected> {
  const options = buildTableOptions(input);

  return useTable<BuiltTableFeatures<TConfig>, TData, TSelected>(
    options,
    selector,
  );
}
