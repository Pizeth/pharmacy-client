import type { DataTableTypesBase, TableOf } from "../types";
import type { Table } from "@tanstack/table-core";
import type { EventBus, EventMap } from "../events";
import type { Registry } from "../registry";
import type { CommandRegistry } from "../commands";
// import type { ServiceRegistry } from "../services";
// import type { PluginRegistry } from "../plugins";
import type { DataTableContext } from "./types";
import type {
  RuntimeCommands,
  RuntimeEvents,
  //   RuntimePlugins,
  //   RuntimeServices,
} from "../runtime/resolveRuntime";

// export interface CreateContextOptions<
//   TTypes extends DataTableTypesBase,
//   TEvents extends EventMap,
//   TRegistry extends Record<PropertyKey, object>,
// > {
//   table: Table<TTypes["features"], TTypes["row"]>;

//   events: EventBus<TEvents>;

//   registry: Registry<TRegistry>;
// }

// /**
//  * Creates the shared runtime context.
//  */
// export function createContext<
//   TTypes extends DataTableTypesBase,
//   TEvents extends EventMap,
//   TRegistry extends Record<PropertyKey, object>,
// >(
//   options: CreateContextOptions<TTypes, TEvents, TRegistry>,
// ): DataTableContext<TTypes, TEvents, TRegistry> {
//   return {
//     table: options.table,

//     events: options.events,

//     registry: options.registry,
//   };
// }

export interface CreateContextOptions<TTypes extends DataTableTypesBase> {
  table: Table<TTypes["features"], TTypes["row"]>;

  events: EventBus<RuntimeEvents>;

  commands: CommandRegistry<TTypes, RuntimeCommands>;

  //   services: ServiceRegistry<TTypes, RuntimeServices>;

  //   plugins: PluginRegistry<TTypes, RuntimePlugins>;
}

/**
 * Creates the shared runtime context.
 */
export function createContext<TTypes extends DataTableTypesBase>(
  options: CreateContextOptions<TTypes>,
): DataTableContext<TTypes> {
  return {
    table: options.table,

    events: options.events,

    commands: options.commands,

    // services: options.services,

    // plugins: options.plugins,
  };
}
