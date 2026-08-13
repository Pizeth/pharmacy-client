import type { RowData, Table, TableFeatures } from "@tanstack/table-core";
import type { CommandMap, CommandRegistry } from "../commands/types";
import { DataTableTypesBase, FeaturesOf, RowOf } from "../types";
import { ServiceRegistry } from "../services";
import { PluginRegistry } from "../plugins";
import { EventBus } from "../events";

/**
 * Runtime environment available to every DataTable command.
 *
 * TTable is deliberately generic.
 *
 * The core runtime does not care whether the table instance comes from:
 *
 * - constructTable()
 * - React useTable()
 * - another framework adapter
 *
 * It only carries the concrete table instance supplied by the caller.
 *
 * IMPORTANT:
 *
 * This is NOT the same thing as DataTableTypesBase.
 *
 * DataTableTypesBase describes compile-time identity:
 *
 *   {
 *     features;
 *     row;
 *   }
 *
 * DataTableRuntimeContext contains real runtime objects:
 *
 *   {
 *     table;
 *     events;
 *     services;
 *     plugins;
 *   }
 *
 * There is intentionally no `row` property here.
 *
 * Row-specific commands should receive the target row or row
 * identifier through their command payload.
 */
export interface DataTableRuntimeContext<
  // TTypes extends DataTableTypesBase,
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
> {
  /**
   * Underlying TanStack Table v9 instance.
   */
  // readonly table: Table<FeaturesOf<TTypes>, RowOf<TTypes>>;
  readonly table: TTable;

  /**
   * Strongly typed application/table event bus.
   */
  readonly events: EventBus<TEvents>;

  /**
   * Strongly typed DataTable service registry.
   */
  readonly services: ServiceRegistry<TServices>;

  /**
   * Strongly typed DataTable plugin registry.
   */
  readonly plugins: PluginRegistry<TPlugins>;
}

/**
 * Values accepted when constructing a DataTable runtime
 * context.
 */
export interface CreateDataTableContextOptions<
  // TTypes extends DataTableTypesBase,
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
> {
  /**
   * Existing TanStack table instance.
   */
  // readonly table: Table<FeaturesOf<TTypes>, RowOf<TTypes>>;
  readonly table: TTable;

  /**
   * Optional initial service implementations.
   */
  readonly services?: Partial<TServices>;

  /**
   * Optional initial plugin implementations.
   */
  readonly plugins?: Partial<TPlugins>;

  /**
   * Optional existing event bus.
   *
   * When omitted, createDataTableContext creates one.
   *
   * This makes dependency injection possible without forcing
   * it on normal consumers.
   */
  readonly events?: EventBus<TEvents>;
}

/**
 * Final DataTable context.
 *
 * It contains the runtime environment plus the command
 * registry whose handlers receive exactly that environment.
 */
export interface DataTableContext<
  // TTypes extends DataTableTypesBase,
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    // DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins>
    DataTableRuntimeContext<TTable, TEvents, TServices, TPlugins>
  >,
  // > extends DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins> {
> extends DataTableRuntimeContext<TTable, TEvents, TServices, TPlugins> {
  /**
   * Strongly typed command registry.
   */
  readonly commands: CommandRegistry<
    // DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins>,
    DataTableRuntimeContext<TTable, TEvents, TServices, TPlugins>,
    TCommands
  >;
}

/**
 * Fully typed factory options including initial commands.
 */
export type CreateDataTableContextInput<
  // TTypes extends DataTableTypesBase,
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    // DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins>
    DataTableRuntimeContext<TTable, TEvents, TServices, TPlugins>
  >,
  // > = CreateDataTableContextOptions<TTypes, TEvents, TServices, TPlugins> & {
> = CreateDataTableContextOptions<TTable, TEvents, TServices, TPlugins> & {
  /**
   * Commands to register during context creation.
   */
  readonly commands?: Partial<TCommands>;
};

/**
 * Runtime context exposed to command handlers.
 *
 * This context satisfies DataTableTypesBase while also
 * providing the runtime infrastructure available to commands.
 *
 * The context combines:
 *
 * - TanStack Table v9 instance
 * - active table feature set
 * - current row data
 * - strongly typed services
 * - strongly typed plugins
 */
export interface DataTableCommandContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends object,
  TPlugins extends object,
> extends DataTableTypesBase {
  /**
   * TanStack Table v9 table instance.
   *
   * IMPORTANT:
   *
   * TanStack Table v9 uses:
   *
   *     Table<TFeatures, TData>
   *
   * not:
   *
   *     Table<TData>
   */
  readonly table: Table<TFeatures, TData>;

  /**
   * Feature set registered on the table.
   *
   * This satisfies DataTableTypesBase.features.
   */
  readonly features: TFeatures;

  /**
   * Current row model.
   *
   * This satisfies DataTableTypesBase.row.
   */
  readonly row: TData;

  /**
   * Application services available to commands.
   *
   * The generic TServices preserves the key/value relationship.
   */
  readonly services: ServiceRegistry<TServices>;

  /**
   * DataTable plugins available to commands.
   *
   * The generic TPlugins preserves the key/value relationship.
   */
  readonly plugins: PluginRegistry<TPlugins>;
}

/**
 * Complete DataTable runtime context.
 *
 * This is the object passed around by DataTable infrastructure.
 *
 * The command context contains everything commands are allowed
 * to consume.
 *
 * The complete DataTable context additionally exposes the
 * command registry itself.
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
 *
 * It contains the runtime environment plus the command
 * registry whose handlers receive exactly that environment.
 */
export interface DataTableContextOld<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>
  >,
> extends DataTableCommandContext<TFeatures, TData, TServices, TPlugins> {
  /**
   * Registry containing all commands available to this table.
   */
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
  TServices extends object,
  TPlugins extends object,
> {
  readonly table: Table<TFeatures, TData>;

  readonly services: ServiceRegistry<TServices>;

  readonly plugins: PluginRegistry<TPlugins>;
}
