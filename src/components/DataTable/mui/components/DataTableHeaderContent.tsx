"use client";

// src/components/DataTable/mui/components/DataTableHeaderContent.tsx

import { Box, styled } from "@mui/material";
import type { TableCellProps } from "@mui/material/TableCell";
import type { CellData, Header, RowData } from "@tanstack/table-core";
import type { MouseEvent } from "react";
import type { MuiDataTableFeatures } from "../features";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { MuiDataTableInstance } from "../table";
import { DataTableColumnMenuButton } from "./column-menu";
import { DataTableFilterIndicator } from "./filtering";
import { DataTableSortIndicator, DataTableSortLabel } from "./sorting";

/**
 * ------------------------------------------------------------------
 * HeaderContent structural slot
 * ------------------------------------------------------------------
 *
 * This is the semantic/interactable layout canvas inside one physical
 * HeaderCell.
 *
 * It deliberately owns:
 *
 * - centered-vs-edge header layout
 * - discoverability of trailing header actions
 *
 * It deliberately does NOT own:
 *
 * - physical column width
 * - sticky positioning
 * - pinning
 * - density
 * - resize-handle placement
 *
 * Those remain responsibilities of DataTableHeaderCell.
 */
const HeaderContentRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderContent",
  overridesResolver: (_props, styles) => styles.headerContent,
})(({ theme }) => ({
  /**
   * This canvas must occupy the complete usable inline width of the
   * physical header cell.
   *
   * Unlike the old nested percentage-height experiments, this is one
   * deliberate width-owning semantic layout surface.
   */
  width: "100%",

  minWidth: 0,
  alignItems: "center",
  whiteSpace: "nowrap",

  /**
   * Header actions remain visible but subordinate at rest.
   *
   * Hovering anywhere in the semantic header region—or moving
   * keyboard focus into it—promotes the action cluster.
   *
   * Use the stable utility class instead of the old hand-written:
   *
   *   .DataTable-headerActions
   */
  [`&:hover .${dataTableClasses.headerActions}, ` +
  `&:focus-within .${dataTableClasses.headerActions}`]: {
    opacity: 1,
  },

  /**
   * ==============================================================
   * Center alignment
   * ==============================================================
   *
   * THIS GEOMETRY IS FROZEN.
   *
   * Do not replace it with:
   *
   *   justify-content: center
   *
   * and do not center:
   *
   *   label + actions
   *
   * as one combined cluster.
   *
   * The middle track is mathematically centered regardless of how
   * much width the action region consumes.
   */
  '&[data-align="center"]': {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
  },

  /**
   * ==============================================================
   * Explicit left/start-style alignment
   * ==============================================================
   *
   * HeaderCell currently resolves logical DataTable alignment into
   * MUI's physical TableCell alignment before it reaches this
   * component.
   *
   * Therefore the values received here are currently:
   *
   *   left
   *   center
   *   right
   */
  '&[data-align="left"]': {
    display: "flex",
    justifyContent: theme.direction === "rtl" ? "flex-end" : "flex-start",
    gap: theme.spacing(0.25),
  },

  /**
   * ==============================================================
   * Explicit right/end-style alignment
   * ==============================================================
   */
  '&[data-align="right"]': {
    display: "flex",
    justifyContent: theme.direction === "rtl" ? "flex-start" : "flex-end",
    gap: theme.spacing(0.25),
  },

  /**
   * Defensive fallback for any future MUI alignment value not covered
   * above.
   *
   * Current DataTableHeaderCell does not emit such a value, but this
   * prevents the semantic canvas from becoming unstyled if that
   * contract expands later.
   */
  "&:not([data-align])": {
    display: "flex",
    justifyContent: "flex-start",
    gap: theme.spacing(0.25),
  },
}));

/**
 * ------------------------------------------------------------------
 * HeaderGroupLabel structural slot
 * ------------------------------------------------------------------
 *
 * Group headers do not represent one sortable/filterable leaf column,
 * therefore they render only their semantic header content.
 */
const HeaderGroupLabelRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderGroupLabel",
  overridesResolver: (_props, styles) => styles.headerGroupLabel,
})({
  display: "block",
  width: "100%",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 600,

  /**
   * Group-header fallback remains centered.
   *
   * DataTableHeaderCell currently resolves all normal values to one
   * of left/center/right.
   */
  textAlign: "center",

  '&[data-align="left"]': {
    textAlign: "left",
  },

  '&[data-align="right"]': {
    textAlign: "right",
  },
});

/**
 * ------------------------------------------------------------------
 * HeaderLabelTrack structural slot
 * ------------------------------------------------------------------
 *
 * This is Track 2 of the centered:
 *
 *   1fr | LABEL | 1fr
 *
 * grid.
 *
 * Its intrinsic width MUST represent the label region only.
 *
 * Sort/filter/menu affordances live outside this track so they cannot
 * shift the label away from the physical column center.
 */
const HeaderLabelTrackRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderLabelTrack",
  overridesResolver: (_props, styles) => styles.headerLabelTrack,
})(({ theme }) => ({
  gridColumn: 2,
  minWidth: 0,
  display: "inline-flex",
  alignItems: "center",
  justifySelf: "center",
  overflow: "hidden",
  color: (theme.vars ?? theme).palette.error.main,

  // Intentional header accent, independent of table-body text color.

  // Center-track hover targets the stable label slot.
  [`&:hover .${dataTableClasses.headerLabel}`]: {
    color: (theme.vars ?? theme).palette.primary.main,
  },
}));

/**
 * ------------------------------------------------------------------
 * HeaderActions structural slot
 * ------------------------------------------------------------------
 *
 * Trailing semantic affordances:
 *
 * - sort direction
 * - multi-sort position
 * - active-filter indicator
 * - column menu
 *
 * Important:
 *
 * this region never participates in the centered label track's
 * intrinsic width.
 */
const HeaderActionsRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderActions",
  overridesResolver: (_props, styles) => styles.headerActions,
})(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  minWidth: 0,
  flex: "0 0 auto",

  /**
   * MRT-like discoverability:
   *
   * visible, but visually subordinate until hover/focus.
   */
  opacity: 0.4,

  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),

  /**
   * ============================================================
   * Center-aligned action track
   * ============================================================
   *
   * Grid track 3 starts exactly at the inline edge immediately
   * following the centered label track.
   */
  '&[data-align="center"]': {
    gridColumn: 3,

    /**
     * Begin immediately after the perfectly centered label track.
     */
    justifySelf: "start",

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

    /**
     * Tiny logical separation between the label and first
     * affordance.
     *
     * Use a logical property so RTL remains correct.
     */
    marginInlineStart: "1px",
  },

  /**
   * Non-centered headers naturally render their action cluster
   * immediately after the sortable label.
   */
  '&[data-align="left"], &[data-align="right"]': {
    gap: theme.spacing(0.25),
  },
}));

/**
 * Private symmetric leading track.
 *
 * This is intentionally NOT a public theme slot.
 *
 * Its only responsibility is maintaining the centered three-track
 * geometry:
 *
 *   empty 1fr | label | actions 1fr
 */
const HeaderLeadingTrack = styled("span")({
  display: "block",
  minWidth: 0,
});

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
   *
   * Normal current values are:
   *
   * - left
   * - center
   * - right
   */
  readonly align: NonNullable<TableCellProps["align"]>;
}

/**
 * Semantic/interactable content for one DataTable header.
 *
 * ------------------------------------------------------------------
 * Centered-header invariant
 * ------------------------------------------------------------------
 *
 * A centered header does NOT center:
 *
 *   [label + sort + filter + menu]
 *
 * Instead it uses a symmetric three-track grid:
 *
 *   minmax(0,1fr) | LABEL | minmax(0,1fr)
 *
 * The label therefore occupies the physical column center regardless
 * of the trailing affordance width.
 *
 * Structural cell concerns remain in DataTableHeaderCell:
 *
 * - width
 * - sticky positioning
 * - pinning
 * - density
 * - resize handle
 */
