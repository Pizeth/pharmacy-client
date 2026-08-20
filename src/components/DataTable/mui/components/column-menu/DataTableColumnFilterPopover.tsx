"use client";

import {
  Box,
  Button,
  Divider,
  Popover,
  Stack,
  Typography,
} from "@mui/material";

import type { PopoverProps } from "@mui/material";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnFilter } from "../filtering";

export interface DataTableColumnFilterPopoverProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;
  readonly anchorEl: HTMLElement | null;
  readonly open: boolean;
  readonly onClose: () => void;
}

/**
 * Popover containing the actual filter editor for one column.
 *
 * The filter value itself remains completely owned by TanStack.
 *
 * Local React state here is only UI state:
 *
 * - whether this popover is open
 * - where it is anchored
 */
export function DataTableColumnFilterPopover<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnFilterPopoverProps<TData, TValue>) {
  const { table, column, anchorEl, open, onClose } = props;

  const meta = column.columnDef.meta;

  const label = meta?.filterLabel ?? column.id;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      slotProps={{
        paper: {
          sx: {
            width: 320,
            maxWidth: "calc(100vw - 32px)",
          },
        },
      }}
    >
      {/**
       * Subscribe only to the column-filter state.
       *
       * The editor itself uses column.getFilterValue(), therefore the
       * value must be read from inside this reactive boundary.
       */}
      <table.Subscribe source={table.atoms.columnFilters}>
        {() => {
          const isFiltered = column.getIsFiltered();

          return (
            <Box
              sx={{
                p: 2,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="subtitle2" component="h3">
                  Filter {label}
                </Typography>

                <DataTableColumnFilter column={column} />

                <Divider />

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    size="small"
                    disabled={!isFiltered}
                    onClick={() => {
                      column.setFilterValue(undefined);
                    }}
                  >
                    Clear
                  </Button>

                  <Button size="small" variant="contained" onClick={onClose}>
                    Done
                  </Button>
                </Stack>
              </Stack>
            </Box>
          );
        }}
      </table.Subscribe>
    </Popover>
  );
}
