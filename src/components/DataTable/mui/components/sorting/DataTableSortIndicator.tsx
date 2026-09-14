"use client";

import { IconButton, SvgIcon, styled } from "@mui/material";
import { ArrowDownward, SyncAlt } from "@mui/icons-material";
import type { MouseEvent } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { DataTableSortDirection } from "./DataTableSortLabel";
import { DataTableSortIndex } from "./DataTableSortIndex";

export interface DataTableSortIndicatorProps {
  readonly direction: DataTableSortDirection;
  readonly sortIndex?: number;
  readonly showSortIndex?: boolean;
  readonly onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const SortIndicatorRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortIndicator",
  overridesResolver: (_props, styles) => styles.sortIndicator,
})(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(0.25),
  flex: "0 0 auto",
}));

const SortButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortButton",
  overridesResolver: (_props, styles) => styles.sortButton,
})(({ theme }) => ({
  minWidth: 18,
  width: "3ch",
  height: 20,
  padding: 0,
  margin: 0,
  color: (theme.vars ?? theme).palette.text.secondary,
  opacity: 0.35,
  transition: theme.transitions.create(["opacity", "color"], {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover": { opacity: 1, color: (theme.vars ?? theme).palette.text.primary },
  '&[data-active="true"]': {
    opacity: 1,
    color: (theme.vars ?? theme).palette.primary.main,
  },

  [`.${dataTableClasses.headerActions}[data-align="center"] &`]: {
    width: 20,
    height: 20,
    minWidth: 20,
    padding: 0,
    margin: 0,
    flex: "0 0 20px",
  },
})) as typeof IconButton;

const SortIconRoot = styled(SvgIcon, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortIcon",
  overridesResolver: (_props, styles) => styles.sortIcon,
})<{ component: typeof ArrowDownward }>(({ theme }) => ({
  fontSize: "18px",
  [`.${dataTableClasses.headerActions}[data-align="center"] &`]: {
    marginInline: "4px",
  },
  transform: "rotate(-90deg)",
  '&[data-direction="asc"]': { transform: "rotate(180deg)" },
  '&[data-direction="desc"]': { transform: "none" },
  '&:not([data-direction="none"])': {
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

/** Visual sorting affordance, outside the centered label track. */
export function DataTableSortIndicator({
  direction,
  sortIndex,
  showSortIndex = false,
  onClick,
}: DataTableSortIndicatorProps) {
  const active = direction !== false;
  return (
    <SortIndicatorRoot className={dataTableClasses.sortIndicator}>
      <SortButtonRoot
        component="span"
        className={dataTableClasses.sortButton}
        data-active={active}
        size="small"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClick}
      >
        <SortIconRoot
          component={active ? ArrowDownward : SyncAlt}
          className={dataTableClasses.sortIcon}
          data-direction={direction || "none"}
        />
      </SortButtonRoot>
      {showSortIndex && active && sortIndex !== undefined && (
        <DataTableSortIndex index={sortIndex} />
      )}
    </SortIndicatorRoot>
  );
}
