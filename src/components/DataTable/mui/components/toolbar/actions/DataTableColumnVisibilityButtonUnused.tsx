"use client";

import {
  Checkbox,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { ViewColumnOutlined } from "@mui/icons-material";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../../table";

export interface DataTableColumnVisibilityButtonProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Show/hide-column control.
 *
 * TanStack remains the authority for:
 *
 * - whether a column can hide
 * - current visibility
 * - updating visibility
 */
export function DataTableColumnVisibilityButton<TData extends RowData>(
  props: DataTableColumnVisibilityButtonProps<TData>,
) {
  const { table } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = anchorEl !== null;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Show / hide columns">
        <IconButton
          size="small"
          aria-label="Show or hide columns"
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
        >
          <ViewColumnOutlined fontSize="small" />
        </IconButton>
      </Tooltip>

      <table.Subscribe source={table.atoms.columnVisibility}>
        {() => {
          const columns = table
            .getAllLeafColumns()
            .filter((column) => column.getCanHide());

          return (
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                dense: true,

                "aria-label": "Visible table columns",
              }}
            >
              {columns.map((column) => {
                const visible = column.getIsVisible();

                return (
                  <MenuItem
                    key={column.id}
                    onClick={() => {
                      column.toggleVisibility();
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={visible}
                      tabIndex={-1}
                      disableRipple
                    />

                    <ListItemText primary={column.id} />
                  </MenuItem>
                );
              })}
            </Menu>
          );
        }}
      </table.Subscribe>
    </>
  );
}
