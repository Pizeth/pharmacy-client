import { createEventBus } from "../events";
import { PluginRegistryImpl } from "../plugins";
import { registerEntries } from "../registry";
import { ServiceRegistryImpl } from "../services";

import type {
  CreateDataTableRuntimeOptions,
  DataTableRuntime,
} from "./dataTableContext.types";

/**
 * Creates the stable, framework-independent DataTable runtime.
 *
 * This does not know anything about:
 *
 * - TanStack Table
 * - React
 * - ReactTable
 * - MUI
 *
 * It only owns infrastructure whose identity should remain
 * stable:
 *
 * - events
 * - services
 * - plugins
 */
export function createDataTableRuntime<
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
>(
  options: CreateDataTableRuntimeOptions<TEvents, TServices, TPlugins> = {},
): DataTableRuntime<TEvents, TServices, TPlugins> {
  const services = new ServiceRegistryImpl<TServices>();
  registerEntries(services, options.services);

  const plugins = new PluginRegistryImpl<TPlugins>();
  registerEntries(plugins, options.plugins);

  const events = options.events ?? createEventBus<TEvents>();

  return {
    events,
    services,
    plugins,
  };
}
