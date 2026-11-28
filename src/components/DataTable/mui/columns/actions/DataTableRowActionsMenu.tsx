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
import { resolvePalette } from "@/theme/resolvePalette";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import type { RowData } from "@tanstack/table-core";
import { ROW_ACTION_BUTTON_SIZE, ROW_ACTION_ICON_SIZE } from "./rowActionStyles";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { ResolvedDataTableRowAction } from "./resolvedTypes";

const MenuButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,

  slot: "RowActionsMenuButton",

  overridesResolver: (_props, styles) => styles.rowActionsMenuButton,
})(({ theme }) => ({
  flexShrink: 0, // Match the inline action buttons.
  width: ROW_ACTION_BUTTON_SIZE,
  height: ROW_ACTION_BUTTON_SIZE,
  padding: 2,
  "& .MuiSvgIcon-root": { fontSize: ROW_ACTION_ICON_SIZE },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const GlassMenu = styled(Menu)(({ theme }) => {
  const { palette } = theme.vars ?? theme;
  return {
    "&& .MuiMenu-paper": {
      backgroundColor: theme.alpha(palette.background.paper, 0.58),
      backgroundImage: "none",
      backdropFilter: "blur(20px) saturate(180%)",
      border: `1px solid ${theme.alpha(palette.divider, 0.15)}`,
      "& .MuiMenu-list": { backgroundColor: "transparent" },
    },
  };
});

const MenuShortcut = styled("kbd")(({ theme }) => ({
  marginInlineStart: theme.spacing(2),
  paddingInline: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  ...theme.typography.caption,
  fontWeight: theme.typography.fontWeightMedium,
  color: resolvePalette(theme).text.primary,
  backgroundColor: resolvePalette(theme).background.paper,
  whiteSpace: "nowrap",
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

  const row = actions[0]?.context.row;
  const disabled = !row?.getIsSelected();
  const open = !disabled && anchorEl !== null;

  const handleOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  if (!row) {
    return null;
  }

  const rowId = row.id;

  return (
    <>
      <Tooltip title={disabled ? "Select this row to use more actions" : "More actions"}>
        <span onClick={(event) => { event.stopPropagation(); }}>
          <MenuButtonRoot
            className={dataTableClasses.rowActionsMenuButton}
            size="small"
            disabled={disabled}
            aria-label={`More actions for row ${rowId}`}
            aria-haspopup="menu"
            aria-expanded={open ? "true" : undefined}
            onClick={handleOpen}
          >
            <MoreVert fontSize="small" />
          </MenuButtonRoot>
        </span>
      </Tooltip>

      <GlassMenu
        onClick={event => { event.stopPropagation(); }}
        dir={direction}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: direction === "rtl" ? "left" : "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: direction === "rtl" ? "left" : "right", vertical: "top" }}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            dense: true,
            "aria-label": `Actions for row ${rowId}`,
            onKeyDown: (event: KeyboardEvent<HTMLUListElement>) => {
              if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
              const action = actions.find(({ definition, disabled }) =>
                !disabled && definition.menuShortcutKey?.toLowerCase() === event.key.toLowerCase());
              if (!action) return;
              event.preventDefault();
              event.stopPropagation();
              handleClose();
              action.definition.onClick(action.context);
            },
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
              aria-keyshortcuts={definition.menuShortcutKey}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                if (disabled) {
                  return;
                }

                handleClose();

                definition.onClick(context);
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
              {definition.menuShortcutKey && <MenuShortcut aria-hidden="true">{definition.menuShortcutKey}</MenuShortcut>}
            </MenuItemRoot>
          );
        })}
      </GlassMenu>
    </>
  );
}
