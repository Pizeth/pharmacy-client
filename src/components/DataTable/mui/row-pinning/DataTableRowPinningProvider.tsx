"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import {
  DATA_TABLE_DEFAULT_ROW_PINNING_DISPLAY_MODE,
  type DataTableRowPinningDisplayMode,
} from "./types";

/**
 * Renderer-local row-pinning presentation context.
 *
 * TanStack continues to own:
 *
 * - rowPinning state
 * - row.pin(...)
 * - table.setRowPinning(...)
 * - top/center/bottom row partitioning
 *
 * This context carries only the MUI interaction/presentation policy so
 * generic controls such as the selection checkbox can implement the
 * selected-row pinning modes without moving renderer configuration into
 * TanStack table options or resource code.
 */
const DataTableRowPinningDisplayContext =
  createContext<DataTableRowPinningDisplayMode>(
    DATA_TABLE_DEFAULT_ROW_PINNING_DISPLAY_MODE,
  );

export interface DataTableRowPinningProviderProps {
  readonly displayMode: DataTableRowPinningDisplayMode;
  readonly children: ReactNode;
}

/**
 * Install the resolved DataTable row-pinning display mode for renderer
 * descendants.
 *
 * Keeping this provider inside <DataTable> means resources still declare:
 *
 *   rowPinning={{ displayMode: "select-sticky" }}
 *
 * while generic selection controls can coordinate the corresponding TanStack
 * row.pin()/setRowPinning() calls.
 */
export function DataTableRowPinningProvider(
  props: DataTableRowPinningProviderProps,
) {
  const { displayMode, children } = props;

  return (
    <DataTableRowPinningDisplayContext.Provider value={displayMode}>
      {children}
    </DataTableRowPinningDisplayContext.Provider>
  );
}

/**
 * Read the renderer's resolved row-pinning display mode.
 *
 * The context has the built-in "sticky" default so focused component tests
 * that render a utility control outside the complete DataTable shell remain
 * valid without manufacturing renderer state.
 */
export function useDataTableRowPinningDisplayMode(): DataTableRowPinningDisplayMode {
  return useContext(DataTableRowPinningDisplayContext);
}
