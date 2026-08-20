"use client";

import { Box } from "@mui/material";
import type { CellData, Header, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableColumnMenuButton } from "./column-menu";
import { DataTableFilterIndicator } from "./filtering";
import { DataTableSortLabel } from "./sorting";

export interface DataTableHeaderContentProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly header: Header<MuiDataTableFeatures, TData, TValue>;
  //   readonly sortingLength: number;
}

/**
 * Interactive content of one DataTable header.
 *
 * Renders the semantic content of one non-placeholder header.
 *
 * Responsibilities:
 *
 * - header label
 * - sorting interaction
 * - sort indicator
 * - active filter indicator
 * - column-menu trigger
 *
 * Structural concerns such as:
 *
 * - sticky positioning
 * - width
 * - colSpan
 * - resize handle
 *
 * Remain in DataTableHeaderCell.
 */
export function DataTableHeaderContent<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableHeaderContentProps<TData, TValue>) {
  const { table, header } = props;

  const column = header.column;

  /**
   * Parent/group headers are not sorting controls.
   *
   * Sorting is attached to leaf/accessor columns.
   */
  const isLeafHeader = header.subHeaders.length === 0;

  /**
   * Group headers render normally.
   *
   * They do not become sorting controls because one group may
   * represent several sortable leaf columns.
   */
  if (!isLeafHeader) {
    return (
      <Box
        sx={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <table.FlexRender header={header} />
      </Box>
    );
  }

  //   const canSort = column.getCanSort();

  //   const direction = column.getIsSorted();

  //   const sortIndex = column.getSortIndex();

  //   const sortHandler = column.getToggleSortingHandler();

  return (
    <table.Subscribe
      // source={table.atoms.sorting}
      selector={(state) => ({
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      })}
    >
      {(selected) => {
        const canSort = column.getCanSort();

        const direction = column.getIsSorted();

        const sortIndex = column.getSortIndex();

        const sortHandler = column.getToggleSortingHandler();

        const canFilter = column.getCanFilter();

        const isFiltered = column.getIsFiltered();

        const enableColumnMenu =
          column.columnDef.meta?.enableColumnMenu ?? true;

        // const showSortIndex = selected.sorting.length > 1;

        return (
          <Box
            className="DataTable-headerContent"
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 0.5,
              minWidth: 0,
            }}
          >
            {/**
             * Main label/sorting region grows and truncates.
             */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 0,
                flex: 1,
                overflow: "hidden",
              }}
            >
              <DataTableSortLabel
                canSort={canSort}
                direction={direction}
                sortIndex={sortIndex}
                // showSortIndex={showSortIndex}
                showSortIndex={selected.sorting.length > 1}
                onClick={
                  canSort
                    ? (event) => {
                        /**
                         * Important:
                         *
                         * stopPropagation prevents future header-level
                         * controls or menus from seeing the click.
                         */
                        event.stopPropagation();

                        sortHandler?.(event);
                      }
                    : undefined
                }
              >
                <table.FlexRender header={header} />
              </DataTableSortLabel>
              {canFilter && <DataTableFilterIndicator active={isFiltered} />}
            </Box>
            {/**
             * Utility/action region never participates in label width.
             */}
            {/* <DataTableColumnMenuButton table={table} column={column} /> */}
            {enableColumnMenu && (
              <DataTableColumnMenuButton table={table} column={column} />
            )}
          </Box>
        );
      }}
    </table.Subscribe>
  );

  /**
   * Show an index only when more than one column participates
   * in sorting.
   */
  //   return (
  //     <DataTableSortLabel
  //       canSort={canSort}
  //       direction={direction}
  //       sortIndex={sortIndex}
  //       showSortIndex={sortingLength > 1}
  //       onClick={
  //         canSort
  //           ? (event) => {
  //               /**
  //                * Important:
  //                *
  //                * stopPropagation prevents future header-level
  //                * controls or menus from seeing the click.
  //                */
  //               event.stopPropagation();

  //               sortHandler?.(event);
  //             }
  //           : undefined
  //       }
  //     >
  //       <table.FlexRender header={header} />
  //     </DataTableSortLabel>
  //   );
}

// {(sorting) => {
//   const canSort = column.getCanSort();

//   const direction = column.getIsSorted();

//   const sortIndex = column.getSortIndex();

//   const sortHandler = column.getToggleSortingHandler();

//   /**
//    * Show an index only when more than one column participates
//    * in sorting.
//    */
//   // const showSortIndex = table.getState()?.sorting?.length > 1;
//   const showSortIndex = sorting.length > 1;
