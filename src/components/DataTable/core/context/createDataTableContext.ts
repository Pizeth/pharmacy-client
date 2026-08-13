import type { RowData, Table, TableFeatures } from "@tanstack/table-core";
import { CommandRegistryImpl } from "../commands/commandRegistry";
import type { CommandMap } from "../commands/types";
import { PluginRegistryImpl } from "../plugins/pluginRegistryImpl";
import { ServiceRegistryImpl } from "../services/serviceRegistryImpl";
import type {
  CreateDataTableContextInput,
  CreateDataTableContextOptions,
  DataTableCommandContext,
  DataTableContext,
  DataTableRuntimeContext,
} from "./dataTableContext.types";
import { DataTableTypesBase } from "../types";
import { createEventBus } from "../events";

// /**
//  * Options used to create a DataTable context.
//  */
// export interface CreateDataTableContextOptions<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
//   TServices extends object,
//   TPlugins extends object,
// > {
//   /**
//    * The already-created TanStack Table v9 instance.
//    *
//    * The context does not construct the table.
//    */
//   readonly table: Table<TFeatures, TData>;

//   /**
//    * The row associated with the current command context.
//    *
//    * This is intentionally separate from the table because
//    * TData describes the row type while this value represents
//    * the actual row being operated on.
//    */
//   readonly row: TData;

//   /**
//    * Initial services to register.
//    */
//   readonly services?: Partial<TServices>;

//   /**
//    * Initial plugins to register.
//    */
//   readonly plugins?: Partial<TPlugins>;
// }

// /**
//  * Creates the runtime context for a DataTable.
//  *
//  * The table instance is supplied by the caller and remains the
//  * single source of truth for TanStack Table state and features.
//  * The context provides the runtime infrastructure for commands,
//  * services, and plugins.
//  *
//  * The context is strongly typed and satisfies DataTableTypesBase.
//  * IMPORTANT:
//  *
//  * The table instance is supplied by the caller.
//  *
//  * This function does NOT construct the TanStack table.
//  *
//  * That responsibility belongs to our Table creation layer.
//  *
//  * This keeps:
//  *
//  *     table construction
//  *
//  * separate from:
//  *
//  *     DataTable infrastructure construction.
//  */
// export function createDataTableContextOld<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
//   TServices extends object,
//   TPlugins extends object,
//   TCommands extends CommandMap<
//     DataTableCommandContext<TFeatures, TData, TServices, TPlugins>
//   >,
// >(
//   options: CreateDataTableContextOptions<TFeatures, TData, TServices, TPlugins>,
// ): DataTableContext<TFeatures, TData, TServices, TPlugins, TCommands> {
//   /**
//    * Create service registry.
//    */
//   const services = new ServiceRegistryImpl<TServices>();

//   /**
//    * Register the supplied initial services.
//    */
//   if (options.services) {
//     registerEntries(services, options.services);
//   }

//   /**
//    * Create plugin registry.
//    */
//   const plugins = new PluginRegistryImpl<TPlugins>();

//   /**
//    * Register the supplied initial plugins.
//    */
//   if (options.plugins) {
//     registerEntries(plugins, options.plugins);
//   }

//   /**
//    * Build the context exposed to commands.
//    *
//    * Every property required by DataTableTypesBase is
//    * explicitly represented here:
//    *
//    *     features
//    *     row
//    *
//    * while the DataTable-specific infrastructure adds:
//    *
//    *     table
//    *     services
//    *     plugins
//    */
//   const commandContext: DataTableCommandContext<
//     TFeatures,
//     TData,
//     TServices,
//     TPlugins
//   > = {
//     table: options.table,

//     features: options.table.options.features,

//     row: options.row,

//     services,

//     plugins,
//   };

//   /**
//    * Create the command registry.
//    *
//    * Commands receive commandContext rather than the command
//    * registry itself.
//    */
//   const commands = new CommandRegistryImpl<
//     DataTableCommandContext<TFeatures, TData, TServices, TPlugins>,
//     TCommands
//   >(commandContext);

