"use client";

import { createContext, useContext } from "react";

import type { ReactNode } from "react";

import type { CommandMap } from "../../core/commands";

import type {
  DataTableContext,
  DataTableRuntimeContext,
} from "../../core/context";

// import type { DataTableTypesBase } from "../../core/types";

// import type { DataTableReactContext } from "./dataTableReactContext.types";

/**
 * Create a React Context, Provider, and strongly typed access
 * hook for one concrete DataTable family.
 *
 * React's createContext() requires a concrete context type at
 * creation time, which is why this is a generic factory rather
 * than one global context containing erased DataTable types.
 */
export function createDataTableReactProvider<
  //   TTypes extends DataTableTypesBase,
  TTable extends object,
  TEvents extends object,
  TServices extends object,
  TPlugins extends object,
  TCommands extends CommandMap<
    // DataTableRuntimeContext<TTypes, TEvents, TServices, TPlugins>
    DataTableRuntimeContext<TTable, TEvents, TServices, TPlugins>
  >,
  //   TSelected = TableState<FeaturesOf<TTypes>>,
>() {
  type ContextValue = DataTableContext<
    // TTypes,
    TTable,
    TEvents,
    TServices,
    TPlugins,
    TCommands
    // TSelected
  >;

  const Context = createContext<ContextValue | null>(null);

  interface ProviderProps {
    readonly value: ContextValue;

    readonly children: ReactNode;
  }

  /**
   * React provider for this concrete DataTable family.
   */
  function Provider(props: ProviderProps) {
    return (
      <Context.Provider value={props.value}>{props.children}</Context.Provider>
    );
  }

  /**
   * Strongly typed access hook.
   */
  function useDataTableContext(): ContextValue {
    const value = useContext(Context);

    if (!value) {
      throw new Error(
        "useDataTableContext must be used inside the matching DataTable Provider.",
      );
    }

    return value;
  }

  return {
    Context,
    Provider,
    useDataTableContext,
  } as const;
}
