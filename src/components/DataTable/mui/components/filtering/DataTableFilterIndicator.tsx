"use client";

// src/components/DataTable/mui/components/filtering/DataTableFilterIndicator.tsx

import { Box, styled } from "@mui/material";
import type { BoxProps } from "@mui/material";
import clsx from "clsx";
import { FilterAlt } from "@mui/icons-material";
import { DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX } from "../headerLayout";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { DataTableFilterIndicatorProps } from "./types";

const Root = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterIndicator",
  overridesResolver: (_props, styles) => styles.filterIndicator,
})<BoxProps & { ownerState: DataTableFilterIndicatorProps }>(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
  minWidth: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
  maxWidth: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
  height: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
  flex: "0 0 auto",
  color: (theme.vars ?? theme).palette.primary.main,
  "& .MuiSvgIcon-root": {
    fontSize: "inherit",
  },
  fontSize: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
}));

/**
 * Small header indicator showing that a column currently has
 * an active filter.
 *
 * This is intentionally not a button yet.
 *
 * The future column filter/menu trigger will own click behavior.
 */
export function DataTableFilterIndicator(
  props: DataTableFilterIndicatorProps,
) {
  const { active, component = "span", className, sx } = props;

  if (!active) {
    return null;
  }

  return (
    <Root
      ownerState={{ ...props }}
      className={clsx(dataTableClasses.filterIndicator, className)}
      sx={sx}
      component={component}
      aria-hidden="true"
    >
      <FilterAlt />
    </Root>
  );
}
