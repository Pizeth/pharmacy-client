"use client";

import { useMemo } from "react";

import { createDataTableContext } from "../../core/context";

import type { CommandMap } from "../../core/commands";

import type {
  DataTableContext,
  DataTableRuntimeContext,
} from "../../core/context";

// import type { DataTableTypesBase } from "../../core/types";

// import type { DataTableReactContext } from "../context";

import type { UseDataTableRuntimeInput } from "../types";

/**
 * Connect a ReactTable instance to the framework runtime.
 *
 * The runtime contains:
 *
 * - event bus
 * - service registry
 * - plugin registry
 * - command registry
 *
 * These should not be recreated merely because table state
 * caused a React render.
 */
export function useDataTableRuntime<
  //   TTypes extends DataTableTypesBase,
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    // DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins>
    DataTableRuntimeContext<TTable, TEvents, TServices, TPlugins>
  >,
  TSelected,
>(
  input: UseDataTableRuntimeInput<
    // TTypes,
    TTable,
    TEvents,
    TServices,
    TPlugins,
    TCommands
    // TSelected
  >,
): DataTableContext<
  //   TTypes,
  TTable,
  TEvents,
  TServices,
  TPlugins,
  TCommands
  //   TSelected
> {
  /**
   * Core runtime creation.
   *
   * `input.table` is a ReactTable, which contains the
   * underlying TanStack Table APIs required by the core
   * context.
   */
  const coreContext = useMemo(
    () =>
      //   createDataTableContext<TTypes, TEvents, TServices, TPlugins, TCommands>({
      createDataTableContext<TTable, TEvents, TServices, TPlugins, TCommands>({
        table: input.table,

        events: input.events,

        services: input.services,

        plugins: input.plugins,

        commands: input.commands,
      }),
    [input.table, input.events, input.services, input.plugins, input.commands],
  );

  /**
   * Reintroduce the richer ReactTable type at the React
   * boundary.
   *
   * The core context deliberately types table as the
   * framework-independent Table.
   */
  return useMemo(
    () => ({
      ...coreContext,

      table: input.table,
    }),
    [coreContext, input.table],
  );
}
