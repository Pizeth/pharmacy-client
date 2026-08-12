import { createContext } from "react";
import type { ReactNode } from "react";
import type { RowData, Table, TableFeatures } from "@tanstack/table-core";
import { CommandRegistryImpl } from "../commands/commandRegistry";
import type { CommandMap } from "../commands/types";
import { PluginRegistryImpl } from "../plugins/pluginRegistryImpl";
// import type { PluginMap } from "../plugins/pluginMap";
import { ServiceRegistryImpl } from "../services/serviceRegistryImpl";
// import type { ServiceMap } from "../services/serviceMap";
import type {
  DataTableCommandContext,
  DataTableContext,
} from "./dataTableContext.types";

/**
 * Options used to create a DataTable context.
 */
export interface CreateDataTableContextOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends object,
  TPlugins extends object,
> {
  /**
   * The already-created TanStack Table v9 instance.
   *
   * The context does not construct the table.
   */
  readonly table: Table<TFeatures, TData>;

  /**
   * The row associated with the current command context.
   *
   * This is intentionally separate from the table because
   * TData describes the row type while this value represents
   * the actual row being operated on.
   */
  readonly row: TData;

  /**
   * Initial services to register.
   */
  readonly services?: Partial<TServices>;

  /**
   * Initial plugins to register.
   */
  readonly plugins?: Partial<TPlugins>;
}

/**
 * Creates the runtime context for a DataTable.
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
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>
  >,
>(
  options: CreateDataTableContextOptions<TFeatures, TData, TServices, TPlugins>,
): DataTableContext<TFeatures, TData, TServices, TPlugins, TCommands> {
  /**
   * Create service registry.
   */
  const services = new ServiceRegistryImpl<TServices>();

  /**
   * Register the supplied initial services.
   */
  if (options.services) {
    registerEntries(services, options.services);
  }

  /**
   * Create plugin registry.
   */
  const plugins = new PluginRegistryImpl<TPlugins>();

  /**
   * Register the supplied initial plugins.
   */
  if (options.plugins) {
    registerEntries(plugins, options.plugins);
  }

  /**
   * Build the context exposed to commands.
   *
   * Every property required by DataTableTypesBase is
   * explicitly represented here:
   *
   *     features
   *     row
   *
   * while the DataTable-specific infrastructure adds:
   *
   *     table
   *     services
   *     plugins
   */
  const commandContext: DataTableCommandContext<
    TFeatures,
    TData,
    TServices,
    TPlugins
  > = {
    table: options.table,

    features: options.table.options.features,

    row: options.row,

    services,

    plugins,
  };

  /**
   * Create the command registry.
   *
   * Commands receive commandContext rather than the command
   * registry itself.
   */
  const commands = new CommandRegistryImpl<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>,
    TCommands
  >(commandContext);

  /**
   * Return the complete DataTable context.
   */
  return {
    table: options.table,

    features: options.table.options.features,

    row: options.row,

    services,

    plugins,

    commands,
  };
}

/**
 * Register every defined entry from a partial map.
 *
 * `Object.keys()` only returns string keys at runtime, so the
 * result is narrowed back to keyof TMap before registration.
 *
 * This helper intentionally accepts Partial<TMap> because the
 * caller may choose to register only a subset of available
 * services/plugins.
 */
function registerEntries<TMap extends object>(
  registry: {
    register<K extends keyof TMap>(key: K, value: TMap[K]): void;
  },
  values: Partial<TMap>,
): void {
  for (const key of Object.keys(values) as Array<keyof TMap>) {
    const value = values[key];

    if (value !== undefined) {
      registry.register(key, value);
    }
  }
}
