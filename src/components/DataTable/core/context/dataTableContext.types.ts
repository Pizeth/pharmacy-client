import type { RowData, Table, TableFeatures } from "@tanstack/table-core";

import type { CommandMap, CommandRegistry } from "../commands/types";

// import type { ServiceMap, TypedServiceRegistry } from "../services";

// import type { PluginMap, TypedPluginRegistry } from "../plugins";
import { DataTableTypesBase } from "../types";
import { ServiceRegistry } from "../services";
import { PluginRegistry } from "../plugins";

/**
 * Runtime context exposed to command handlers.
 *
 * This context satisfies DataTableTypesBase while also
 * providing the runtime infrastructure available to commands.
 *
 * The context combines:
 *
 * - TanStack Table v9 instance
 * - active table feature set
 * - current row data
 * - strongly typed services
 * - strongly typed plugins
 */
export interface DataTableCommandContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends object,
  TPlugins extends object,
> extends DataTableTypesBase {
  /**
   * TanStack Table v9 table instance.
   *
   * IMPORTANT:
   *
   * TanStack Table v9 uses:
   *
   *     Table<TFeatures, TData>
   *
   * not:
   *
   *     Table<TData>
   */
  readonly table: Table<TFeatures, TData>;

  /**
   * Feature set registered on the table.
   *
   * This satisfies DataTableTypesBase.features.
   */
  readonly features: TFeatures;

  /**
   * Current row model.
   *
   * This satisfies DataTableTypesBase.row.
   */
  readonly row: TData;

  /**
   * Application services available to commands.
   *
   * The generic TServices preserves the key/value relationship.
   */
  readonly services: ServiceRegistry<TServices>;

  /**
   * DataTable plugins available to commands.
   *
   * The generic TPlugins preserves the key/value relationship.
   */
  readonly plugins: PluginRegistry<TPlugins>;
}

/**
 * Complete DataTable runtime context.
 *
 * This is the object passed around by DataTable infrastructure.
 *
 * The command context contains everything commands are allowed
 * to consume.
 *
 * The complete DataTable context additionally exposes the
 * command registry itself.
 *
 * Generic parameters:
 *
 * TFeatures
 *     TanStack Table v9 feature set.
 *
 * TData
 *     Row data type.
 *
 * TServices
 *     Application service map.
 *
 * TPlugins
 *     Application plugin map.
 *
 * TCommands
 *     Application command map.
 */
export interface DataTableContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>
  >,
> extends DataTableCommandContext<TFeatures, TData, TServices, TPlugins> {
  /**
   * Registry containing all commands available to this table.
   */
  readonly commands: CommandRegistry<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>,
    TCommands
  >;
}

/**
 * The subset of the context exposed to command handlers.
 *
 * This type exists to avoid a circular dependency between
 * CommandContext and DataTableContext.
 */
export interface DataTableContextTypes<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends object,
  TPlugins extends object,
> {
  readonly table: Table<TFeatures, TData>;

  readonly services: ServiceRegistry<TServices>;

  readonly plugins: PluginRegistry<TPlugins>;
}
