"use client";

import type { ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";
import { useMuiDataTableContext, type MuiDataTableInstance } from "../table";
import { SelectionDependencyBoundary } from "./SelectionDependencyBoundary";

export type LiveCallbackBoundaryProps<TData extends RowData> = {
  readonly render: (table: MuiDataTableInstance<TData>) => ReactNode;
};

/**
 * Internal correctness proof, not a public optimization API.
 * Requires the genuine FULL-state createTableHook owner. A narrowed owner is
 * deliberately unsupported: no copied state, proxy or fabricated table wrapper
 * can repair its AppTable context. Normal React context updates carry new
 * options/controlled state; Subscribe invalidates callback invocation even when
 * the result is null/undefined/false or an empty fragment.
 */
export function LiveCallbackBoundary<TData extends RowData>(props: LiveCallbackBoundaryProps<TData>) {
  const table = useMuiDataTableContext<TData>();
  if (!("rowSelection" in table.state)) {
    throw new Error("LiveCallbackBoundary requires a full-state useMuiDataTable owner");
  }
  const render = () => props.render(table);
  return <SelectionDependencyBoundary Subscribe={table.Subscribe} render={render} />;
}
