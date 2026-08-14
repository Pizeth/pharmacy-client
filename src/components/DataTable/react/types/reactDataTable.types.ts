// src/components/DataTable/react/types/reactDataTable.types.ts

import type { ReactTable } from "@tanstack/react-table";
import type { RowData, TableState } from "@tanstack/table-core";
import type {
  BuiltTableFeatures,
  BuildTableOptionsInput,
} from "../../core/builder";
import type { CommandMap } from "../../core/commands";
import type {
  DataTableCommandContext,
  DataTableContext,
} from "../../core/context";
import type { DataTableFeatureConfig } from "../../core/features";
import type { EventBus } from "../../core/events";

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
 * Input for React runtime composition.
 *
 * services/plugins/commands are initialization definitions.
 *
 * They are consumed on the first committed table lifecycle and
 * are not rebuilt every time React table state changes.
 *
 * Registry mutations should happen through their registry APIs,
 * not by replacing these configuration objects every render.
 */
export type UseDataTableRuntimeInput<
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    DataTableCommandContext<TTable, TEvents, TServices, TPlugins>,
    TCommands
  >,
> = {
  readonly table: TTable;
  readonly events?: EventBus<TEvents>;
  readonly services?: Partial<TServices>;
  readonly plugins?: Partial<TPlugins>;
  readonly commands?: Partial<TCommands>;
};

/**
 * Result of useDataTableRuntime().
 */
export type ReactDataTableContext<
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    DataTableCommandContext<TTable, TEvents, TServices, TPlugins>,
    TCommands
  >,
> = DataTableContext<TTable, TEvents, TServices, TPlugins, TCommands>;
