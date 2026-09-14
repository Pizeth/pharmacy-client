# Phase 1.7.10.6C.6 � Header theme audit

## Changes

This bounded audit adds the missing outer `head` slot to the `RazethDataTable` family and removes the temporary error color from the centered label track. It preserves the 6C.3 symmetric grid, the 6C.4 sorting/menu controls, and the 6C.5 resize handle.

`HeadRoot` wraps MUI `TableHead`, preserving `thead` semantics and the MUI context that makes child TableCells render as column headers. Its `Head` slot maps to `styleOverrides.head`. Its stable class is `RazethDataTable-head`. The existing class-derived slot type automatically extends the theme augmentation.

The outer head owns no width, sticky offsets, or pinning. Cells still receive typed CSS custom properties from TanStack. The label track now uses `color: "inherit"`, allowing the header cell/theme to determine the resting text color. The existing primary-color hover rule remains.

## Audit findings

| Surface | Current contract |
| --- | --- |
| Outer head | Newly registered Head slot |
| Header rows | HeaderRow slot |
| Physical cells | HeaderCell slot, typed width/sticky/pinned CSS variables |
| Cell content | HeaderCellContent slot |
| Semantic layout | HeaderContent, HeaderGroupLabel, HeaderLabelTrack, HeaderActions |
| Sorting/menu | HeaderLabel, SortLabel, SortIndicator, SortButton, SortIcon, SortIndex, ColumnMenuButton |
| Resize | ResizeHandle slot, TanStack drag state, logical placement |
| Header pinning | TanStack start/end offsets supplied as typed CSS variables |

The remaining active `getDataTablePinnedSx` call is in body cells; it belongs to the later body migration. Historical commented-out layout experiments still exist in header files and are not active styling. No body/toolbar/pagination migration is included here. Whole-family defaultProps/variants remain part of the later 6F contract audit.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        head: { borderBlockEnd: '2px solid currentColor' },
        headerCell: { color: '#263238' },
      },
    },
  },
});
```

Sticky cells own their opaque backgrounds, so set their background through `headerCell` when changing the visible cell surface. A head background alone does not replace the cell background.

## Complete source

### src/components/DataTable/mui/styles/dataTableClasses.ts

```ts
import { generateUtilityClass, generateUtilityClasses } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME } from "./constants";

/**
 * ------------------------------------------------------------------
 * RazethDataTable utility-class registry
 * ------------------------------------------------------------------
 *
 * Slots are registered incrementally as renderer surfaces migrate to
 * the structural MUI theme architecture.
 *
 * Do NOT pre-register every possible DataTable element.
 *
 * A renderer surface joins this registry when it is actively migrated
 * to:
 *
 *   styled(..., {
 *     name: DATA_TABLE_COMPONENT_NAME,
 *     slot: "...",
 *   })
 *
 * This keeps:
 *
 * - utility classes
 * - styleOverrides keys
 * - renderer implementation
 *
 * synchronized.
 */
export const dataTableClasses = generateUtilityClasses(
  DATA_TABLE_COMPONENT_NAME,
  [
    /**
     * ============================================================
     * Global filtering
     * ============================================================
     */
    "globalFilter",

    /**
     * Utility/state classes.
     *
     * These are NOT named styled slots and therefore are excluded
     * from DataTableSlotKey below.
     */
    "globalFilterFullWidth",
    "globalFilterClearButton",

    /**
     * ============================================================
     * Filter structure
     * ============================================================
     */
    "filterRow",
    "filterCell",
    "filterIndicator",

    /**
     * ============================================================
     * Header structure
     * ============================================================
     *
     * Phase 1.7.10.6C begins the migration of the physical header
     * renderer to the same slot-based architecture already used by
     * the filter row.
     */

    /**
     * One physical TanStack header-group row.
     *
     * Future styled slot:
     *
     *   slot: "HeaderRow"
     */
    "head",
    "headerRow",

    /**
     * One physical MUI TableCell representing either:
     *
     * - a real header
     * - a TanStack placeholder header
     *
     * Future styled slot:
     *
     *   slot: "HeaderCell"
     */
    "headerCell",

    /**
     * Width-owning content wrapper immediately inside HeaderCell.
     *
     * It separates:
     *
     *   physical cell geometry
     *
     * from:
     *
     *   semantic/interactable header layout
     *
     * Future styled slot:
     *
     *   slot: "HeaderCellContent"
     */
    "headerCellContent",

    /**
     * Semantic layout surface rendered by DataTableHeaderContent.
     *
     * For centered headers this owns the frozen:
     *
     *   1fr | label | 1fr
     *
     * layout contract.
     *
     * Future styled slot:
     *
     *   slot: "HeaderContent"
     */
    "headerContent",

    /**
     * Group-header label surface.
     *
     * Future styled slot:
     *
     *   slot: "HeaderGroupLabel"
     */
    "headerGroupLabel",

    /**
     * Exact centered-label track used by the symmetric header grid.
     *
     * Sort/filter/menu controls do NOT participate in this track's
     * intrinsic width.
     *
     * Future styled slot:
     *
     *   slot: "HeaderLabelTrack"
     */
    "headerLabelTrack",

    /**
     * Trailing header affordance region containing controls such as:
     *
     * - sort indicator
     * - active-filter indicator
     * - column menu
     *
     * Future styled slot:
     *
     *   slot: "HeaderActions"
     */
    "headerActions",
    "headerLabel",
    "sortLabel",
    "sortIndicator",
    "sortButton",
    "sortIcon",
    "sortIndex",
    "columnMenuButton",
    "resizeHandle",
  ],
);

