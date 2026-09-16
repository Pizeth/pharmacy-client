"use client";

import {
  Box,
  Button,
  Divider,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useId } from "react";
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
 * Local React state here is only presentation state:
 *
 * - whether this popover is open
 * - where it is anchored
 *
 * ------------------------------------------------------------------
 * RTL
 * ------------------------------------------------------------------
 *
 * Popover is portaled outside the DataTable root. It therefore cannot
 * inherit:
 *
 *   <RazethDataTableRoot dir="rtl">
 *
 * through the DOM.
 *
 * Explicitly pass the active MUI theme direction to the Popover.
 */
export function DataTableColumnFilterPopover<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnFilterPopoverProps<TData, TValue>) {
  const { table, column, anchorEl, open, onClose } = props;

  const { direction } = useTheme();

  const titleId = useId();

  const meta = column.columnDef.meta;

  const label = meta?.filterLabel ?? column.id;

  /**
   * The filter surface opens from the logical start edge of its anchor.
   *
   * Logical start:
   *
   *   LTR -> left
   *   RTL -> right
   */
  const horizontalOrigin = direction === "rtl" ? "right" : "left";

  return (
    <Popover
      dir={direction}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: horizontalOrigin,
      }}
      slotProps={{
        paper: {
          /**
           * Give the filter editor an explicit accessible surface.
           *
           * Popover itself does not otherwise give this editor a useful
           * application-facing accessible name.
           */
          role: "dialog",

          "aria-modal": false,
          "aria-labelledby": titleId,

          sx: {
            width: 320,
            maxWidth: "calc(100vw - 32px)",
          },
        },
      }}
    >
      {/**
       * Subscribe only to column-filter state.
       *
       * DataTableColumnFilter ultimately reads column.getFilterValue(),
       * so that read must remain inside the reactive boundary.
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
                <Typography id={titleId} variant="subtitle2" component="h3">
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
