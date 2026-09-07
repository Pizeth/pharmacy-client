"use client";

// src/components/DataTable/mui/components/DataTableHeaderContent.tsx

import { Box, TableCellProps } from "@mui/material";
import type { CellData, Header, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableColumnMenuButton } from "./column-menu";
import { DataTableFilterIndicator } from "./filtering";
import { DataTableSortLabel } from "./sorting";
import {
  DATA_TABLE_HEADER_AFFORDANCE_GAP_PX,
  DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX,
  getDataTableHeaderCenterCompensationPx,
} from "./headerLayout";

export interface DataTableHeaderContentProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly header: Header<MuiDataTableFeatures, TData, TValue>;

  /**
   * Final alignment already resolved by DataTableHeaderCell.
   *
   * Center alignment receives optical compensation so the actual label
   * stays centered independently of sort/filter/menu affordances.
   */
  readonly align: NonNullable<TableCellProps["align"]>;
}

/**
 * Renders Semantic/interactable content of one DataTable header.
 *
 * Visual model:
 *
 *   [ Header Label ][ Sort ][ Filter ][ Menu ]
 *
 * The complete cluster is aligned by DataTableHeaderCell.
 *
 * Therefore, with the default header alignment:
 *
 *              [ Label ⇅ ⋮ ]
 *
 * is centered as one unit rather than centering the label while
 * pushing actions to the edge of the physical cell.
 *
 * Center alignment intentionally means:
 *
 *       COLUMN CENTER
 *            │
 *            ▼
 *        Category ↓ ⋮
 *           ▲
 *           │
 *       LABEL center
 *
 * rather than:
 *
 *       COLUMN CENTER
 *            │
 *            ▼
 *      [Category ↓ ⋮]
 *           ▲
 *       CLUSTER center
 *
 * This matches the visual behavior used by mature table libraries such as MRT.
 *
 * Responsibilities:
 *
 * - header renderer
 * - sorting interaction
 * - sort direction
 * - multi-sort order
 * - active-filter indication
 * - column-menu trigger
 *
 * Structural physical table-cell layout concerns such as:
 *
 * - width
 * - sticky positioning
 * - pinning
 * - density
 * - resize handle
 *
 * Remain in DataTableHeaderCell.
 */
