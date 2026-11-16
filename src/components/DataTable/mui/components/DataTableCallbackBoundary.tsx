"use client";

import type { ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";
import { useMuiDataTableContext, type MuiDataTableInstance } from "../table";

/**
 * Internal production invocation boundary, mounted before nullable slot decisions.
 * The genuine AppTable context supplies the callback snapshot; Subscribe owns
 * invalidation, not a replacement state object. Unknown callbacks stay broad.
 * This does not make a narrowed useMuiDataTable owner backwards compatible.
 */
export function DataTableCallbackBoundary<TData extends RowData>({ render }: {
  readonly render: (table: MuiDataTableInstance<TData>) => ReactNode;
}) {
  const table = useMuiDataTableContext<TData>();
  return <table.Subscribe selector={state => state}>{() => render(table)}</table.Subscribe>;
}
