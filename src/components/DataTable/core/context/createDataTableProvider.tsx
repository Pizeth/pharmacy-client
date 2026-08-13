"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CommandMap } from "../commands/types";
import type { DataTableTypesBase } from "../types";
import type {
  DataTableContext,
  DataTableRuntimeContext,
} from "./dataTableContext.types";

/**
 * Create a fully typed React context/provider/hook set for
 * one concrete DataTable type configuration.
 *
 * Why a factory?
 *
 * React's createContext() needs one concrete value type at
 * creation time.
 *
 * A generic global context such as:
 *
 *   createContext<DataTableContext<???>>(...)
 *
 * cannot preserve arbitrary per-table generics.
 *
 * The returned object contains:
 *
 * - Provider
 * - useDataTableContext
 * - Context
 *
 * This factory captures those generics once and returns
 * correctly typed React primitives.
 */
// export function createDataTableProvider<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
//   TServices extends object,
//   TPlugins extends object,
//   TCommands extends CommandMap<
//     DataTableCommandContext<TFeatures, TData, TServices, TPlugins>
//   >,
export function createDataTableProvider<
  TTypes extends DataTableTypesBase,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins>
  >,
>() {
  type ContextValue = DataTableContext<
    TTypes,
    TEvents,
    TServices,
    TPlugins,
    TCommands
  >;

  /**
   * null is used only to detect missing providers.
   */
  const Context = createContext<ContextValue | null>(null);

  interface ProviderProps {
    readonly value: ContextValue;

    readonly children: ReactNode;
  }

  /**
   * React provider for this specific DataTable
   * configuration.
   */
  function Provider(props: ProviderProps) {
    return (
      <Context.Provider value={props.value}>{props.children}</Context.Provider>
    );
  }

  /**
   * Retrieve the DataTable context from React.
   *
   * Throws when called outside the matching provider so
   * consumers never have to handle null.
   */
  function useDataTableContext(): ContextValue {
    const context = useContext(Context);

    if (context === null) {
      throw new Error(
        "useDataTableContext must be used within a DataTable Provider.",
      );
    }

    return context;
  }

  return {
    Context,
    Provider,
    useDataTableContext,
  } as const;
}
