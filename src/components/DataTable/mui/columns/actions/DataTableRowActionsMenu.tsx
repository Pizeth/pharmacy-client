"use client";

import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { RowData } from "@tanstack/table-core";
import type { ResolvedDataTableRowAction } from "./resolvedTypes";

export interface DataTableRowActionsMenuProps<TData extends RowData> {
  readonly actions: readonly ResolvedDataTableRowAction<TData>[];
}

/**
 * Overflow menu for row actions which are not rendered inline.
 */
export function DataTableRowActionsMenu<TData extends RowData>(
  props: DataTableRowActionsMenuProps<TData>,
) {
  const { actions } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = anchorEl !== null;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      <Tooltip title="More actions">
        <IconButton
          size="small"
          aria-label="More row actions"
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
          sx={{
            width: 28,

            height: 28,
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          dense: true,

          "aria-label": "Row actions",
        }}
      >
        {actions.map((action) => {
          const { definition, context, icon, disabled, color } = action;

          return (
            <MenuItem
              key={definition.id}
              disabled={disabled}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                if (disabled) {
                  return;
                }

                handleClose();

                definition.onClick(context);
              }}
              sx={{
                color: color === "error" ? "error.main" : undefined,
              }}
            >
              {icon !== null && (
                <ListItemIcon
                  sx={{
                    color: color === "error" ? "error.main" : undefined,
                  }}
                >
                  {icon}
                </ListItemIcon>
              )}

              <ListItemText>{definition.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
