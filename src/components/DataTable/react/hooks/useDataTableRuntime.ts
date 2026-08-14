"use client";

import { useMemo, useRef, useState } from "react";
import { CommandRegistryImpl } from "../../core/commands";
import type { CommandMap } from "../../core/commands";
import { createDataTableRuntime } from "../../core/context";
import type {
  DataTableCommandContext,
  DataTableContext,
  DataTableRuntime,
} from "../../core/context";
import { registerEntries } from "../../core/registry";
import type { UseDataTableRuntimeInput } from "../types";

/**
 * Compose a React table with DataTable's framework runtime.
 *
 * Important lifetime rules:
 *
 * 1. events/services/plugins are created once
 * 2. command registry is created once
 * 3. registered command definitions are initial configuration
 * 4. the current React table may change
 * 5. command execution always receives the latest table
 *
 * This mirrors TanStack's own approach in createTableHook(),
 * where stable wrapper components resolve the current table
 * through a ref.
 */
export function useDataTableRuntime<
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    DataTableCommandContext<TTable, TEvents, TServices, TPlugins>,
    TCommands
  >,
>(
  input: UseDataTableRuntimeInput<
    TTable,
    TEvents,
    TServices,
    TPlugins,
    TCommands
  >,
): DataTableContext<TTable, TEvents, TServices, TPlugins, TCommands> {
  type CommandContext = DataTableCommandContext<
    TTable,
    TEvents,
    TServices,
    TPlugins
  >;

  /**
   * Holds the latest execution context.
   *
   * The command registry itself remains stable and resolves
   * this ref only when execute() is called.
   */
  const commandContextRef = useRef<CommandContext | null>(null);

  /**
   * Runtime infrastructure is initialized once for this hook
   * lifecycle.
   *
   * We intentionally do not depend on `input.table`.
   *
   * ReactTable's public projection may change as TanStack
   * updates selected state/options; recreating the runtime on
   * every such change would destroy registry identity.
   */
  const [stableRuntime] = useState(() => {
    const runtime: DataTableRuntime<TEvents, TServices, TPlugins> =
      createDataTableRuntime<TEvents, TServices, TPlugins>({
        events: input.events,
        services: input.services,
        plugins: input.plugins,
      });

    const commands = new CommandRegistryImpl<CommandContext, TCommands>(() => {
      const context = commandContextRef.current;

      if (!context) {
        throw new Error("DataTable command context is not available yet.");
      }

      return context;
    });

    registerEntries(commands, input.commands);

    return {
      runtime,
      commands,
    };
  });

  /**
   * Public context follows the current React table projection.
   *
   * The runtime registries and command registry retain stable
   * identity.
   */
  const context = useMemo(() => {
    const value: DataTableContext<
      TTable,
      TEvents,
      TServices,
      TPlugins,
      TCommands
    > = {
      table: input.table,
      events: stableRuntime.runtime.events,
      services: stableRuntime.runtime.services,
      plugins: stableRuntime.runtime.plugins,
      commands: stableRuntime.commands,
    };

    return value;
  }, [input.table, stableRuntime]);

  /**
   * Update the lazy command context every render.
   *
   * Commands executed after this point always observe the
   * latest React table projection.
   */
  commandContextRef.current = context;

  return context;
}
