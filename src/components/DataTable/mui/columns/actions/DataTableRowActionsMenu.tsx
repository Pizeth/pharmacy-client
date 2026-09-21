"use client";

import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { RowData } from "@tanstack/table-core";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { ResolvedDataTableRowAction } from "./resolvedTypes";

const MenuButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,

  slot: "RowActionsMenuButton",

  overridesResolver: (_props, styles) => styles.rowActionsMenuButton,
})(({ theme }) => ({
  width: 28,
  height: 28,
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const MenuItemRoot = styled(MenuItem, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "RowActionsMenuItem",
  overridesResolver: (_props, styles) => styles.rowActionsMenuItem,
})(({ theme }) => ({
  '&[data-color="error"]': {
    color: theme.palette.error.main,
  },
}));

const MenuItemIconRoot = styled(ListItemIcon, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "RowActionsMenuItemIcon",
  overridesResolver: (_props, styles) => styles.rowActionsMenuItemIcon,
})(({ theme }) => ({
  '[data-color="error"] &': {
    color: theme.palette.error.main,
  },
}));

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

  const { direction } = useTheme();

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

  const rowId = actions[0].context.row.id;

  return (
    <>
      <Tooltip title="More actions">
        <MenuButtonRoot
          className={dataTableClasses.rowActionsMenuButton}
          size="small"
          aria-label={`More actions for row ${rowId}`}
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
          sx={{
            width: 28,
            height: 28,

            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}
        >
          <MoreVert fontSize="small" />
        </MenuButtonRoot>
      </Tooltip>

      <Menu
        dir={direction}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            dense: true,
            "aria-label": `Actions for row ${rowId}`,
          },
        }}
      >
        {actions.map((action) => {
          const { definition, context, icon, disabled, color } = action;

          return (
            <MenuItemRoot
              key={definition.id}
              className={dataTableClasses.rowActionsMenuItem}
              data-color={color === "error" ? "error" : undefined}
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
                <MenuItemIconRoot
                  className={dataTableClasses.rowActionsMenuItemIcon}
                >
                  {icon}
                </MenuItemIconRoot>
              )}

              <ListItemText>{definition.label}</ListItemText>
            </MenuItemRoot>
          );
        })}
      </Menu>
    </>
  );
}
