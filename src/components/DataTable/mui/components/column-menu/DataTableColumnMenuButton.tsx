"use client";

import { IconButton, Tooltip, styled } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState, type MouseEvent } from "react";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnFilterPopover } from "./DataTableColumnFilterPopover";
import { DataTableColumnMenu } from "./DataTableColumnMenu";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

const ColumnMenuButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ColumnMenuButton",
  overridesResolver: (_props, styles) => styles.columnMenuButton,
})(({ theme }) => ({
  flexShrink: 0,
  width: 28,
  height: 28,
  opacity: 0.3,
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
  '&[aria-expanded="true"], &:focus-visible, &.Mui-focusVisible': {
    opacity: 1,
  },
  [`.${dataTableClasses.headerContent}:hover &, .${dataTableClasses.headerContent}:focus-within &`]:
    { opacity: 1 },
  [`.${dataTableClasses.headerActions}[data-align="center"] &`]: {
    width: 20,
    height: 20,
    minWidth: 20,
    padding: 0,
    margin: 0,
    flex: "0 0 20px",
  },
  [`.${dataTableClasses.headerActions}[data-align="center"] & .MuiSvgIcon-root`]:
    { fontSize: 18, marginInline: "4px" },
}));

export interface DataTableColumnMenuButtonProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;
}

/**
 * Owns the ephemeral UI state for one column menu:
 *
 * - menu open/closed
 * - menu anchor
 * - filter popover open/closed
 * - filter popover anchor
 *
 * It does NOT own any table state.
 */
export function DataTableColumnMenuButton<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnMenuButtonProps<TData, TValue>) {
  const { table, column } = props;

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const menuOpen = menuAnchorEl !== null;

  const filterOpen = filterAnchorEl !== null;

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (): void => {
    setMenuAnchorEl(null);
  };

  const handleOpenFilter = (anchor: HTMLElement): void => {
    setFilterAnchorEl(anchor);
  };

  const handleCloseFilter = (): void => {
    setFilterAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Column options">
        <ColumnMenuButtonRoot
          className={dataTableClasses.columnMenuButton}
          size="small"
          aria-label={`Open options for column ${column.id}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen ? "true" : undefined}
          onClick={handleOpenMenu}
        >
          <MoreVert fontSize="small" />
        </ColumnMenuButtonRoot>
      </Tooltip>

      <DataTableColumnMenu
        table={table}
        column={column}
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        onOpenFilter={handleOpenFilter}
      />

      <DataTableColumnFilterPopover
        table={table}
        column={column}
        anchorEl={filterAnchorEl}
        open={filterOpen}
        onClose={handleCloseFilter}
      />
    </>
  );
}
