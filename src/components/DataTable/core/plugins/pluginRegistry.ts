import type { Registry } from "../registry/registry";

/**
 * Strongly typed registry of DataTable plugins.
 *
 * TPlugins describes:
 *
 *   plugin key -> plugin implementation
 */
export type PluginRegistry<TPlugins extends object> = Registry<TPlugins>;
