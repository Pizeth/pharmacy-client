"use client";

import { Box } from "@mui/material";
import type { CellData, Header, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
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
 * Structural concerns such as:
 *
 * - sticky positioning
 * - width
 * - colSpan
 * - resize handle
 *
 * stay in DataTableHeaderCell.
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
    <table.Subscribe source={table.atoms.sorting}>
      {(sorting) => {
        const canSort = column.getCanSort();

        const direction = column.getIsSorted();

        const sortIndex = column.getSortIndex();

        const sortHandler = column.getToggleSortingHandler();

        /**
         * Show an index only when more than one column participates
         * in sorting.
         */
        // const showSortIndex = table.getState()?.sorting?.length > 1;
        const showSortIndex = sorting.length > 1;

        return (
          <DataTableSortLabel
            canSort={canSort}
            direction={direction}
            sortIndex={sortIndex}
            showSortIndex={showSortIndex}
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
