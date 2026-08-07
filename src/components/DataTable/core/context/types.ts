import type { Table } from "@tanstack/table-core";
import type { DataTableTypesBase } from "../types";
import type { EventBus, EventMap } from "../events";
import type { Registry } from "../registry";
import type { CommandRegistry } from "../commands";
// import type { ServiceRegistry } from "../services";
// import type { PluginRegistry } from "../plugins";
import type {
  RuntimeCommands,
  RuntimeEvents,
  //   RuntimePlugins,
  //   RuntimeServices,
} from "../runtime/resolveRuntime";

// /**
//  * Runtime context shared by every framework subsystem.
//  * Every framework service receives this context.
//  */
// export interface DataTableContext<
//   TTypes extends DataTableTypesBase,
//   TEvents extends EventMap,
//   TRegistry extends Record<PropertyKey, object>,
// > {
//   /**
//    * Raw TanStack table instance.
//    */
//   readonly table: Table<TTypes["features"], TTypes["row"]>;

//   /**
//    * Global event bus.
//    */
//   readonly events: EventBus<TEvents>;

//   /**
//    * Generic runtime registry.
//    *
//    * Later:
//    * - plugins
//    * - services
//    * - commands
//    */
//   readonly registry: Registry<TRegistry>;
// }

/**
 * Complete runtime dependency container.
 */
export interface DataTableContext<TTypes extends DataTableTypesBase> {
  /**
   * Underlying TanStack table.
   */
  readonly table: Table<TTypes["features"], TTypes["row"]>;

  /**
   * Application event system.
   */
  readonly events: EventBus<RuntimeEvents>;

  /**
   * Command execution layer.
   */
  readonly commands: CommandRegistry<TTypes, RuntimeCommands>;

  //   /**
  //    * Service container.
  //    */
  //   readonly services: ServiceRegistry<TTypes, RuntimeServices>;

  //   /**
  //    * Plugin container.
  //    */
  //   readonly plugins: PluginRegistry<TTypes, RuntimePlugins>;
}
