"use client";

import { Box, TableSortLabel } from "@mui/material";
import type { ReactNode } from "react";
import { DataTableSortIndex } from "./DataTableSortIndex";

export type DataTableSortDirection = "asc" | "desc" | false;

export interface DataTableSortLabelProps {
  /**
   * Rendered header label.
   */
  readonly children: ReactNode;

  /**
   * Current TanStack sorting direction.
   */
  readonly direction: DataTableSortDirection;

  /**
   * Whether the column is allowed to sort.
   */
  readonly canSort: boolean;

  /**
   * Zero-based sort position when multiple columns participate
   * in sorting.
   */
  readonly sortIndex?: number;

  /**
   * Whether to render the multi-sort order indicator.
   */
  readonly showSortIndex?: boolean;

  /**
   * Handler supplied by TanStack.
   */
  readonly onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Standard visual sort control for DataTable headers.
 *
 * This component owns only MUI presentation.
 *
 * TanStack remains responsible for:
 *
 * - current sorting state
 * - ascending/descending transitions
 * - sorting removal
 * - multi-sort behavior
 * - modifier-key interpretation
 */
export function DataTableSortLabel(props: DataTableSortLabelProps) {
  const {
    children,
    direction,
    canSort,
    sortIndex,
    showSortIndex = true,
    onClick,
  } = props;

  /**
   * MUI TableSortLabel expects a direction even while inactive.
   *
   * The direction is visually relevant only when active=true.
   */
  const muiDirection = direction === "desc" ? "desc" : "asc";

  const active = direction !== false;

  if (!canSort) {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        minWidth: 0,
      }}
    >
      <TableSortLabel
        active={active}
        direction={muiDirection}
        hideSortIcon={!active}
        onClick={onClick}
        sx={{
          minWidth: 0,
          "& .MuiTableSortLabel-icon": {
            flexShrink: 0,
          },
        }}
      >
        {children}
      </TableSortLabel>

      {showSortIndex && active && sortIndex !== undefined && (
        <DataTableSortIndex index={sortIndex} />
      )}
    </Box>
  );
}
