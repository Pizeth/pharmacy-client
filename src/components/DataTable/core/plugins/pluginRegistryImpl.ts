import { RegistryImpl } from "../registry/registryImpl";

import type { PluginMap } from "./pluginMap";

import type { TypedPluginRegistry } from "./pluginRegistry";

/**
 * Runtime implementation of the plugin registry.
 */
export class PluginRegistryImpl<TPlugins extends PluginMap>
  extends RegistryImpl<TPlugins>
  implements TypedPluginRegistry<TPlugins> {}
