import type { DataTableRuntimeMaps } from "./types";
import type { EventMap } from "../events";
import type { CommandRegistryMap } from "../commands";
// import type { ServiceMap } from "../services";
// import type { PluginMap } from "../plugins";

export type RuntimeEvents = DataTableRuntimeMaps["events"] & EventMap;

export type RuntimeCommands = DataTableRuntimeMaps["commands"] &
  CommandRegistryMap;

// export type RuntimeServices = DataTableRuntimeMaps["services"] & ServiceMap;

// export type RuntimePlugins = DataTableRuntimeMaps["plugins"] & PluginMap;