export function DataTableHeaderContent<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableHeaderContentProps<TData, TValue>) {
  const { table, header, align } = props;

  const column = header.column;

  /**
   * Parent/group headers are not sorting controls.
   *
   * Sorting is attached to leaf/accessor columns.
   */
  const isLeafHeader = header.subHeaders.length === 0;

  /**
   * ================================================================
   * Group header
   * ================================================================
   *
   * Group headers have no singular sorting/menu interaction model.
   */
  if (!isLeafHeader) {
    return (
      <Box
        className="DataTable-headerGroupLabel"
        // sx={{
        //   width: "100%",
        //   minWidth: 0,
        //   overflow: "hidden",
        //   textOverflow: "ellipsis",
        // }}
        sx={{
          display: "block",
          minWidth: 0,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontWeight: 600,
        }}
      >
        <table.FlexRender header={header} />
      </Box>
    );
  }

  /**
   * ================================================================
   * Leaf header
   * ================================================================
   */
  return (
    <table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        columnFilters: state.columnFilters,
      })}
    >
      {(selected) => {
        /**
         * Keep state-dependent TanStack reads inside the subscribed
         * render function.
         */
        const canSort = column.getCanSort();

        const direction = column.getIsSorted();

        const sortIndex = column.getSortIndex();

        const sortHandler = column.getToggleSortingHandler();

        const canFilter = column.getCanFilter();

        const isFiltered = column.getIsFiltered();

        const enableColumnMenu =
          column.columnDef.meta?.enableColumnMenu ?? true;

        /**
         * Multi-sort badge only physically exists while:
         *
         * - this column is actively sorted
         * - multiple columns participate in sorting
         */
        const showSortIndex =
          selected.sorting.length > 1 &&
          direction !== false &&
          sortIndex !== undefined;

        /**
         * Filter indicator currently renders only for an active filter.
         */
        const showFilterIndicator = canFilter && isFiltered;

        /**
         * ----------------------------------------------------------
         * Optical center compensation
         * ----------------------------------------------------------
         *
         * Apply only for centered headers.
         *
         * Left/right aligned headers should naturally lay out from
         * their corresponding edge.
         */
        const centerCompensationPx =
          align === "center"
            ? getDataTableHeaderCenterCompensationPx({
                canSort,
                showSortIndex,
                showFilterIndicator,
                showColumnMenu: enableColumnMenu,
              })
            : 0;

        return (
          <Box
            className="DataTable-headerContent"
            // sx={{
            //   display: "flex",
            //   alignItems: "center",

            //   /**
            //    * This component participates as the single flexible
            //    * child of DataTableHeaderCell's width-owning wrapper.
            //    */
            //   width: "100%",

            //   flex: "1 1 auto",
            //   gap: 0.5,
            //   minWidth: 0,
            //   height: "100%",
            //   overflow: "hidden",
            // }}
            // sx={{
            //   /**
            //    * Grid is intentionally used here rather than nesting
            //    * multiple flexible percentage-width containers.
            //    *
            //    * Column 1:
            //    *   semantic label/sort/filter region
            //    *
            //    * Column 2:
            //    *   fixed utility/menu region
            //    */
            //   display: "grid",
            //   gridTemplateColumns: enableColumnMenu
            //     ? "minmax(0, 1fr) auto"
            //     : "minmax(0, 1fr)",
            //   alignItems: "center",
            //   columnGap: 0.5,

            //   /**
            //    * Critical for truncation inside a CSS grid track.
            //    */
            //   minWidth: 0,
            // }}
            sx={{
              /**
               * IMPORTANT:
               *
               * This is intentionally an INLINE cluster.
               *
               * Do not use:
               *
               *   width: 100%
               *
               * because that would make the action region occupy the
               * complete physical header cell again.
               */
              display: "inline-flex",
              alignItems: "center",
              gap: `${DATA_TABLE_HEADER_AFFORDANCE_GAP_PX}px`,

              /**
               * Critical for truncation inside a CSS grid track.
               */
              minWidth: 0,
              maxWidth: "100%",

              /**
               * Header content should never create a second line.
               */
              whiteSpace: "nowrap",

              /**
               * ----------------------------------------------------
               * THE IMPORTANT PART
               * ----------------------------------------------------
               *
               * Everything following the label pulls the label left
               * when the complete cluster is centered.
               *
               * Add the same amount of empty logical-start space to
               * neutralize that displacement.
               *
               * Because paddingInlineStart is logical rather than
               * paddingLeft, this automatically mirrors in RTL.
               */
              paddingInlineStart:
                centerCompensationPx > 0 ? `${centerCompensationPx}px` : 0,

              boxSizing: "border-box",

              /**
               * Menu stays discoverable but subordinate until the user
               * interacts with the header.
               */
              "&:hover .DataTable-headerAction, &:focus-within .DataTable-headerAction":
                {
                  opacity: 1,
                },

              // "&:hover .DataTable-sortIcon, &:focus-within .DataTable-sortIcon":
              //   {
              //     opacity: 0.8,
              //   },
            }}
          >
            {/**
             * ------------------------------------------------------
             * Main semantic (Label / sorting) region
             * ------------------------------------------------------
             *
             * This is the only flexible/shrinkable section.
             */}
            <Box
              className="DataTable-headerMain"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 0,
                maxWidth: "100%",
                // flex: "1 1 auto",
                overflow: "hidden",
              }}
            >
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
              {/* {canFilter && <DataTableFilterIndicator active={isFiltered} />} */}
            </Box>

            {/**
             * ------------------------------------------------------
             * Active filter indicator
             * ------------------------------------------------------
             */}
            {showFilterIndicator && <DataTableFilterIndicator active />}

            {/**
             * ------------------------------------------------------
             * Active filter indicator
             * ------------------------------------------------------
             *
             *{canFilter && <DataTableFilterIndicator active={isFiltered} />}
             */}

            {/**
             * ------------------------------------------------------
             * Column action menu
             * ------------------------------------------------------
             *
             * Keep it next to the header label/sort icon.
             *
             * It is faintly visible at rest rather than completely
             * disappearing until hover.
             */}
            {enableColumnMenu && (
              <Box
                className="DataTable-headerActions"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
                  minWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
                  maxWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
                  flex: "0 0 auto",

                  /**
                   * MRT-like discoverability:
                   *
                   * visible but visually subordinate at rest;
                   * full emphasis on hover/focus.
                   */
                  opacity: 0.35,

                  transition: (theme) =>
                    theme.transitions.create("opacity", {
                      duration: theme.transitions.duration.shortest,
                    }),

                  /**
                   * Override a menu button implementation that may
                   * itself use hover-only opacity.
                   *
                   * The two-class descendant selector intentionally
                   * has enough specificity to establish the header
                   * presentation policy here.
                   *
                   * Establish the physical geometry that our center
                   * compensation calculation expects.
                   */
                  "& .MuiIconButton-root": {
                    width: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
                    height: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
                    minWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
                    p: 0,
                    opacity: "inherit",
                    visibility: "visible",
                    // width: 24,
                    // height: 24,
                    // p: 0.25,
                    color: "text.secondary",

                    transition: (theme) =>
                      theme.transitions.create(
                        ["opacity", "color", "background-color"],
                        {
                          duration: theme.transitions.duration.shortest,
                        },
                      ),

                    "&:hover": {
                      color: "text.primary",
                      backgroundColor: "action.hover",
                    },

                    "&:focus-visible": {
                      opacity: 1,
                      color: "text.primary",
                    },
                  },

                  // flexShrink: 0,
                }}
              >
                <DataTableColumnMenuButton table={table} column={column} />
              </Box>
            )}
          </Box>
        );
      }}
    </table.Subscribe>
  );
}

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
