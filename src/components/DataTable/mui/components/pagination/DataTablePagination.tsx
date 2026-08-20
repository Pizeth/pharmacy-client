"use client";

import { Box, Divider, Stack, Typography } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTablePageSizeSelect } from "./DataTablePageSizeSelect";
import { DataTablePaginationActions } from "./DataTablePaginationActions";
import type { DataTablePaginationConfig } from "./types";

export interface DataTablePaginationProps<
  TData extends RowData,
> extends DataTablePaginationConfig {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Pagination footer for the MUI DataTable.
 *
 * TanStack owns:
 *
 * - pageIndex
 * - pageSize
 * - next/previous capability
 * - page count
 * - row count
 * - manual/client pagination semantics
 *
 * This component only renders controls.
 */
export function DataTablePagination<TData extends RowData>(
  props: DataTablePaginationProps<TData>,
) {
  const {
    table,
    pageSizeOptions = [10, 25, 50, 100, 200],
    showFirstLastButtons = true,
    showPageSizeSelector = true,
  } = props;

  return (
    <table.Subscribe source={table.atoms.pagination}>
      {(pagination) => {
        const { pageIndex, pageSize } = pagination;

        const canPreviousPage = table.getCanPreviousPage();

        const canNextPage = table.getCanNextPage();

        const pageCount = table.getPageCount();

        /**
         * TanStack uses -1 to represent unknown page count in
         * manual/server pagination.
         */
        const hasKnownPageCount = pageCount >= 0;

        const displayPage = pageIndex + 1;

        return (
          <>
            <Divider />
            <Box
              component="footer"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                px: 2,
                py: 1,
                minHeight: 52,
                flexWrap: "wrap",
              }}
            >
              {showPageSizeSelector ? (
                <DataTablePageSizeSelect
                  pageSize={pageSize}
                  options={pageSizeOptions}
                  onChange={(nextPageSize) => {
                    table.setPageSize(nextPageSize);
                  }}
                />
              ) : (
                <Box />
              )}

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {hasKnownPageCount ? (
                    <>
                      Page {displayPage} of {Math.max(1, pageCount)}
                    </>
                  ) : (
                    <>Page {displayPage}</>
                  )}
                </Typography>

                <DataTablePaginationActions
                  canPreviousPage={canPreviousPage}
                  canNextPage={canNextPage}
                  showFirstLastButtons={
                    showFirstLastButtons && hasKnownPageCount
                  }
                  onFirstPage={() => {
                    table.firstPage();
                  }}
                  onPreviousPage={() => {
                    table.previousPage();
                  }}
                  onNextPage={() => {
                    table.nextPage();
                  }}
                  onLastPage={() => {
                    table.lastPage();
                  }}
                />
              </Stack>
            </Box>
          </>
        );
      }}
    </table.Subscribe>
  );
}
