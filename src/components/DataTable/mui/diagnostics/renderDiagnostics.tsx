"use client";

import { createContext, useContext, useLayoutEffect } from "react";

export type DataTableDiagnosticLayer = "owner" | "body" | "row" | "cell";

/** Opt-in output-commit observation; no data/query state is owned here. */
export interface DataTableRenderDiagnostics {
  /** Experimental diagnostic projection, never enabled by production callers. */
  readonly narrowRowSelection?: boolean;
  readonly commit: (layer: DataTableDiagnosticLayer, id: string) => void;
  readonly measureRowModel: <T>(read: () => T) => T;
}

export const DataTableRenderDiagnosticsContext =
  createContext<DataTableRenderDiagnostics | null>(null);

export function useDataTableRenderDiagnostics() {
  return useContext(DataTableRenderDiagnosticsContext);
}

/** Layout effects count committed subscribed output, never speculative renders.
 * Strict Mode can replay mount effects; action windows start after mounting.
 */
export function DataTableDiagnosticCommit({ layer, id }: {
  readonly layer: DataTableDiagnosticLayer;
  readonly id: string;
}) {
  const observer = useDataTableRenderDiagnostics();
  useLayoutEffect(() => { observer?.commit(layer, id); });
  return null;
}
