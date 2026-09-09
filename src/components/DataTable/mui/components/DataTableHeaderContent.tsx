"use client";

// src/components/DataTable/mui/components/DataTableHeaderContent.tsx

import { Box } from "@mui/material";
import type { TableCellProps } from "@mui/material/TableCell";
import type { CellData, Header, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableColumnMenuButton } from "./column-menu";
import { DataTableFilterIndicator } from "./filtering";
import { DataTableSortIndicator, DataTableSortLabel } from "./sorting";

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
 * CENTERED HEADER GEOMETRY
 * ------------------------------------------------------------------
 *
 * A centered header does NOT center:
 *
 *   [label + sort + filter + menu]
 *
 * Instead it uses a symmetric three-track grid:
 *
 *   1fr | label | 1fr
 *
 * The label therefore occupies the exact physical center of the
 * column regardless of how many controls are rendered after it.
 *
 * Controls live at the inline-start edge of the trailing 1fr track:
 *
 *              column center
 *                   │
 *                   ▼
 *
 *   [     1fr     ][Label][ sort filter menu ........ ]
 *
 * This keeps controls visually adjacent to the label while making
 * their width irrelevant to label alignment.
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
        sx={{
          display: "block",
          minWidth: 0,
          width: "100%",
          textAlign:
            align === "right" ? "right" : align === "left" ? "left" : "center",
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
         * ==========================================================
         * Center alignment
         * ==========================================================
         */
        if (align === "center") {
          return (
            <Box
              className="DataTable-headerContent"
              sx={{
                /**
                 * This MUST occupy the physical column width.
                 *
                 * Unlike the old nested 100% chain, this is a single
                 * intentional layout canvas directly beneath the
                 * physical TableCell wrapper.
                 */
                width: "100%",
                minWidth: 0,

                display: "grid",

                /**
                 * Symmetric tracks guarantee that the middle label
                 * track stays at the physical column center.
                 */
                gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",

                alignItems: "center",
                whiteSpace: "nowrap",

                /**
                 * Header action discoverability.
                 */
                "&:hover .DataTable-headerActions, &:focus-within .DataTable-headerActions":
                  {
                    opacity: 1,
                  },
              }}
            >
              {/**
               * ----------------------------------------------------
               * Track 1 —  Symmetric empty inline-start track.
               * ----------------------------------------------------
               *
               * It intentionally contains nothing.
               */}
              <Box
                aria-hidden="true"
                sx={{
                  minWidth: 0,
                }}
              />

              {/**
               * ----------------------------------------------------
               * Track 2 — Exact center label
               * ----------------------------------------------------
               *
               * This track is mathematically centered.
               *
               * Sort affordances are deliberately NOT part of this
               * track's intrinsic width.
               */}
              <Box
                className="DataTable-headerLabelTrack"
                sx={{
                  gridColumn: 2,
                  minWidth: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifySelf: "center",
                  overflow: "hidden",
                  color: "error.main",
                  "&:hover .MuiButtonBase-root": {
                    color: "primary.main",
                  },
                  "&:hover .DataTable-headerLabel": {
                    color: "primary.main",
                  },
                }}
              >
                <DataTableSortLabel
                  canSort={canSort}
                  direction={direction}
                  onClick={
                    canSort
                      ? (event) => {
                          event.stopPropagation();

                          sortHandler?.(event);
                        }
                      : undefined
                  }
                >
                  <table.FlexRender header={header} />
                </DataTableSortLabel>
              </Box>

              {/**
               * ----------------------------------------------------
               * Track 3 — AFFORDANCES
               * ----------------------------------------------------
               *
               * The track begins exactly at the right edge of the
               * centered label.
               *
               * This is why the controls appear immediately beside
               * the label while having ZERO influence on its center.
               */}
              <Box
                className="DataTable-headerActions"
                sx={{
                  gridColumn: 3,

                  /**
                   * Begin immediately after the perfectly centered label track.
                   */
                  justifySelf: "start",

                  display: "inline-flex",
                  alignItems: "center",

                  /**
                   * Sort/filter/menu should visually form one compact affordance
                   * cluster.
                   *
                   * Do not add spacing between:
                   *
                   *   sort
                   *   filter indicator
                   *   menu
                   *
                   * Each control already owns its own tiny internal geometry.
                   */
                  gap: 0,

                  minWidth: 0,

                  /**
                   * Only a tiny separation between the label and the first
                   * affordance.
                   *
                   * 1px is enough to avoid making the label/icon look joined.
                   */
                  ml: "1px",

                  opacity: 0.4,

                  transition: (theme) =>
                    theme.transitions.create("opacity", {
                      duration: theme.transitions.duration.shortest,
                    }),

                  /**
                   * Sort affordance.
                   */
                  "& .DataTable-sortButton": {
                    width: 18,
                    height: 20,
                    minWidth: 18,
                    p: 0,
                    m: 0,
                    flex: "0 0 18px",
                  },

                  /**
                   * Column-menu affordance.
                   */
                  "& .DataTable-columnMenuButton": {
                    width: 20,
                    height: 20,
                    minWidth: 20,
                    p: 0,
                    m: 0,
                    flex: "0 0 20px",
                  },

                  /**
                   * Keep the actual icons compact.
                   */
                  "& .DataTable-sortButton .MuiSvgIcon-root": {
                    fontSize: 15,
                  },

                  "& .DataTable-columnMenuButton .MuiSvgIcon-root": {
                    fontSize: 15,
                  },

                  /**
                   * ------------------------------------------------------------
                   * Compact all header IconButtons
                   * ------------------------------------------------------------
                   *
                   * This applies to:
                   *
                   *   sort indicator
                   *   column-menu button
                   *
                   * but only while they live inside the header action cluster.
                   */
                  "& .MuiIconButton-root": {
                    width: 20,
                    height: 20,
                    minWidth: 20,

                    p: 0,

                    /**
                     * Remove layout margins that could visually separate the
                     * controls.
                     */
                    m: 0,

                    flex: "0 0 20px",
                  },

                  /**
                   * Keep the actual glyph compact too.
                   */
                  "& .MuiIconButton-root .MuiSvgIcon-root": {
                    ml: "4px",
                    mr: "4px",
                    fontSize: 18,
                  },
                }}
              >
                {canSort && (
                  <DataTableSortIndicator
                    direction={direction}
                    sortIndex={sortIndex}
                    showSortIndex={showSortIndex}
                    onClick={
                      sortHandler
                        ? (event) => {
                            event.stopPropagation();

                            sortHandler(event);
                          }
                        : undefined
                    }
                  />
                )}

                {showFilterIndicator && <DataTableFilterIndicator active />}

                {enableColumnMenu && (
                  <DataTableColumnMenuButton table={table} column={column} />
                )}
              </Box>
            </Box>
          );
        }

        /**
         * ----------------------------------------------------------
         * Explicit left/right alignment
         * ----------------------------------------------------------
         *
         * Left/right aligned headers should naturally lay out from
         * their corresponding edge.
         */

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
            // sx={{
            //   /**
            //    * IMPORTANT:
            //    *
            //    * This is intentionally an INLINE cluster.
            //    *
            //    * Do not use:
            //    *
            //    *   width: 100%
            //    *
            //    * because that would make the action region occupy the
            //    * complete physical header cell again.
            //    */
            //   display: "inline-flex",
            //   alignItems: "center",
            //   gap: `${DATA_TABLE_HEADER_AFFORDANCE_GAP_PX}px`,

            //   /**
            //    * Critical for truncation inside a CSS grid track.
            //    */
            //   minWidth: 0,
            //   maxWidth: "100%",

            //   /**
            //    * Header content should never create a second line.
            //    */
            //   whiteSpace: "nowrap",

            //   /**
            //    * ----------------------------------------------------
            //    * THE IMPORTANT PART
            //    * ----------------------------------------------------
            //    *
            //    * Everything following the label pulls the label left
            //    * when the complete cluster is centered.
            //    *
            //    * Add the same amount of empty logical-start space to
            //    * neutralize that displacement.
            //    *
            //    * Because paddingInlineStart is logical rather than
            //    * paddingLeft, this automatically mirrors in RTL.
            //    */
            //   paddingInlineStart:
            //     centerCompensationPx > 0 ? `${centerCompensationPx}px` : 0,

            //   boxSizing: "border-box",

            //   /**
            //    * Menu stays discoverable but subordinate until the user
            //    * interacts with the header.
            //    */
            //   "&:hover .DataTable-headerAction, &:focus-within .DataTable-headerAction":
            //     {
            //       opacity: 1,
            //     },

            //   // "&:hover .DataTable-sortIcon, &:focus-within .DataTable-sortIcon":
            //   //   {
            //   //     opacity: 0.8,
            //   //   },
            // }}
            sx={{
              width: "100%",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: align === "right" ? "flex-end" : "flex-start",
              gap: 0.25,
              whiteSpace: "nowrap",

              "&:hover .DataTable-headerActions, &:focus-within .DataTable-headerActions":
                {
                  opacity: 1,
                },
            }}
          >
            {/**
             * ------------------------------------------------------
             * Main semantic (Label / sorting) region
             * ------------------------------------------------------
             *
             * This is the only flexible/shrinkable section.
             */}
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
            <Box
              className="DataTable-headerActions"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.25,
                flex: "0 0 auto",
                opacity: 0.4,

                transition: (theme) =>
                  theme.transitions.create("opacity", {
                    duration: theme.transitions.duration.shortest,
                  }),
              }}
            >
              {canSort && (
                <DataTableSortIndicator
                  direction={direction}
                  sortIndex={sortIndex}
                  showSortIndex={showSortIndex}
                  onClick={
                    sortHandler
                      ? (event) => {
                          event.stopPropagation();
                          sortHandler(event);
                        }
                      : undefined
                  }
                />
              )}

              {/**
               * ------------------------------------------------------
               * Active filter indicator
               * ------------------------------------------------------
               */}
              {showFilterIndicator && <DataTableFilterIndicator active />}

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
                <DataTableColumnMenuButton table={table} column={column} />
              )}
            </Box>
          </Box>
        );
      }}
    </table.Subscribe>
  );
}

