// src/components/DataTable/mui/components/toolbar/useDataTableToolbarSearchVisibility.ts

"use client";

import { useCallback, useState } from "react";
import type { DataTableToolbarSearchMode } from "./types";

export interface UseDataTableToolbarSearchVisibilityOptions {
  /**
   * Whether global search is enabled at all.
   */
  readonly enabled: boolean;

  /**
   * Search presentation mode.
   */
  readonly mode: DataTableToolbarSearchMode;

  /**
   * Controlled open state.
   */
  readonly open?: boolean;

  /**
   * Uncontrolled initial open state.
   */
  readonly defaultOpen: boolean;

  /**
   * Change callback.
   */
  readonly onOpenChange?: (open: boolean) => void;
}

export interface DataTableToolbarSearchVisibility {
  /**
   * Whether the global-search input should currently render.
   */
  readonly open: boolean;

  /**
   * Whether a toolbar toggle should be rendered.
   */
  readonly canToggle: boolean;

  readonly setOpen: (open: boolean) => void;

  readonly toggle: () => void;
}

/**
 * Manages only the visibility of the global-search presentation.
 *
 * It does NOT own or modify TanStack globalFilter state.
 *
 * Therefore:
 *
 *   hide search
 *       ≠
 *   clear search
 */
export function useDataTableToolbarSearchVisibility(
  options: UseDataTableToolbarSearchVisibilityOptions,
): DataTableToolbarSearchVisibility {
  const {
    enabled,
    mode,
    open: controlledOpen,
    defaultOpen,
    onOpenChange,
  } = options;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const controlled = controlledOpen !== undefined;

  /**
   * "always" mode ignores collapsible state entirely.
   */
  const open =
    enabled &&
    (mode === "always" ? true : (controlledOpen ?? uncontrolledOpen));

  const canToggle = enabled && mode === "collapsible";

  const setOpen = useCallback(
    (nextOpen: boolean): void => {
      if (!enabled || mode !== "collapsible") {
        return;
      }

      if (!controlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [controlled, enabled, mode, onOpenChange],
  );

  const toggle = useCallback((): void => {
    setOpen(!open);
  }, [open, setOpen]);

  return {
    open,
    canToggle,
    setOpen,
    toggle,
  };
}
