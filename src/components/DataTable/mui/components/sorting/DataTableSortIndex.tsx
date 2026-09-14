"use client";

import { styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX } from "../headerLayout";

export interface DataTableSortIndexProps {
  /** Zero-based TanStack sorting index, displayed as one-based order. */
  readonly index: number;
}

const SortIndexRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortIndex",
  overridesResolver: (_props, styles) => styles.sortIndex,
})(({ theme }) => ({
  ...theme.typography.caption,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX,
  minWidth: DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX,
  maxWidth: DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX,
  height: DATA_TABLE_HEADER_SORT_INDEX_SIZE_PX,
  padding: 0,
  boxSizing: "border-box",
  borderRadius: `calc(${typeof theme.shape.borderRadius === "number" ? `${theme.shape.borderRadius}px` : theme.shape.borderRadius} * 0.75)`,
  fontSize: "0.625rem",
  lineHeight: 1,
  color: (theme.vars ?? theme).palette.text.secondary,
  backgroundColor: (theme.vars ?? theme).palette.action.hover,
  flexShrink: 0,
}));

export function DataTableSortIndex({ index }: DataTableSortIndexProps) {
  return (
    <SortIndexRoot className={dataTableClasses.sortIndex} aria-hidden="true">
      {index + 1}
    </SortIndexRoot>
  );
}