export function DataTableHeaderContent<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableHeaderContentProps<TData, TValue>) {
  const { table, header, align } = props;

  const column = header.column;

  /**
   * Parent/group headers are presentation-only at this layer.
   *
   * Sorting/filter/menu interaction belongs to concrete leaf columns.
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
      <HeaderGroupLabelRoot
        className={dataTableClasses.headerGroupLabel}
        data-align={align}
      >
        <table.FlexRender header={header} />
      </HeaderGroupLabelRoot>
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
         * - TanStack provides a valid sort index
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
         * One canonical sort interaction handler for both:
         *
         * - semantic label
         * - visual sort indicator
         */
        const handleSortClick = sortHandler
          ? (event: MouseEvent<HTMLElement>): void => {
              event.stopPropagation();
              sortHandler(event);
            }
          : undefined;

        /**
         * The trailing action cluster is structurally identical for
         * centered and edge-aligned headers.
         *
         * Only its containing CSS layout changes.
         */
        const actions = (
          <HeaderActionsRoot
            className={dataTableClasses.headerActions}
            data-align={align}
          >
            {canSort && (
              <DataTableSortIndicator
                direction={direction}
                sortIndex={sortIndex}
                showSortIndex={showSortIndex}
                onClick={handleSortClick}
              />
            )}

            {showFilterIndicator && <DataTableFilterIndicator active />}

            {enableColumnMenu && (
              <DataTableColumnMenuButton table={table} column={column} />
            )}
          </HeaderActionsRoot>
        );

        /**
         * ==========================================================
         * Center alignment
         * ==========================================================
         *
         * FROZEN:
         *
         *   1fr | label | 1fr
         */
        if (align === "center") {
          return (
            // <Box
            //   className="DataTable-headerContent"
            //   sx={{
            //     /**
            //      * This MUST occupy the physical column width.
            //      *
            //      * Unlike the old nested 100% chain, this is a single
            //      * intentional layout canvas directly beneath the
            //      * physical TableCell wrapper.
            //      */
            //     width: "100%",
            //     minWidth: 0,

            //     display: "grid",

            //     /**
            //      * Symmetric tracks guarantee that the middle label
            //      * track stays at the physical column center.
            //      */
            //     gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",

            //     alignItems: "center",
            //     whiteSpace: "nowrap",

            //     /**
            //      * Header action discoverability.
            //      */
            //     "&:hover .DataTable-headerActions, &:focus-within .DataTable-headerActions":
            //       {
            //         opacity: 1,
            //       },
            //   }}
            // >
            <HeaderContentRoot
              className={dataTableClasses.headerContent}
              data-align="center"
            >
              {/**
               * ----------------------------------------------------
               * Track 1 —  Symmetric empty inline-start track.
               * ----------------------------------------------------
               *
               * It intentionally contains nothing.
               */}
              <HeaderLeadingTrack aria-hidden="true" />

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
              <HeaderLabelTrackRoot
                className={dataTableClasses.headerLabelTrack}
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
              </HeaderLabelTrackRoot>

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
              {actions}
            </HeaderContentRoot>
          );
        }

        /**
         * ==========================================================
         * Explicit edge alignment
         * ==========================================================
         *
         * Left/right aligned headers naturally render from their
         * corresponding physical edge.
         *
         * They do NOT use the symmetric center grid.
         */
        return (
          <HeaderContentRoot
            className={dataTableClasses.headerContent}
            data-align={align}
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
            {actions}
          </HeaderContentRoot>
        );
      }}
    </table.Subscribe>
  );
}

// {/* <Box
//   className="DataTable-headerActions"
//   sx={{
//     gridColumn: 3,

//     /**
//      * Begin immediately after the perfectly centered label track.
//      */
//     justifySelf: "start",

//     display: "inline-flex",
//     alignItems: "center",

//     /**
//      * Sort/filter/menu should visually form one compact affordance
//      * cluster.
//      *
//      * Do not add spacing between:
//      *
//      *   sort
//      *   filter indicator
//      *   menu
//      *
//      * Each control already owns its own tiny internal geometry.
//      */
//     gap: 0,

//     minWidth: 0,

//     /**
//      * Only a tiny separation between the label and the first
//      * affordance.
//      *
//      * 1px is enough to avoid making the label/icon look joined.
//      */
//     ml: "1px",

//     opacity: 0.4,

//     transition: (theme) =>
//       theme.transitions.create("opacity", {
//         duration: theme.transitions.duration.shortest,
//       }),

//     /**
//      * Sort affordance.
//      */
//     "& .DataTable-sortButton": {
//       width: 18,
//       height: 20,
//       minWidth: 18,
//       p: 0,
//       m: 0,
//       flex: "0 0 18px",
//     },

//     /**
//      * Column-menu affordance.
//      */
//     "& .DataTable-columnMenuButton": {
//       width: 20,
//       height: 20,
//       minWidth: 20,
//       p: 0,
//       m: 0,
//       flex: "0 0 20px",
//     },

//     /**
//      * Keep the actual icons compact.
//      */
//     "& .DataTable-sortButton .MuiSvgIcon-root": {
//       fontSize: 15,
//     },

//     "& .DataTable-columnMenuButton .MuiSvgIcon-root": {
//       fontSize: 15,
//     },

//     /**
//      * ------------------------------------------------------------
//      * Compact all header IconButtons
//      * ------------------------------------------------------------
//      *
//      * This applies to:
//      *
//      *   sort indicator
//      *   column-menu button
//      *
//      * but only while they live inside the header action cluster.
//      */
//     "& .MuiIconButton-root": {
//       width: 20,
//       height: 20,
//       minWidth: 20,

//       p: 0,

//       /**
//        * Remove layout margins that could visually separate the
//        * controls.
//        */
//       m: 0,

//       flex: "0 0 20px",
//     },

//     /**
//      * Keep the actual glyph compact too.
//      */
//     "& .MuiIconButton-root .MuiSvgIcon-root": {
//       ml: "4px",
//       mr: "4px",
//       fontSize: 18,
//     },
//   }}
// >
//   {canSort && (
//     <DataTableSortIndicator
//       direction={direction}
//       sortIndex={sortIndex}
//       showSortIndex={showSortIndex}
//       onClick={
//         sortHandler
//           ? (event) => {
//               event.stopPropagation();

//               sortHandler(event);
//             }
//           : undefined
//       }
//     />
//   )}

//   {showFilterIndicator && <DataTableFilterIndicator active />}

//   {enableColumnMenu && (
//     <DataTableColumnMenuButton table={table} column={column} />
//   )}
// </Box>; */}

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
