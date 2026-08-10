import type { RowData, Table, TableFeatures } from "@tanstack/table-core";

import type { CommandMap, CommandRegistry } from "../commands/types";

import type { ServiceMap, TypedServiceRegistry } from "../services";

import type { PluginMap, TypedPluginRegistry } from "../plugins";

/**
 * DataTable context without commands.
 *
 * This is the portion of context that commands themselves
 * are allowed to consume.
 */
export interface DataTableCommandContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends ServiceMap,
  TPlugins extends PluginMap,
> {
  readonly table: Table<TFeatures, TData>;

  readonly services: TypedServiceRegistry<TServices>;

  readonly plugins: TypedPluginRegistry<TPlugins>;

  readonly features: TFeatures;

  readonly row: TData;
}

/**
 * Complete DataTable runtime context.
 *
 * This is the object passed around by DataTable infrastructure.
 *
 * Generic parameters:
 *
 * TFeatures
 *     TanStack Table v9 feature set.
 *
 * TData
 *     Row data type.
 *
 * TServices
 *     Application service map.
 *
 * TPlugins
 *     Application plugin map.
 *
 * TCommands
 *     Application command map.
 */
export interface DataTableContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends ServiceMap,
  TPlugins extends PluginMap,
  TCommands extends CommandMap<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>
  >,
> extends DataTableCommandContext<TFeatures, TData, TServices, TPlugins> {
  readonly commands: CommandRegistry<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>,
    TCommands
  >;
}

/**
 * The subset of the context exposed to command handlers.
 *
 * This type exists to avoid a circular dependency between
 * CommandContext and DataTableContext.
 */
export interface DataTableContextTypes<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends ServiceMap,
  TPlugins extends PluginMap,
> {
  readonly table: Table<TFeatures, TData>;

  readonly services: TypedServiceRegistry<TServices>;

  readonly plugins: TypedPluginRegistry<TPlugins>;
}