/**
 * Every generated utility class.
 *
 * This includes:
 *
 * - named styled slots
 * - state/utility classes
 */
export type DataTableClassKey = keyof typeof dataTableClasses;

/**
 * Utility classes that are NOT direct named styled slots.
 *
 * They may still be useful for state/selectors, but they do not map to:
 *
 *   theme.components.RazethDataTable.styleOverrides.<key>
 */
export type DataTableNonSlotClassKey =
  | "globalFilterFullWidth"
  | "globalFilterClearButton";

/**
 * Named structural slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
 *
 * Examples after 6C:
 *
 *   styleOverrides: {
 *     headerCell: { ... },
 *     headerContent: { ... },
 *     headerActions: { ... },
 *     filterCell: { ... },
 *   }
 */
export type DataTableSlotKey = Exclude<
  DataTableClassKey,
  DataTableNonSlotClassKey
>;

/**
 * Generate one stable RazethDataTable utility class.
 *
 * Example:
 *
 *   getDataTableUtilityClass(
 *     "headerCell",
 *   )
 *
 * produces:
 *
 *   RazethDataTable-headerCell
 */
export function getDataTableUtilityClass(slot: DataTableClassKey): string {
  return generateUtilityClass(DATA_TABLE_COMPONENT_NAME, slot);
}
```

### src/components/DataTable/mui/components/DataTableHead.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/DataTableHead.tsx

import { styled, TableHead } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { RowData } from "@tanstack/table-core";
import { useDataTableFilterDisplay } from "../filter-display";
import type { MuiDataTableInstance } from "../table";
import { DataTableFilterRow } from "./filter-row";
import { DataTableHeaderRow } from "./DataTableHeaderRow";

/** Outer header section; cells continue to own sticky geometry. */
const HeadRoot = styled(TableHead, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Head",
  overridesResolver: (_props, styles) => styles.head,
})({});

export interface DataTableHeadProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Renders the current TanStack header-groups structure.
 *
 * Grouped/nested columns may produce multiple header rows,
 * therefore we must render getHeaderGroups() rather than assuming
 * that a table has exactly one header row.
 *
 * Visibility and pinning can change which columns appear and their
 * rendered order, so we subscribe specifically to those slices.
 */
export function DataTableHead<TData extends RowData>(
  props: DataTableHeadProps<TData>,
) {
  const { table } = props;

  const { columnFilterDisplayMode, showColumnFilters } =
    useDataTableFilterDisplay();

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
      })}
    >
      {() => {
        const headerGroups = table.getHeaderGroups();

        const renderFilterRow =
          columnFilterDisplayMode === "subheader" && showColumnFilters;

        return (
          <HeadRoot className={dataTableClasses.head}>
            {headerGroups.map((headerGroup, headerRowIndex) => (
              <DataTableHeaderRow
                key={headerGroup.id}
                table={table}
                headerGroup={headerGroup}
                headerRowIndex={headerRowIndex}
              />
            ))}
            {renderFilterRow && (
              <DataTableFilterRow
                table={table}
                headerRowCount={headerGroups.length}
              />
            )}
          </HeadRoot>
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/DataTableHeaderContent.tsx

```tsx
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
    justifyContent: "flex-start",
    gap: theme.spacing(0.25),
  },

  /**
   * ==============================================================
   * Explicit right/end-style alignment
   * ==============================================================
   */
  '&[data-align="right"]': {
    display: "flex",
    justifyContent: "flex-end",
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
  color: "inherit",

  // Labels inherit the header/theme color; emphasis belongs to interaction states.

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
```

### src/components/DataTable/mui/components/headTheme.spec.tsx

```tsx
import { Table } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../accessibility";
import { DataTableDensityProvider } from "../density";
import { DataTableFilterDisplayProvider } from "../filter-display";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHead } from "./DataTableHead";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableSorting: false,
    enableResizing: false,
    meta: { headerAlign: "center", enableColumnMenu: false },
  }),
]);
const data = [{ name: "A" }];
function Fixture({ showFilters }: { showFilters: boolean }) {
  const table = useMuiDataTable({ columns, data });
  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        <DataTableFilterDisplayProvider
          columnFilterDisplayMode="subheader"
          showColumnFilters={showFilters}
        >
          <DataTableAccessibilityProvider>
            <Table>
              <DataTableHead table={table} />
            </Table>
          </DataTableAccessibilityProvider>
        </DataTableFilterDisplayProvider>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        head: { backgroundColor: "rgb(11, 22, 33)" },
        headerCell: { color: "rgb(44, 55, 66)" },
      },
    },
  },
});
it.each([false, true])(
  "themes the real head and preserves filter-row visibility: %s",
  (showFilters) => {
    render(
      <ThemeProvider theme={theme}>
        <Fixture showFilters={showFilters} />
      </ThemeProvider>,
    );
    const head = screen.getByRole("rowgroup");
    expect(head.tagName).toBe("THEAD");
    expect(head).toHaveClass(dataTableClasses.head);
    expect(head).toHaveStyle({ backgroundColor: "rgb(11, 22, 33)" });
    expect(screen.getAllByRole("row")).toHaveLength(showFilters ? 2 : 1);
    const cell = screen.getByRole("columnheader", { name: "Name" });
    expect(cell).toHaveStyle({ color: "rgb(44, 55, 66)" });
    const track = cell.querySelector(`.${dataTableClasses.headerLabelTrack}`)!;
    // Explicit inheritance keeps the slot from hard-coding an error palette color.
    expect(track).toHaveStyle({ color: "inherit" });
    expect(cell).toHaveAttribute("scope", "col");
  },
);
```

## Validation and remaining acceptance

- `npm run typecheck`: passed.
- `npm run test:datatable -- --runInBand`: **20 suites, 105 tests passed**.
- The two new cases use the real head renderer with production table, density, filter-display, and accessibility providers. They cover both hidden and visible filter rows, head style overrides, column-header semantics, and label color inheritance.
- Existing pinning, centered geometry, sorting/menu, resize, and filtering regression tests remain passing.

Live acceptance resumed successfully after sign-in and route reload. Verified keyboard resize (240 to 248px), sorting to ascending, exact centered Key label/column centers (both 185px), menu opening and Escape dismissal without changing ascending sort, filter-row keyboard opening/hiding, the ascending/descending/cleared sorting cycle, and double-click width reset. The table was restored to 240px Key width, cleared sorting, and hidden filters.

A live hit-target regression was found and fixed: the adjacent sticky header cell covered the outer half of the resize target. The 8px target now stays entirely inside its owning cell (`insetInlineEnd: 0`), and its 2px rule sits at logical inline-end. After the fix, ordinary locator-center double-click resets 248px to 240px. This supersedes the centered-over-border hit target documented in 6C.5. The corresponding geometry test was updated.

Pinned scrolling, live RTL, touch-device interaction, and the full filter-row browser matrix remain outside the completed smoke checks. The Jest coverage for these previously implemented contracts remains passing. Full browser acceptance should not be described as complete.

### Additional complete source: live hit-target fix

#### src/components/DataTable/mui/components/DataTableResizeHandle.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/DataTableResizeHandle.tsx

import { styled, useTheme } from "@mui/material";

import type { KeyboardEvent } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";

import { useMuiDataTableContext, useMuiDataTableHeaderContext } from "../table";

/** The hit target is structural; the thin rule remains its pseudo-element. */
const ResizeHandleRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ResizeHandle",
  overridesResolver: (_props, styles) => styles.resizeHandle,
})(({ theme }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  // Keep the complete hit target inside its cell so the next sticky cell cannot cover it.
  insetInlineEnd: 0,
  width: 8,
  zIndex: 5,
  cursor: "col-resize",
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  display: "block",
  "&::after": {
    content: '\"\"',
    position: "absolute",
    top: "20%",
    bottom: "20%",
    // Keep the rule at the column edge in both writing directions.
    insetInlineEnd: 0,
    width: 2,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: (theme.vars ?? theme).palette.divider,
    opacity: 0.65,
    transition: theme.transitions.create(["background-color", "opacity"], {
      duration: theme.transitions.duration.shortest,
    }),
  },
  '&[data-resizing="true"]::after, &:hover::after, &:focus-visible::after': {
    backgroundColor: (theme.vars ?? theme).palette.primary.main,
    opacity: 1,
  },
  "&:focus-visible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 1,
    borderRadius:
      typeof theme.shape.borderRadius === "number"
        ? theme.shape.borderRadius * 0.5
        : `calc(${theme.shape.borderRadius} * 0.5)`,
  },
}));

/**
 * TanStack's stock default minimum column size.
 *
 * We duplicate the numeric fallback here only because columnDef.minSize
 * is optional in the public type.
 *
 * The actual committed size is still owned and constrained by TanStack.
 */
const DEFAULT_MIN_COLUMN_SIZE = 20;

/**
 * TanStack's stock default maximum column size.
 */
const DEFAULT_MAX_COLUMN_SIZE = Number.MAX_SAFE_INTEGER;

/**
 * Normal keyboard resize increment in pixels.
 *
 * Eight pixels aligns naturally with MUI's default spacing grid.
 */
const KEYBOARD_RESIZE_STEP = 8;

/**
 * Shift + Arrow uses a larger resize increment.
 */
const KEYBOARD_RESIZE_LARGE_STEP = 32;

/**
 * Clamp a requested width to the column's configured sizing range.
 */
function clampColumnSize(
  size: number,
  minSize: number,
  maxSize: number,
): number {
  return Math.min(maxSize, Math.max(minSize, size));
}

/**
 * Keep committed keyboard sizes at a maximum of two decimal places.
 *
 * Pointer resizing can produce fractional sizes, so we deliberately
 * avoid forcing all sizes to integers.
 */
function normalizeColumnSize(size: number): number {
  return Math.round(size * 100) / 100;
}

/**
 * Resolve a human-readable column label for accessibility.
 *
 * Priority:
 *
 * 1. MUI column meta.label
 * 2. string TanStack header
 * 3. stable column id
 *
 * This mirrors the policy used by the Column Manager without creating
 * a dependency from the low-level resize handle to that component.
 */
function getResizeColumnLabel(
  column: ReturnType<typeof useMuiDataTableHeaderContext>["column"],
): string {
  const meta = column.columnDef.meta;

  if (meta?.label) {
    return meta.label;
  }

  const header = column.columnDef.header;

  if (typeof header === "string") {
    return header;
  }

  return column.id;
}

/**
 * Interactive resize handle for one leaf header.
 *
 * Pointer/touch resizing:
 *
 *   delegated entirely to TanStack's
 *   header.getResizeHandler()
 *
 * Keyboard resizing:
 *
 *   commits directly through
 *   table.setColumnSizing()
 *
 * Keyboard controls:
 *
 *   ArrowLeft / ArrowRight
 *     Resize by 8px.
 *
 *   Shift + ArrowLeft / ArrowRight
 *     Resize by 32px.
 *
 * Direction semantics are physical:
 *
 *   LTR:
 *     ArrowRight -> wider
 *     ArrowLeft  -> narrower
 *
 *   RTL:
 *     ArrowLeft  -> wider
 *     ArrowRight -> narrower
 *
 * This matches the physical movement of the logical inline-end resize
 * handle in each writing direction.
 */
export function DataTableResizeHandle() {
  const table = useMuiDataTableContext();

  const header = useMuiDataTableHeaderContext();

  const theme = useTheme();

  const column = header.column;

  /**
   * Group headers must not own independent resize handles in renderer.
   *
   * Their width is derived from their leaf columns.
   */
  const leafHeader = header.subHeaders.length === 0;

  const canResize = leafHeader && column.getCanResize();

  if (!canResize) {
    return null;
  }

  const resizeHandler = header.getResizeHandler();

  const label = getResizeColumnLabel(column);

  return (
    <table.Subscribe
      selector={(state) => ({
        /**
         * Re-render when committed widths change.
         */
        columnSizing: state.columnSizing,

        /**
         * Re-render while pointer/touch resizing begins, moves,
         * and ends.
         */
        columnResizing: state.columnResizing,
      })}
    >
      {() => {
        const size = column.getSize();

        const isResizing = column.getIsResizing();

        const minSize = column.columnDef.minSize ?? DEFAULT_MIN_COLUMN_SIZE;

        const maxSize = column.columnDef.maxSize ?? DEFAULT_MAX_COLUMN_SIZE;

        /**
         * TanStack's columnResizeDirection is already synchronized
         * with our MUI theme direction by the table setup.
         *
         * Falling back to theme.direction keeps this component safe
         * even if a lower-level consumer omits that option.
         */
        const resizeDirection =
          table.options.columnResizeDirection ?? theme.direction;

        /**
         * Commit one keyboard size adjustment.
         *
         * We intentionally do NOT touch state.columnResizing here.
         *
         * That state represents an active drag gesture:
         *
         *   startOffset
         *   startSize
         *   deltaOffset
         *   deltaPercentage
         *   columnSizingStart
         *   isResizingColumn
         *
         * A keyboard press has no corresponding drag lifecycle.
         */
        const resizeBy = (delta: number): void => {
          const currentSize = column.getSize();

          const nextSize = normalizeColumnSize(
            clampColumnSize(currentSize + delta, minSize, maxSize),
          );

          if (nextSize === currentSize) {
            return;
          }

          table.setColumnSizing((previous) => ({
            ...previous,

            [column.id]: nextSize,
          }));
        };

        const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>): void => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return;
          }

          event.preventDefault();

          event.stopPropagation();

          const step = event.shiftKey
            ? KEYBOARD_RESIZE_LARGE_STEP
            : KEYBOARD_RESIZE_STEP;

          /**
           * The handle lives on logical inline-end.
           *
           * LTR:
           *
           *     column |handle
           *
           * ArrowRight physically moves the handle outward and
           * therefore increases width.
           *
           * RTL:
           *
           *     handle| column
           *
           * ArrowLeft physically moves the handle outward and
           * therefore increases width.
           */
          const increasing =
            resizeDirection === "rtl"
              ? event.key === "ArrowLeft"
              : event.key === "ArrowRight";

          resizeBy(increasing ? step : -step);
        };

        return (
          <ResizeHandleRoot
            className={dataTableClasses.resizeHandle}
            role="separator"
            tabIndex={0}
            aria-label={`Resize ${label}`}
            aria-orientation="vertical"
            aria-valuemin={minSize}
            aria-valuemax={maxSize}
            aria-valuenow={Math.round(size)}
            aria-valuetext={`${Math.round(size)} pixels`}
            aria-keyshortcuts="ArrowLeft ArrowRight Shift+ArrowLeft Shift+ArrowRight"
            data-column-resize-handle={column.id}
            data-resizing={isResizing ? "true" : undefined}
            /**
             * TanStack owns pointer/touch resize lifecycle.
             */
            onMouseDown={resizeHandler}
            onTouchStart={resizeHandler}
            /**
             * Keyboard resizing commits directly into columnSizing.
             */
            onKeyDown={handleKeyDown}
            /**
             * Pointer users retain the familiar double-click reset.
             *
             * Keyboard users can reach the existing "Reset width"
             * action through the column menu.
             */
            onDoubleClick={(event) => {
              event.preventDefault();

              event.stopPropagation();

              column.resetSize();
            }}
          />
        );
      }}
    </table.Subscribe>
  );
}
```

