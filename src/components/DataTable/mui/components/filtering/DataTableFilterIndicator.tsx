"use client";

import { Box } from "@mui/material";
import { FilterAlt } from "@mui/icons-material";

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
        flexShrink: 0,
        color: "primary.main",
      }}
    >
      <FilterAlt
        sx={{
          fontSize: 16,
        }}
      />
    </Box>
  );
}
