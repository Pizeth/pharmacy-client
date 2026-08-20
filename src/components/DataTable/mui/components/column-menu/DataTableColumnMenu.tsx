"use client";

import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  FilterAltOutlined,
  FilterAltOffOutlined,
  PushPinOutlined,
  RestartAltOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

export interface DataTableColumnMenuProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;
  readonly anchorEl: HTMLElement | null;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onOpenFilter: (anchorEl: HTMLElement) => void;
}

/**
 * Standard action menu for one leaf column.
 *
 * This component intentionally delegates all table behavior to the
 * feature APIs supplied by TanStack.
 */
export function DataTableColumnMenu<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnMenuProps<TData, TValue>) {
  const { table, column, anchorEl, open, onClose, onOpenFilter } = props;

  return (
    <table.Subscribe
      selector={(state) => ({
        columnFilters: state.columnFilters,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        columnSizing: state.columnSizing,
      })}
    >
      {() => {
        const canFilter = column.getCanFilter();

        const isFiltered = column.getIsFiltered();

        const canPin = column.getCanPin();

        const pinned = column.getIsPinned();

        const canHide = column.getCanHide();

        return (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            MenuListProps={{
              dense: true,

              "aria-label": `Actions for column ${column.id}`,
            }}
          >
            {canFilter && (
              <MenuItem
                onClick={(event) => {
                  /**
                   * Important:
                   *
                   * The menu will be closed before opening the filter
                   * popover, but the actual clicked menu item cannot be
                   * used as the popover anchor because it disappears when
                   * the Menu closes.
                   *
                   * Therefore the parent button supplies the stable anchor.
                   */
                  event.stopPropagation();

                  if (anchorEl) {
                    onClose();

                    onOpenFilter(anchorEl);
                  }
                }}
              >
                <ListItemIcon>
                  <FilterAltOutlined fontSize="small" />
                </ListItemIcon>

                <ListItemText>
                  {isFiltered ? "Edit filter" : "Filter"}
                </ListItemText>
              </MenuItem>
            )}

            {canFilter && isFiltered && (
              <MenuItem
                onClick={() => {
                  column.setFilterValue(undefined);

                  onClose();
                }}
              >
                <ListItemIcon>
                  <FilterAltOffOutlined fontSize="small" />
                </ListItemIcon>

                <ListItemText>Clear filter</ListItemText>
              </MenuItem>
            )}

            {(canFilter || canPin || canHide) && <Divider />}

            {canPin && pinned !== "start" && (
              <MenuItem
                onClick={() => {
                  column.pin("start");

                  onClose();
                }}
              >
                <ListItemIcon>
                  <PushPinOutlined fontSize="small" />
                </ListItemIcon>

                <ListItemText>Pin to start</ListItemText>
              </MenuItem>
            )}

            {canPin && pinned !== "end" && (
              <MenuItem
                onClick={() => {
                  column.pin("end");

                  onClose();
                }}
              >
                <ListItemIcon>
                  <PushPinOutlined fontSize="small" />
                </ListItemIcon>

                <ListItemText>Pin to end</ListItemText>
              </MenuItem>
            )}

            {canPin && pinned !== false && (
              <MenuItem
                onClick={() => {
                  column.pin(false);

                  onClose();
                }}
              >
                <ListItemIcon>
                  <PushPinOutlined
                    fontSize="small"
                    sx={{
                      transform: "rotate(45deg)",
                    }}
                  />
                </ListItemIcon>

                <ListItemText>Unpin</ListItemText>
              </MenuItem>
            )}

            {canHide && (
              <MenuItem
                onClick={() => {
                  column.toggleVisibility(false);

                  onClose();
                }}
              >
                <ListItemIcon>
                  <VisibilityOffOutlined fontSize="small" />
                </ListItemIcon>

                <ListItemText>Hide column</ListItemText>
              </MenuItem>
            )}

            <Divider />

            <MenuItem
              onClick={() => {
                column.resetSize();

                onClose();
              }}
            >
              <ListItemIcon>
                <RestartAltOutlined fontSize="small" />
              </ListItemIcon>

              <ListItemText>Reset width</ListItemText>
            </MenuItem>
          </Menu>
        );
      }}
    </table.Subscribe>
  );
}
