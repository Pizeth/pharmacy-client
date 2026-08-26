// src/components/DataTable/mui/filter-display/DataTableFilterDisplayProvider.tsx

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { MuiDataTableColumnFilterDisplayMode } from "./types";

export interface DataTableFilterDisplayContextValue {
  readonly columnFilterDisplayMode: MuiDataTableColumnFilterDisplayMode;
  readonly setColumnFilterDisplayMode: (
    mode: MuiDataTableColumnFilterDisplayMode,
  ) => void;
  readonly showColumnFilters: boolean;
  readonly setShowColumnFilters: (show: boolean) => void;
  readonly toggleColumnFilters: () => void;
}

const DataTableFilterDisplayContext = createContext<
  DataTableFilterDisplayContextValue | undefined
>(undefined);

export interface DataTableFilterDisplayProviderProps {
  readonly children: ReactNode;
  readonly columnFilterDisplayMode?: MuiDataTableColumnFilterDisplayMode;
  readonly defaultColumnFilterDisplayMode?: MuiDataTableColumnFilterDisplayMode;
  readonly onColumnFilterDisplayModeChange?: (
    mode: MuiDataTableColumnFilterDisplayMode,
  ) => void;
  readonly showColumnFilters?: boolean;
  readonly defaultShowColumnFilters?: boolean;
  readonly onShowColumnFiltersChange?: (show: boolean) => void;
}

/**
 * Owns filtering presentation state only.
 *
 * TanStack continues to own actual filter values through:
 *
 *   state.columnFilters
 */
export function DataTableFilterDisplayProvider(
  props: DataTableFilterDisplayProviderProps,
) {
  const {
    children,
    columnFilterDisplayMode: controlledDisplayMode,
    defaultColumnFilterDisplayMode = "popover",
    onColumnFilterDisplayModeChange,
    showColumnFilters: controlledShowColumnFilters,
    defaultShowColumnFilters = false,
    onShowColumnFiltersChange,
  } = props;

  const [uncontrolledDisplayMode, setUncontrolledDisplayMode] =
    useState<MuiDataTableColumnFilterDisplayMode>(
      defaultColumnFilterDisplayMode,
    );

  const [uncontrolledShowColumnFilters, setUncontrolledShowColumnFilters] =
    useState(defaultShowColumnFilters);

  const displayModeControlled = controlledDisplayMode !== undefined;

  const showColumnFiltersControlled = controlledShowColumnFilters !== undefined;

  const columnFilterDisplayMode =
    controlledDisplayMode ?? uncontrolledDisplayMode;

  const showColumnFilters =
    controlledShowColumnFilters ?? uncontrolledShowColumnFilters;

  const setColumnFilterDisplayMode = useCallback(
    (nextMode: MuiDataTableColumnFilterDisplayMode): void => {
      if (!displayModeControlled) {
        setUncontrolledDisplayMode(nextMode);
      }

      onColumnFilterDisplayModeChange?.(nextMode);
    },
    [displayModeControlled, onColumnFilterDisplayModeChange],
  );

  const setShowColumnFilters = useCallback(
    (nextShow: boolean): void => {
      if (!showColumnFiltersControlled) {
        setUncontrolledShowColumnFilters(nextShow);
      }

      onShowColumnFiltersChange?.(nextShow);
    },
    [showColumnFiltersControlled, onShowColumnFiltersChange],
  );

  const toggleColumnFilters = useCallback((): void => {
    setShowColumnFilters(!showColumnFilters);
  }, [setShowColumnFilters, showColumnFilters]);

  const value = useMemo<DataTableFilterDisplayContextValue>(
    () => ({
      columnFilterDisplayMode,
      setColumnFilterDisplayMode,

      showColumnFilters,
      setShowColumnFilters,
      toggleColumnFilters,
    }),
    [
      columnFilterDisplayMode,
      setColumnFilterDisplayMode,

      showColumnFilters,
      setShowColumnFilters,
      toggleColumnFilters,
    ],
  );

  return (
    <DataTableFilterDisplayContext.Provider value={value}>
      {children}
    </DataTableFilterDisplayContext.Provider>
  );
}

export function useDataTableFilterDisplay(): DataTableFilterDisplayContextValue {
  const context = useContext(DataTableFilterDisplayContext);

  if (context === undefined) {
    throw new Error(
      "useDataTableFilterDisplay must be used within DataTableFilterDisplayProvider.",
    );
  }

  return context;
}
