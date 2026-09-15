// src/components/DataTable/mui/components/states/DataTableRefreshingIndicator.tsx

"use client";

import { LinearProgress, styled } from "@mui/material";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { useDataTableRefreshingProgress } from "./useDataTableRefreshingProgress";

const RefreshingIndicatorRoot = styled(LinearProgress, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "RefreshingIndicator",
  overridesResolver: (_props, styles) => styles.refreshingIndicator,
})(({ theme }) => ({
  height: 2,
  flexShrink: 0,
  opacity: 1,
  visibility: "visible",
  '&[aria-hidden="true"]': { opacity: 0, visibility: "hidden" },
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
  "& .MuiLinearProgress-bar": {
    transition: "transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
}));

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
    <RefreshingIndicatorRoot
      className={dataTableClasses.refreshingIndicator}
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
    />
  );
}
