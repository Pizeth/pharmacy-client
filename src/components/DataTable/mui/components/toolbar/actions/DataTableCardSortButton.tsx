"use client";

import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  ClearRounded,
  SortRounded,
} from "@mui/icons-material";
import {
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  styled,
} from "@mui/material";
import type { Breakpoint } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import type { RowData } from "@tanstack/table-core";
import { useState } from "react";
import type { MouseEvent } from "react";

import { useDataTableResolvedDisplayMode } from "../../../presentation";
import {
  DATA_TABLE_COMPONENT_NAME,
  dataTableClasses,
} from "../../../styles";
import type { MuiDataTableInstance } from "../../../table";

const CardSortButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardSortButton",
  overridesResolver: (_props, styles) => styles.cardSortButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export interface DataTableCardSortButtonProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly autoCardBreakpoint?: Breakpoint;
}

/**
 * Sorting surface for card presentation.
 *
 * Table mode keeps sorting on column headers. Card mode has no headers, so this
 * control writes the exact same TanStack sorting state from the toolbar.
 */
export function DataTableCardSortButton<TData extends RowData>(
  props: DataTableCardSortButtonProps<TData>,
) {
  const { table, autoCardBreakpoint } = props;
  const { direction } = useTheme();
  const resolvedDisplayMode =
    useDataTableResolvedDisplayMode(autoCardBreakpoint);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (resolvedDisplayMode !== "card") {
    return null;
  }

  const handleOpen = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        columnVisibility: state.columnVisibility,
      })}
    >
      {({ sorting }) => {
        const sortableColumns = table
          .getVisibleLeafColumns()
          .filter((column) => column.getCanSort());

        if (sortableColumns.length === 0) {
          return null;
        }

        const open = anchorEl !== null;

        return (
          <>
            <Tooltip title="Sort cards">
              <CardSortButtonRoot
                className={dataTableClasses.cardSortButton}
                size="small"
                aria-label="Sort card view"
                aria-haspopup="menu"
                aria-expanded={open ? "true" : undefined}
                onClick={handleOpen}
              >
                <Badge
                  color="primary"
                  badgeContent={sorting.length}
                  invisible={sorting.length === 0}
                  max={99}
                >
                  <SortRounded fontSize="small" />
                </Badge>
              </CardSortButtonRoot>
            </Tooltip>

            <Menu
              dir={direction}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  "aria-label": "Card sorting",
                },
              }}
            >
              {sortableColumns.flatMap((column) => {
                const header = column.columnDef.header;
                const label = typeof header === "string" ? header : column.id;
                const activeSort = sorting.find(
                  (sort) => sort.id === column.id,
                );

                return [
                  <MenuItem
                    key={`${column.id}-asc`}
                    selected={activeSort?.desc === false}
                    onClick={() => {
                      column.toggleSorting(false, false);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <ArrowUpwardRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                      {`Sort by ${label}, ascending`}
                    </ListItemText>
                  </MenuItem>,
                  <MenuItem
                    key={`${column.id}-desc`}
                    selected={activeSort?.desc === true}
                    onClick={() => {
                      column.toggleSorting(true, false);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <ArrowDownwardRounded fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                      {`Sort by ${label}, descending`}
                    </ListItemText>
                  </MenuItem>,
                ];
              })}

              <MenuItem
                disabled={sorting.length === 0}
                onClick={() => {
                  table.setSorting([]);
                  handleClose();
                }}
              >
                <ListItemIcon>
                  <ClearRounded fontSize="small" />
                </ListItemIcon>
                <ListItemText>Clear sorting</ListItemText>
              </MenuItem>
            </Menu>
          </>
        );
      }}
    </table.Subscribe>
  );
}
