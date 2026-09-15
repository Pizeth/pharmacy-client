"use client";

import { Box, Divider, Stack, Typography, styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTablePageSizeSelect } from "./DataTablePageSizeSelect";
import { DataTablePaginationActions } from "./DataTablePaginationActions";
import type { DataTablePaginationConfig } from "./types";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";

const PaginationRoot = styled("footer", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Pagination",
  overridesResolver: (_props, styles) => styles.pagination,
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  paddingInline: theme.spacing(2),
  flexWrap: "wrap",
  ...Object.fromEntries(
    (["compact", "comfortable", "spacious"] as const).map((density) => {
      const metrics = getDataTableDensityMetrics(density);
      return [
        `&[data-density="${density}"]`,
        {
          paddingBlock: theme.spacing(metrics.footerPaddingBlock),
          minHeight: `${metrics.footerHeight}px`,
        },
      ];
    }),
  ),
}));
const PaginationDividerRoot = styled(Divider, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationDivider",
  overridesResolver: (_props, styles) => styles.paginationDivider,
})({});
const PaginationControlsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationControls",
  overridesResolver: (_props, styles) => styles.paginationControls,
})({});
const PaginationStatusRoot = styled(Typography, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationStatus",
  overridesResolver: (_props, styles) => styles.paginationStatus,
})({ whiteSpace: "nowrap" });

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

  const { density } = useDataTableDensity();

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
            <PaginationDividerRoot
              className={dataTableClasses.paginationDivider}
            />
            <PaginationRoot
              className={dataTableClasses.pagination}
              data-density={density}
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

              <PaginationControlsRoot
                className={dataTableClasses.paginationControls}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <PaginationStatusRoot
                  className={dataTableClasses.paginationStatus}
                  variant="body2"
                  color="text.secondary"
                >
                  {hasKnownPageCount ? (
                    <>
                      Page {displayPage} of {Math.max(1, pageCount)}
                    </>
                  ) : (
                    <>Page {displayPage}</>
                  )}
                </PaginationStatusRoot>

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
              </PaginationControlsRoot>
            </PaginationRoot>
          </>
        );
      }}
    </table.Subscribe>
  );
}
