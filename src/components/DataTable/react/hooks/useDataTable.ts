"use client";

import { useTable } from "@tanstack/react-table";

import type { RowData, TableState } from "@tanstack/table-core";

import { buildTableOptions } from "../../core/builder";

import type { BuiltTableFeatures, BuiltTableOptions } from "../../core/builder";

import type { DataTableFeatureConfig } from "../../core/features";

import type {
  DataTableStateSelector,
  ReactDataTableInstance,
  UseDataTableInput,
} from "../types";

/**
 * Create a React DataTable instance.
 *
 * When no selector is provided, the table subscribes to the
 * complete registered TanStack table state.
 */
export function useDataTable<
  const TConfig extends DataTableFeatureConfig,
  TData extends RowData,
>(
  input: UseDataTableInput<TData, TConfig>,
): ReactDataTableInstance<TConfig, TData>;

/**
 * Create a React DataTable instance subscribed only to the
 * selected state projection.
 */
export function useDataTable<
  const TConfig extends DataTableFeatureConfig,
  TData extends RowData,
  TSelected,
>(
  input: UseDataTableInput<TData, TConfig>,
  selector: DataTableStateSelector<TConfig, TSelected>,
): ReactDataTableInstance<TConfig, TData, TSelected>;

/**
 * Runtime implementation.
 *
 * TanStack v9's useTable() already accepts an optional selector:
 *
 *   useTable(options, selector?)
 *
 * so there is no need to branch manually.
 *
 * React adapter for DataTable's core option builder.
 *
 * This hook:
 *
 * 1. accepts the framework's public configuration
 * 2. resolves DataTable feature aliases
 * 3. builds TanStack TableOptions
 * 4. delegates reactive table construction to TanStack v9's
 *    useTable()
 *
 * It deliberately does NOT construct framework services,
 * commands, plugins, or context.
 *
 * That orchestration is handled by the next layer.
 */
export function useDataTable<
  const TConfig extends DataTableFeatureConfig,
  TData extends RowData,
  TSelected = TableState<BuiltTableFeatures<TConfig>>,
>(
  input: UseDataTableInput<TData, TConfig>,
  selector?: DataTableStateSelector<TConfig, TSelected>,
): ReactDataTableInstance<TConfig, TData, TSelected> {
  const options: BuiltTableOptions<TConfig, TData> = buildTableOptions(input);

  return useTable<BuiltTableFeatures<TConfig>, TData, TSelected>(
    options,
    selector,
  );

  //   /**
  //    * TanStack itself supports an optional selector.
  //    *
  //    * We need this small branch because forwarding
  //    * `selector | undefined` directly can interfere with
  //    * overload/generic inference depending on the installed
  //    * declaration.
  //    */
  //   if (selector) {
  //     return useTable<BuiltTableFeatures<TConfig>, TData, TSelected>(
  //       options,
  //       selector,
  //     );
  //   }

  //   /**
  //    * With no custom selector, TanStack's default state type is
  //    * TableState<TFeatures>.
  //    *
  //    * Our implementation generic defaults TSelected to that same
  //    * type, but TypeScript cannot establish the equality inside
  //    * this runtime branch for an arbitrary TSelected.
  //    *
  //    * Keep that bridge local to this overload implementation.
  //    */
  //   return useTable<BuiltTableFeatures<TConfig>, TData>(
  //     options,
  //   ) as ReactDataTableInstance<TConfig, TData, TSelected>;
}
