import { RegistryImpl } from "../registry/registryImpl";
import type { PluginRegistry } from "./pluginRegistry";

/**
 * Runtime implementation of the DataTable plugin registry.
 *
 * The implementation currently inherits generic registry
 * storage while providing a semantic extension point for
 * future plugin-specific behavior.
 */
export class PluginRegistryImpl<TPlugins extends object>
  extends RegistryImpl<TPlugins>
  implements PluginRegistry<TPlugins> {}
