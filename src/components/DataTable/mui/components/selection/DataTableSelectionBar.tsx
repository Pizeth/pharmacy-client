// src/components/DataTable/mui/components/selection/DataTableSelectionBar.tsx

"use client";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTableBulkActions } from "./DataTableBulkActions";

import {
  getDataTableSelectedRowIds,
  getDataTableSelectedRows,
} from "./selectedRows";

import type {
  DataTableSelectionBarConfig,
  DataTableSelectionContext,
} from "./types";

export interface DataTableSelectionBarProps<
  TData extends RowData,
> extends DataTableSelectionBarConfig<TData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * High-level status and bulk-action surface for TanStack row selection.
 *
 * No independent selection state is stored here.
 */
export function DataTableSelectionBar<TData extends RowData>(
  props: DataTableSelectionBarProps<TData>,
) {
  const {
    table,
    actions = [],
    clearable = true,
    startContent,
    renderStartContent,
    endContent,
    renderEndContent,
  } = props;

  return (
    <table.Subscribe selector={(state) => state.rowSelection}>
      {(rowSelection) => {
        const selectedRowIds = getDataTableSelectedRowIds(rowSelection);

        const selectedCount = selectedRowIds.length;

        /**
         * The selection bar should not consume vertical space while
         * no rows are selected.
         */
        if (selectedCount === 0) {
          return null;
        }

        const selectedRows = getDataTableSelectedRows(table, selectedRowIds);

        const context: DataTableSelectionContext<TData> = {
          table,
          selectedRowIds,
          selectedRows,
          selectedCount,
        };

        const renderedStartContent = renderStartContent
          ? renderStartContent(context)
          : startContent;

        const renderedEndContent = renderEndContent
          ? renderEndContent(context)
          : endContent;

        return (
          <>
            <Divider />

            <Box
              data-selection-bar="true"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                px: 2,
                py: 1,
                minHeight: 52,
                backgroundColor: "action.selected",
                flexWrap: "wrap",
              }}
            >
              {/**
               * LEFT SIDE
               *
               * selected status + application content
               */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  minWidth: 0,
                  flex: "1 1 auto",
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedCount === 1
                    ? "1 row selected"
                    : `${selectedCount} rows selected`}
                </Typography>

                {renderedStartContent}
              </Stack>

              {/**
               * RIGHT SIDE
               *
               * custom content + application bulk actions + clear
               */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
                sx={{
                  minWidth: 0,
                  flexWrap: "wrap",
                }}
              >
                {renderedEndContent}

                <DataTableBulkActions<TData>
                  actions={actions}
                  context={context}
                />

                {clearable && (
                  <Button
                    size="small"
                    color="inherit"
                    aria-label="Clear all selected rows"
                    startIcon={<CloseOutlined fontSize="small" />}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      table.setRowSelection({});
                    }}
                  >
                    Clear
                  </Button>
                )}
              </Stack>
            </Box>
          </>
        );
      }}
    </table.Subscribe>
  );
}
