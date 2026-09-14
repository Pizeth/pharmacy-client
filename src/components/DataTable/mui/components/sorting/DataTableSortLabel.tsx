"use client";

import { ButtonBase, styled } from "@mui/material";
import type { MouseEvent, ReactNode } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

export type DataTableSortDirection = "asc" | "desc" | false;

export interface DataTableSortLabelProps {
  readonly children: ReactNode;
  readonly direction: DataTableSortDirection;
  readonly canSort: boolean;
  /** Compatibility props: the separate indicator owns the badge. */
  readonly sortIndex?: number;
  readonly showSortIndex?: boolean;
  readonly onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const HeaderLabelRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderLabel",
  overridesResolver: (_props, styles) => styles.headerLabel,
})({
  display: "block",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 600,
  lineHeight: 1.25,
});

const SortLabelRoot = styled(ButtonBase, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SortLabel",
  overridesResolver: (_props, styles) => styles.sortLabel,
})(({ theme }) => ({
  display: "inline-flex",
  minWidth: 0,
  maxWidth: "100%",
  color: "inherit",
  borderRadius: `calc(${typeof theme.shape.borderRadius === "number" ? `${theme.shape.borderRadius}px` : theme.shape.borderRadius} * 0.5)`,
  padding: 0,
  "&:hover": { color: (theme.vars ?? theme).palette.text.primary },
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
})) as typeof ButtonBase;

/** Only the label participates in the centered track's intrinsic width. */
export function DataTableSortLabel({
  children,
  direction,
  canSort,
  onClick,
}: DataTableSortLabelProps) {
  const label = (
    <HeaderLabelRoot className={dataTableClasses.headerLabel}>
      {children}
    </HeaderLabelRoot>
  );
  if (!canSort) return label;
  return (
    <SortLabelRoot
      component="span"
      className={dataTableClasses.sortLabel}
      data-direction={direction || "none"}
      onClick={onClick}
      aria-pressed={direction !== false ? true : undefined}
    >
      {label}
    </SortLabelRoot>
  );
}
