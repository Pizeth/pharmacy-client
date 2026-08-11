"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { RowData, TableFeatures } from "@tanstack/table-core";
import type { CommandMap } from "../commands/types";
import type { ServiceMap } from "../services/serviceMap";
import type { PluginMap } from "../plugins/pluginMap";
import type {
  DataTableCommandContext,
  DataTableContext,
} from "./dataTableContext.types";

/**
 * Creates a complete, strongly typed React integration for
 * a DataTable configuration.
 *
 * The returned object contains:
 *
 * - Provider
 * - useDataTableContext
 * - Context
 *
 * The generic types are captured by the factory.
 */
export function createDataTableProvider<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TServices extends ServiceMap,
  TPlugins extends PluginMap,
  TCommands extends CommandMap<
    DataTableCommandContext<TFeatures, TData, TServices, TPlugins>
  >,
>() {
  type Context = DataTableContext<
    TFeatures,
    TData,
    TServices,
    TPlugins,
    TCommands
  >;

  const ReactContext = createContext<Context | null>(null);

  /**
   * React provider for this specific DataTable
   * configuration.
   */
  function Provider(props: {
    readonly context: Context;

    readonly children: ReactNode;
  }) {
    return (
      <ReactContext.Provider value={props.context}>
        {props.children}
      </ReactContext.Provider>
    );
  }

  /**
   * Retrieve the DataTable context from React.
   *
   * Throws a descriptive error when used outside the
   * corresponding Provider.
   */
  function useDataTableContext(): Context {
    const context = useContext(ReactContext);

    if (context === null) {
      throw new Error(
        "useDataTableContext must be used within a DataTable Provider.",
      );
    }

    return context;
  }

  return {
    Context: ReactContext,
    Provider,
    useDataTableContext,
  };
}
