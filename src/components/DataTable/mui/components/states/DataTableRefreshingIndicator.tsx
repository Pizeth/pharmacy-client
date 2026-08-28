// src/components/DataTable/mui/components/states/DataTableRefreshingIndicator.tsx

"use client";

import { LinearProgress } from "@mui/material";

import { useDataTableRefreshingProgress } from "./useDataTableRefreshingProgress";

export interface DataTableRefreshingIndicatorProps {
  /**
   * Whether background/server refreshing is active.
   */
  readonly refreshing: boolean;

  /**
   * Optional REAL request progress.
   *
   * Range:
   *
   *   0 .. 100
   *
   * When omitted, DataTable uses its simulated trickle behavior.
   */
  readonly progress?: number;
}

/**
 * Non-blocking top progress indicator for server/background refreshes.
 *
 * This intentionally behaves more like YouTube/NProgress than a
 * traditional indeterminate LinearProgress:
 *
 *   start quickly
 *   ↓
 *   progressively slow down
 *   ↓
 *   never fake 100%
 *   ↓
 *   actual refresh completes
 *   ↓
 *   finish at 100%
 *   ↓
 *   disappear
 *
 * When actual request progress is available, the same component
 * becomes a true determinate indicator.
 *
 * Unlike the full loading state, this does not replace existing table
 * rows.
 */
export function DataTableRefreshingIndicator(
  props: DataTableRefreshingIndicatorProps,
) {
  const { refreshing, progress } = props;

  const { visible, value, determinate } = useDataTableRefreshingProgress({
    refreshing,
    progress,
  });

  return (
    <LinearProgress
      variant="determinate"
      value={value}
      aria-label={determinate ? "Loading table data" : "Refreshing table data"}
      aria-hidden={!visible}
      aria-valuetext={
        visible
          ? determinate
            ? `${Math.round(value)}% loaded`
            : "Refreshing table data"
          : undefined
      }
      sx={{
        /**
         * Reserve a stable 2px slot starting/stopping a refresh never
         * shifts the table layout.
         */
        height: 2,
        flexShrink: 0,
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",

        transition: (theme) =>
          theme.transitions.create("opacity", {
            duration: theme.transitions.duration.shortest,
          }),

        /**
         * MUI's determinate bar already uses a transform internally.
         *
         * Making that transform slightly smoother gives us the
         * YouTube/NProgress-style trickle effect instead of abrupt
         * percentage jumps.
         */
        "& .MuiLinearProgress-bar": {
          transition: "transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
    />
  );
}
