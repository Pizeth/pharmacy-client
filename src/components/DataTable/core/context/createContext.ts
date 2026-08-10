import type { RowData, Table, TableFeatures } from "@tanstack/table-core";
import { CommandRegistryImpl } from "../commands/commandRegistry";
import type { CommandMap } from "../commands/types";
import { PluginRegistryImpl } from "../plugins/pluginRegistryImpl";
import type { PluginMap } from "../plugins/pluginMap";
import { ServiceRegistryImpl } from "../services/serviceRegistryImpl";
import type { ServiceMap } from "../services/serviceMap";
import type {
  DataTableCommandContext,
  DataTableContext,
} from "./dataTableContext.types";

/**
 * Creates the runtime context for a DataTable.
 *
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
  TServices extends ServiceMap,
  TPlugins extends PluginMap,
  TCommands extends CommandMap<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>
  >,
>(options: {
  readonly table: Table<TFeatures, TData>;

  readonly services?: Partial<TServices>;

  readonly plugins?: Partial<TPlugins>;
}): DataTableContext<TFeatures, TData, TServices, TPlugins, TCommands> {
  /**
   * Create service registry.
   */
  const services = new ServiceRegistryImpl<TServices>();

  /**
   * Register initial services.
   */
  if (options.services) {
    registerEntries(services, options.services);
  }

  /**
   * Create plugin registry.
   */
  const plugins = new PluginRegistryImpl<TPlugins>();

  /**
   * Register initial plugins.
   */
  if (options.plugins) {
    registerEntries(plugins, options.plugins);
  }

  /**
   * Build the context exposed to commands.
   *
   * Notice that commands receive the infrastructure
   * context, but not the command registry itself.
   */
  const commandContext: DataTableCommandContext<
    TFeatures,
    TData,
    TServices,
    TPlugins
  > = {
    table: options.table,

    services,

    plugins,
  };

  /**
   * Create command registry.
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

    services,

    plugins,

    commands,
  };
}

/**
 * Register all entries from a partial map.
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