//  {
//    /**
//     * ------------------------------------------------------
//     * Active filter indicator
//     * ------------------------------------------------------
//     */
//  }
//  {
//    /* {showFilterIndicator && <DataTableFilterIndicator active />} */
//  }

//  {
//    /**
//     * ------------------------------------------------------
//     * Active filter indicator
//     * ------------------------------------------------------
//     *
//     *{canFilter && <DataTableFilterIndicator active={isFiltered} />}
//     */
//  }

//  {
//    /**
//     * ------------------------------------------------------
//     * Column action menu
//     * ------------------------------------------------------
//     *
//     * Keep it next to the header label/sort icon.
//     *
//     * It is faintly visible at rest rather than completely
//     * disappearing until hover.
//     */
//  }
//  {
//    enableColumnMenu && (
//      <Box
//        className="DataTable-headerActions"
//        sx={{
//          display: "inline-flex",
//          alignItems: "center",
//          justifyContent: "center",
//          width: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//          minWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//          maxWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//          flex: "0 0 auto",

//          /**
//           * MRT-like discoverability:
//           *
//           * visible but visually subordinate at rest;
//           * full emphasis on hover/focus.
//           */
//          opacity: 0.35,

//          transition: (theme) =>
//            theme.transitions.create("opacity", {
//              duration: theme.transitions.duration.shortest,
//            }),

//          /**
//           * Override a menu button implementation that may
//           * itself use hover-only opacity.
//           *
//           * The two-class descendant selector intentionally
//           * has enough specificity to establish the header
//           * presentation policy here.
//           *
//           * Establish the physical geometry that our center
//           * compensation calculation expects.
//           */
//          "& .MuiIconButton-root": {
//            width: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//            height: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//            minWidth: `${DATA_TABLE_HEADER_MENU_BUTTON_SIZE_PX}px`,
//            p: 0,
//            opacity: "inherit",
//            visibility: "visible",
//            // width: 24,
//            // height: 24,
//            // p: 0.25,
//            color: "text.secondary",

//            transition: (theme) =>
//              theme.transitions.create(
//                ["opacity", "color", "background-color"],
//                {
//                  duration: theme.transitions.duration.shortest,
//                },
//              ),

//            "&:hover": {
//              color: "text.primary",
//              backgroundColor: "action.hover",
//            },

//            "&:focus-visible": {
//              opacity: 1,
//              color: "text.primary",
//            },
//          },

//          // flexShrink: 0,
//        }}
//      >
//        <DataTableColumnMenuButton table={table} column={column} />
//      </Box>
//    );
//  }

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
