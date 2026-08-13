// src/components/DataTable/react/context/dataTableReactContext.types.ts

import type { RowData, TableState } from "@tanstack/table-core";

import type { CommandMap } from "../../core/commands";

import type {
  DataTableContext,
  DataTableRuntimeContext,
} from "../../core/context";

import type { DataTableTypesBase, FeaturesOf, RowOf } from "../../core/types";

import type { ReactTable } from "@tanstack/react-table";

/**
 * React-specific view of the core DataTable context.
 *
 * Everything except `table` comes directly from the
 * framework-independent context.
 *
 * `table` is narrowed from TanStack core Table to ReactTable
 * so rendering components retain access to:
 *
 * - table.state
 * - table.Subscribe
 * - table.FlexRender
 */
type DataTableReactContext<
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
  // > = Omit<
  //   DataTableContext<TTypes, TEvents, TServices, TPlugins, TCommands>,
  //   "table"
  // > & {
  //   readonly table: ReactTable<FeaturesOf<TTypes>, RowOf<TTypes>, TSelected>;
  // };
> = DataTableContext<TTable, TEvents, TServices, TPlugins, TCommands>;
