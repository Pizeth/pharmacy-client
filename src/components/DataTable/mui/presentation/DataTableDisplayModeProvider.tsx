"use client";

// src/components/DataTable/mui/presentation/DataTableDisplayModeProvider.tsx

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import type {
  DataTableDisplayMode,
  DataTableDisplayModeConfig,
} from "./types";

export interface DataTableDisplayModeContextValue {
  /**
   * Requested presentation mode.
   *
   * "auto" remains unresolved here. A responsive resolver belongs to 1.9.4.
   */
  readonly displayMode: DataTableDisplayMode;

  /**
   * Request another presentation mode.
   *
   * This is presentation state only. It has no access to TanStack query state
   * or any server/data-source adapter.
   */
  readonly setDisplayMode: (mode: DataTableDisplayMode) => void;
}

const DataTableDisplayModeContext = createContext<
  DataTableDisplayModeContextValue | undefined
>(undefined);

export interface DataTableDisplayModeProviderProps
  extends DataTableDisplayModeConfig {
  readonly children: ReactNode;
}

/**
 * Controlled/uncontrolled owner for DataTable presentation mode.
 *
 * This provider deliberately sits outside:
 *
 * - DataTableServerQueryState
 * - TanStack table state
 * - transport adapters
 * - resource controllers
 *
 * The same table/query controller can therefore feed either renderer without a
 * second request lifecycle.
 */
export function DataTableDisplayModeProvider(
  props: DataTableDisplayModeProviderProps,
) {
  const {
    children,
    displayMode: controlledDisplayMode,
    defaultDisplayMode = "table",
    onDisplayModeChange,
  } = props;

  const [uncontrolledDisplayMode, setUncontrolledDisplayMode] =
    useState<DataTableDisplayMode>(defaultDisplayMode);

  const isControlled = controlledDisplayMode !== undefined;

  const displayMode =
    controlledDisplayMode ?? uncontrolledDisplayMode;

  const setDisplayMode = useCallback(
    (nextMode: DataTableDisplayMode): void => {
      if (!isControlled) {
        setUncontrolledDisplayMode(nextMode);
      }

      onDisplayModeChange?.(nextMode);
    },
    [isControlled, onDisplayModeChange],
  );

  const value = useMemo<DataTableDisplayModeContextValue>(
    () => ({
      displayMode,
      setDisplayMode,
    }),
    [displayMode, setDisplayMode],
  );

  return (
    <DataTableDisplayModeContext.Provider value={value}>
      {children}
    </DataTableDisplayModeContext.Provider>
  );
}

/**
 * Optional reader for lower-level presentation components and isolated tests.
 */
export function useOptionalDataTableDisplayMode():
  | DataTableDisplayModeContextValue
  | undefined {
  return useContext(DataTableDisplayModeContext);
}

/**
 * Strict reader for components that require the presentation-mode contract.
 */
export function useDataTableDisplayMode(): DataTableDisplayModeContextValue {
  const context = useOptionalDataTableDisplayMode();

  if (context === undefined) {
    throw new Error(
      "useDataTableDisplayMode must be used within DataTableDisplayModeProvider.",
    );
  }

  return context;
}