#### src/components/DataTable/mui/components/resizeHandleTheme.spec.tsx

```tsx
import { Table, TableHead } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTableHeaderRow } from "./DataTableHeaderRow";

const helper = createMuiDataTableColumnHelper<{
  name: string;
  fixed: string;
}>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    size: 100,
    minSize: 80,
    maxSize: 140,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { enableColumnMenu: false },
  }),
  helper.accessor("fixed", {
    header: "Fixed",
    enableResizing: false,
    enableSorting: false,
    enableColumnFilter: false,
    meta: { enableColumnMenu: false },
  }),
]);
const data = [{ name: "A", fixed: "B" }];
function Fixture({
  direction = "ltr",
  enabled = true,
  mode = "onChange",
}: {
  direction?: "ltr" | "rtl";
  enabled?: boolean;
  mode?: "onChange" | "onEnd";
}) {
  const table = useMuiDataTable({
    columns,
    data,
    enableColumnResizing: enabled,
    columnResizeDirection: direction,
    columnResizeMode: mode,
  });
  return (
    <table.AppTable>
      <DataTableDensityProvider density="comfortable">
        <Table>
          <TableHead>
            <DataTableHeaderRow
              table={table}
              headerGroup={table.getHeaderGroups()[0]}
              headerRowIndex={0}
            />
          </TableHead>
        </Table>
      </DataTableDensityProvider>
    </table.AppTable>
  );
}
function mount(
  direction: "ltr" | "rtl" = "ltr",
  enabled = true,
  mode: "onChange" | "onEnd" = "onChange",
) {
  return render(
    <ThemeProvider
      theme={createTheme({
        direction,
        components: {
          RazethDataTable: {
            styleOverrides: {
              resizeHandle: { backgroundColor: "rgb(10, 20, 30)" },
            },
          },
        },
      })}
    >
      <Fixture direction={direction} enabled={enabled} mode={mode} />
    </ThemeProvider>,
  );
}
function handle() {
  return screen.getByRole("separator", { name: "Resize Name" });
}

describe("resize handle theme and TanStack interactions", () => {
  it("exposes the structural slot, theme override, and accessible size", () => {
    mount();
    expect(handle()).toHaveClass(dataTableClasses.resizeHandle);
    expect(handle()).toHaveStyle({
      position: "absolute",
      width: "8px",
      insetInlineEnd: "0",
      backgroundColor: "rgb(10, 20, 30)",
    });
    expect(handle()).toHaveAttribute("aria-valuenow", "100");
    expect(handle()).toHaveAttribute("aria-valuemin", "80");
    expect(handle()).toHaveAttribute("aria-valuemax", "140");
    expect(handle()).toHaveAttribute("aria-orientation", "vertical");
    expect(screen.getAllByRole("separator")).toHaveLength(1);
  });
  it("omits handles when table resizing is disabled", () => {
    mount("ltr", false);
    expect(screen.queryByRole("separator")).toBeNull();
  });
  it.each(["ltr", "rtl"] as const)(
    "preserves keyboard steps, bounds and reset in %s",
    (direction) => {
      mount(direction);
      const grow = direction === "ltr" ? "ArrowRight" : "ArrowLeft";
      const shrink = direction === "ltr" ? "ArrowLeft" : "ArrowRight";
      fireEvent.keyDown(handle(), { key: grow });
      expect(handle()).toHaveAttribute("aria-valuenow", "108");
      fireEvent.keyDown(handle(), { key: grow, shiftKey: true });
      expect(handle()).toHaveAttribute("aria-valuenow", "140");
      fireEvent.keyDown(handle(), { key: grow });
      expect(handle()).toHaveAttribute("aria-valuenow", "140");
      fireEvent.keyDown(handle(), { key: shrink, shiftKey: true });
      fireEvent.keyDown(handle(), { key: shrink, shiftKey: true });
      expect(handle()).toHaveAttribute("aria-valuenow", "80");
      expect(handle()).not.toHaveAttribute("data-resizing");
      fireEvent.doubleClick(handle());
      expect(handle()).toHaveAttribute("aria-valuenow", "100");
      fireEvent.keyDown(handle(), { key: "Enter" });
      expect(handle()).toHaveAttribute("aria-valuenow", "100");
    },
  );
  it.each(["onChange", "onEnd"] as const)(
    "delegates mouse lifecycle and %s commits to TanStack",
    (mode) => {
      mount("ltr", true, mode);
      fireEvent.mouseDown(handle(), { clientX: 100, button: 0 });
      expect(handle()).toHaveAttribute("data-resizing", "true");
      fireEvent.mouseMove(document, { clientX: 120 });
      expect(handle()).toHaveAttribute(
        "aria-valuenow",
        mode === "onChange" ? "120" : "100",
      );
      fireEvent.mouseUp(document, { clientX: 120 });
      expect(handle()).toHaveAttribute("aria-valuenow", "120");
      expect(handle()).not.toHaveAttribute("data-resizing");
    },
  );
  it("delegates touch resizing to TanStack", () => {
    mount();
    fireEvent.touchStart(handle(), { touches: [{ clientX: 100 }] });
    expect(handle()).toHaveAttribute("data-resizing", "true");
    fireEvent.touchMove(document, { touches: [{ clientX: 116 }] });
    fireEvent.touchEnd(document, {
      touches: [],
      changedTouches: [{ clientX: 116 }],
    });
    expect(handle()).toHaveAttribute("aria-valuenow", "116");
    expect(handle()).not.toHaveAttribute("data-resizing");
  });
});
```

