"use client";

import {
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { Breakpoint } from "@mui/material/styles";

import { useDataTableDisplayMode } from "./DataTableDisplayModeProvider";
import type { DataTableDisplayMode } from "./types";

export type ResolvedDataTableDisplayMode = Exclude<
  DataTableDisplayMode,
  "auto"
>;

export const DATA_TABLE_DEFAULT_AUTO_CARD_BREAKPOINT: Breakpoint = "sm";

/**
 * Resolve requested presentation mode into the physical renderer.
 *
 * This hook reads viewport presentation state only. It has no access to:
 *
 * - pagination,
 * - sorting,
 * - filters/search,
 * - selection,
 * - expansion,
 * - resource adapters,
 * - network execution.
 *
 * A viewport transition therefore changes only the renderer consuming the
 * already-existing table instance.
 */
export function useDataTableResolvedDisplayMode(
  autoCardBreakpoint: Breakpoint =
    DATA_TABLE_DEFAULT_AUTO_CARD_BREAKPOINT,
): ResolvedDataTableDisplayMode {
  const theme = useTheme();

  const { displayMode } = useDataTableDisplayMode();

  const matchesCardBreakpoint = useMediaQuery(
    theme.breakpoints.down(autoCardBreakpoint),
  );

  if (displayMode === "auto") {
    return matchesCardBreakpoint ? "card" : "table";
  }

  return displayMode;
}
