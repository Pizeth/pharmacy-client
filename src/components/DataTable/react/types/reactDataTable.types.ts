// src/components/DataTable/react/types/reactDataTable.types.ts

import type { RowData, TableState } from "@tanstack/table-core";
import type { ReactTable } from "@tanstack/react-table";
import type {
  BuiltTableFeatures,
  BuildTableOptionsInput,
} from "../../core/builder";

import type { DataTableFeatureConfig } from "../../core/features";

import type {
  DataTableTypes,
  DataTableTypesBase,
  FeaturesOf,
  RowOf,
} from "../../core/types";
import { CommandMap, DataTableRuntimeContext } from "../../core";
import { EventBus } from "../../core/events";

/**
 * Complete framework type bag produced from a public
 * DataTable feature configuration and row-data type.
 */
export type ReactDataTableTypes<
  TConfig extends DataTableFeatureConfig,
  TData extends RowData,
> = DataTableTypes<BuiltTableFeatures<TConfig>, TData>;

/**
 * React-specific TanStack table instance produced by
 * useTable().
 *
 * TSelected represents the reactive state projection exposed
 * through table.state.
 */
export type ReactDataTableInstance<
  TConfig extends DataTableFeatureConfig,
  TData extends RowData,
  TSelected = TableState<BuiltTableFeatures<TConfig>>,
> = ReactTable<BuiltTableFeatures<TConfig>, TData, TSelected>;

/**
 * Selector passed as the second argument to TanStack v9's
 * useTable().
 */
export type DataTableStateSelector<
  TConfig extends DataTableFeatureConfig,
  TSelected,
> = (state: TableState<BuiltTableFeatures<TConfig>>) => TSelected;

/**
 * Input accepted by the React useDataTable() hook.
 *
 * It currently mirrors the core builder input.
 *
 * We intentionally keep columns broad until Phase 1.4,
 * where the v9 column system will become strongly typed.
 */
export type UseDataTableInput<
  TData extends RowData,
  TConfig extends DataTableFeatureConfig,
> = BuildTableOptionsInput<TData, TConfig>;

/**
 * Runtime dependencies used when connecting a React table to
 * the DataTable framework runtime.
 */
export type UseDataTableRuntimeInput<
  //   TTypes extends DataTableTypesBase,
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    // DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins>
    DataTableRuntimeContext<TTable, TEvents, TServices, TPlugins>
  >,
  //   TSelected,
> = {
  //   readonly table: ReactTable<FeaturesOf<TTypes>, RowOf<TTypes>, TSelected>;
  readonly table: TTable;
  readonly events?: EventBus<TEvents>;
  readonly services?: Partial<TServices>;
  readonly plugins?: Partial<TPlugins>;
  readonly commands?: Partial<TCommands>;
};
