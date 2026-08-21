"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export interface DataTableFullscreenContextValue {
  readonly fullscreen: boolean;
  readonly setFullscreen: (fullscreen: boolean) => void;
  readonly toggleFullscreen: () => void;
}

const DataTableFullscreenContext = createContext<
  DataTableFullscreenContextValue | undefined
>(undefined);

export interface DataTableFullscreenProviderProps {
  readonly children: ReactNode;
  readonly fullscreen?: boolean;
  readonly defaultFullscreen?: boolean;
  readonly onFullscreenChange?: (fullscreen: boolean) => void;
}

/**
 * Owns DataTable fullscreen presentation state.
 *
 * Fullscreen is deliberately not stored in TanStack TableState
 * because it is a MUI rendering/layout concern.
 */
export function DataTableFullscreenProvider(
  props: DataTableFullscreenProviderProps,
) {
  const {
    children,
    fullscreen: controlledFullscreen,
    defaultFullscreen = false,
    onFullscreenChange,
  } = props;

  const [uncontrolledFullscreen, setUncontrolledFullscreen] =
    useState(defaultFullscreen);

  const isControlled = controlledFullscreen !== undefined;

  const fullscreen = controlledFullscreen ?? uncontrolledFullscreen;

  const setFullscreen = useCallback(
    (nextFullscreen: boolean): void => {
      if (!isControlled) {
        setUncontrolledFullscreen(nextFullscreen);
      }

      onFullscreenChange?.(nextFullscreen);
    },
    [isControlled, onFullscreenChange],
  );

  const toggleFullscreen = useCallback((): void => {
    setFullscreen(!fullscreen);
  }, [fullscreen, setFullscreen]);

  const value = useMemo<DataTableFullscreenContextValue>(
    () => ({
      fullscreen,
      setFullscreen,
      toggleFullscreen,
    }),
    [fullscreen, setFullscreen, toggleFullscreen],
  );

  return (
    <DataTableFullscreenContext.Provider value={value}>
      {children}
    </DataTableFullscreenContext.Provider>
  );
}

export function useDataTableFullscreen(): DataTableFullscreenContextValue {
  const context = useContext(DataTableFullscreenContext);

  if (context === undefined) {
    throw new Error(
      "useDataTableFullscreen must be used within DataTableFullscreenProvider.",
    );
  }

  return context;
}
