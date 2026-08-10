import type { Registry } from "../registry/registry";

import type { PluginMap } from "./pluginMap";

/**
 * Strongly typed plugin registry.
 */
export type TypedPluginRegistry<TPlugins extends PluginMap> =
  Registry<TPlugins>;

/**
 * Default plugin registry.
 */
export type PluginRegistry = TypedPluginRegistry<PluginMap>;
