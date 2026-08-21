"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { MuiDataTableDensity } from "./types";

/**
 * Value exposed to MUI DataTable presentation components.
 */
export interface DataTableDensityContextValue {
  readonly density: MuiDataTableDensity;

  /**
   * Request a new density.
   *
   * In uncontrolled mode this updates internal state.
   *
   * In controlled mode this only calls onDensityChange and expects the
   * controlling consumer to provide the next `density` value.
   */
  readonly setDensity: (density: MuiDataTableDensity) => void;
}

const DataTableDensityContext = createContext<
  DataTableDensityContextValue | undefined
>(undefined);

export interface DataTableDensityProviderProps {
  readonly children: ReactNode;

  /**
   * Controlled density.
   */
  readonly density?: MuiDataTableDensity;

  /**
   * Initial uncontrolled value.
   */
  readonly defaultDensity?: MuiDataTableDensity;

  readonly onDensityChange?: (density: MuiDataTableDensity) => void;
}

/**
 * MUI-only presentation-state provider.
 *
 * Density does not belong to TanStack's TableState because TanStack
 * does not own this visual concern.
 */
export function DataTableDensityProvider(props: DataTableDensityProviderProps) {
  const {
    children,
    density: controlledDensity,

    defaultDensity = "comfortable",

    onDensityChange,
  } = props;

  const [uncontrolledDensity, setUncontrolledDensity] =
    useState<MuiDataTableDensity>(defaultDensity);

  const isControlled = controlledDensity !== undefined;

  const density = controlledDensity ?? uncontrolledDensity;

  const setDensity = useCallback(
    (nextDensity: MuiDataTableDensity): void => {
      /**
       * In uncontrolled mode we own the value.
       */
      if (!isControlled) {
        setUncontrolledDensity(nextDensity);
      }

      /**
       * In either mode the consumer may observe requested changes.
       */
      onDensityChange?.(nextDensity);
    },
    [isControlled, onDensityChange],
  );

  const contextValue = useMemo<DataTableDensityContextValue>(
    () => ({
      density,
      setDensity,
    }),
    [density, setDensity],
  );

  return (
    <DataTableDensityContext.Provider value={contextValue}>
      {children}
    </DataTableDensityContext.Provider>
  );
}

/**
 * Access the current MUI DataTable density state.
 *
 * Components using this hook must be rendered beneath DataTable.
 */
export function useDataTableDensity(): DataTableDensityContextValue {
  const context = useContext(DataTableDensityContext);

  if (context === undefined) {
    throw new Error(
      "useDataTableDensity must be used within DataTableDensityProvider.",
    );
  }

  return context;
}