//   /**
//    * Return the complete DataTable context.
//    */
//   return {
//     table: options.table,

//     features: options.table.options.features,

//     row: options.row,

//     services,

//     plugins,

//     commands,
//   };
// }

/**
 * Create the complete non-React runtime context for one DataTable instance.
 *
 * Note that this factory itself is framework-agnostic.
 *
 * The supplied TTable can be:
 *
 * - a core TanStack Table
 * - a ReactTable
 * - another compatible framework table
 *
 * The table instance is supplied by the caller and remains the
 * single source of truth for TanStack Table state and features.
 * The context provides the runtime infrastructure for commands,
 * services, and plugins.
 *
 * The context is strongly typed and satisfies DataTableTypesBase.
 * IMPORTANT:
 *
 * The table instance is supplied by the caller.
 *
 * This function does NOT construct the TanStack table.
 *
 * That responsibility belongs to our Table creation layer.
 *
 * This keeps:
 *
 *     table construction
 *
 * separate from:
 *
 *     DataTable infrastructure construction.
 */
export function createDataTableContext<
  // TTypes extends DataTableTypesBase,
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    // DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins>
    DataTableRuntimeContext<TTable, TEvents, TServices, TPlugins>
  >,
>(
  options: CreateDataTableContextInput<
    // TTypes,
    TTable,
    TEvents,
    TServices,
    TPlugins,
    TCommands
  >,
  // ): DataTableContext<TTypes, TEvents, TServices, TPlugins, TCommands> {
): DataTableContext<TTable, TEvents, TServices, TPlugins, TCommands> {
  /**
   * Create service registry.
   */
  const services = new ServiceRegistryImpl<TServices>();

  /**
   * Register the supplied initial services.
   */
  registerEntries(options.services, services);

  /**
   * Create plugin registry.
   */
  const plugins = new PluginRegistryImpl<TPlugins>();

  /**
   * Register the supplied initial plugins.
   */
  registerEntries(options.plugins, plugins);

  /**
   * Event bus.
   *
   * Use a supplied bus if one was injected, otherwise create
   * the normal framework implementation.
   */
  const events = options.events ?? createEventBus<TEvents>();

  /**
   * Build the immutable command execution environment.
   *
   * Commands do NOT receive the command registry itself.
   *
   * This avoids recursive context construction and keeps
   * command responsibilities focused on:
   *
   * - table
   * - services
   * - plugins
   * - events
   */
  const runtimeContext: DataTableRuntimeContext<
    // TTypes,
    TTable,
    TEvents,
    TServices,
    TPlugins
  > = {
    table: options.table,
    events,
    services,
    plugins,
  };

  /**
   * Create command registry after its context exists.
   */
  const commands = new CommandRegistryImpl<typeof runtimeContext, TCommands>(
    runtimeContext,
  );

  /**
   * Register the supplied initial commands.
   */
  registerEntries(options.commands, commands);

  /**
   * Final framework context.
   */
  return {
    ...runtimeContext,
    commands,
  };
}

/**
 * Register entries from a partial typed object into any compatible registry.
 *
 * `Object.keys()` only returns string keys at runtime, so the
 * result is narrowed back to keyof TMap before registration.
 *
 * This helper intentionally accepts Partial<TMap> because the
 * caller may choose to register only a subset of available
 * services/plugins.
 *
 * This helper is intentionally private to context
 * construction.
 */
function registerEntries<TMap extends object>(
  values: Partial<TMap> | undefined,
  registry: {
    register<K extends keyof TMap>(key: K, value: TMap[K]): void;
  },
): void {
  if (!values) {
    return;
  }

  const keys = Object.keys(values) as Array<keyof TMap>;

  for (const key of keys) {
    const value = values[key];

    /**
     * Partial<TMap> means individual entries may be undefined.
     *
     * Only concrete values are registered.
     */
    if (value === undefined) {
      continue;
    }

    registry.register(key, value);

    // if (value !== undefined) {
    //   registry.register(key, value);
    // }
  }
}
