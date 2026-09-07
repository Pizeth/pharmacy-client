"use client";

// src/components/DataTable/mui/components/sorting/DataTableSortIndex.tsx

import { Box } from "@mui/material";
import { DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX } from "../headerLayout";

export interface DataTableSortIndexProps {
  /**
   * Zero-based TanStack sorting index.
   *
   * The component renders it as one-based human-readable order.
   */
  readonly index: number;
}

/**
 * Small visual indicator showing this column's position in a
 * multi-column sort.
 *
 * Example:
 *
 *   Name ↑ 1
 *   Age  ↓ 2
 */
export function DataTableSortIndex(props: DataTableSortIndexProps) {
  const { index } = props;

  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX}px`,
        minWidth: `${DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX}px`,
        maxWidth: `${DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX}px`,
        height: `${DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX}px`,
        p: 0,
        boxSizing: "border-box",
        borderRadius: 0.75,
        typography: "caption",
        fontSize: "0.625rem",
        lineHeight: 1,
        color: "text.secondary",
        backgroundColor: "action.hover",
        flexShrink: 0,
      }}
    >
      {index + 1}
    </Box>
  );
}
