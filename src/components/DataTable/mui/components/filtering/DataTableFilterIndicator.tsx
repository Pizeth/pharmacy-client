"use client";

// src/components/DataTable/mui/components/filtering/DataTableFilterIndicator.tsx

import { Box } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";
import { DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX } from "../headerLayout";

export interface DataTableFilterIndicatorProps {
  readonly active: boolean;
}

/**
 * Small header indicator showing that a column currently has
 * an active filter.
 *
 * This is intentionally not a button yet.
 *
 * The future column filter/menu trigger will own click behavior.
 */
export function DataTableFilterIndicator(props: DataTableFilterIndicatorProps) {
  const { active } = props;

  if (!active) {
    return null;
  }

  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
        minWidth: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
        maxWidth: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
        height: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
        flex: "0 0 auto",
        // flexShrink: 0,
        color: "primary.main",
      }}
    >
      <FilterAlt
        sx={{
          fontSize: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
        }}
      />
    </Box>
  );
}
