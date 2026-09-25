"use client";

// src/components/DataTable/mui/components/DataTableHeaderCell.tsx

import { Box, styled, TableCell, useTheme } from "@mui/material";
import type { CellData, Header, RowData } from "@tanstack/table-core";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";
import type { MuiDataTableFeatures } from "../features";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { MuiDataTableInstance } from "../table";
import { resolveTableCellAlignment } from "./alignment";
import type { DataTableHeaderCellStyle } from "./DataTableHeader.types";
import { DataTableHeaderContent } from "./DataTableHeaderContent";
import { getDataTablePinnedLayout } from "./pinning";

/**
 * ------------------------------------------------------------------
 * Density presentation
 * ------------------------------------------------------------------
 *
 * Density belongs to the finite DataTable presentation system.
 *
 * It is NOT arbitrary runtime geometry like:
 *
 * - resized width
 * - pinned offset
 * - stacked sticky-header offset
 *
 * Therefore density stays in styled slot rules rather than being
 * converted into another family of CSS variables.
 */
const compactDensity = getDataTableDensityMetrics("compact");

const comfortableDensity = getDataTableDensityMetrics("comfortable");

const spaciousDensity = getDataTableDensityMetrics("spacious");

/**
 * ------------------------------------------------------------------
 * HeaderCell structural slot
 * ------------------------------------------------------------------
 *
 * Permanent presentation belongs here.
 *
 * Runtime values are supplied through typed CSS custom properties:
 *
 *   --DataTable-column-size
 *   --DataTable-header-sticky-top
 *   --DataTable-column-pinned-offset
 *
 * Pinning direction is communicated through:
 *
 *   data-pinned="start"
 *   data-pinned="end"
 *
 * so logical CSS works in both LTR and RTL.
 */
const HeaderCellRoot = styled(TableCell, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderCell",
  overridesResolver: (_props, styles) => styles.headerCell,
})(({ theme }) => ({
  /**
   * --------------------------------------------------------------
   * Sticky header structure
   * --------------------------------------------------------------
   */
  position: "sticky",

  top: "var(--DataTable-header-sticky-top)",

  /**
   * Sticky body rows use z-index: 2.
   *
   * Header cells must therefore sit one layer above EVERY sticky body row,
   * not only when the header column itself is horizontally pinned. Otherwise
   * a selected sticky row can paint over ordinary center headers while the
   * Details/Selection/Actions pinned headers remain visible at z-index: 4,
   * producing an apparent header-height mismatch during vertical scrolling.
   */
  zIndex: 3,

  /**
   * Sticky cells must remain opaque or scrolling rows become visible
   * underneath them.
   */
  backgroundColor: (theme.vars ?? theme).palette.background.default,

  /**
   * --------------------------------------------------------------
   * Header typography
   * --------------------------------------------------------------
   */
  color: (theme.vars ?? theme).palette.text.primary,

  fontWeight: 600,

  /**
   * --------------------------------------------------------------
   * TanStack committed sizing
   * --------------------------------------------------------------
   */
  boxSizing: "border-box",

  /**
   * Header and body utility controls share one vertical alignment contract.
   *
   * This matters most for the Selection column, whose header and row
   * checkboxes should occupy the same optical center.
   */
  verticalAlign: "middle",

  width: "var(--DataTable-column-size)",
  minWidth: "var(--DataTable-column-size)",
  maxWidth: "var(--DataTable-column-size)",

  /**
   * Do NOT clip the complete physical header cell.
   *
   * Label truncation is owned farther down by the semantic label
   * renderer.
   *
   * Keeping this visible also lets:
   *
   * - resize handles
   * - menus
   * - sort indicators
   *
   * render correctly.
   */
  overflow: "visible",

  /**
   * --------------------------------------------------------------
   * Compact density
   * --------------------------------------------------------------
   */
  '&[data-density="compact"]': {
    height: `${compactDensity.headerHeight}px`,
    minHeight: `${compactDensity.headerHeight}px`,
    paddingInline: theme.spacing(compactDensity.cellPaddingInline),
    paddingBlock: theme.spacing(compactDensity.cellPaddingBlock),
    whiteSpace: compactDensity.nowrap ? "nowrap" : "normal",
  },

  /**
   * --------------------------------------------------------------
   * Comfortable density
   * --------------------------------------------------------------
   */
  '&[data-density="comfortable"]': {
    height: `${comfortableDensity.headerHeight}px`,
    minHeight: `${comfortableDensity.headerHeight}px`,
    paddingInline: theme.spacing(comfortableDensity.cellPaddingInline),
    paddingBlock: theme.spacing(comfortableDensity.cellPaddingBlock),
    whiteSpace: comfortableDensity.nowrap ? "nowrap" : "normal",
  },

  /**
   * --------------------------------------------------------------
   * Spacious density
   * --------------------------------------------------------------
   */
  '&[data-density="spacious"]': {
    height: `${spaciousDensity.headerHeight}px`,
    minHeight: `${spaciousDensity.headerHeight}px`,
    paddingInline: theme.spacing(spaciousDensity.cellPaddingInline),
    paddingBlock: theme.spacing(spaciousDensity.cellPaddingBlock),
    whiteSpace: spaciousDensity.nowrap ? "nowrap" : "normal",
  },

  /**
   * --------------------------------------------------------------
   * Pinned-header structure
   * --------------------------------------------------------------
   *
   * getDataTablePinnedLayout() remains responsible for deriving:
   *
   * - logical position
   * - offset
   * - center-boundary membership
   *
   * The renderer converts that data into CSS here.
   */
  '&[data-pinned="start"], &[data-pinned="end"]': {
    zIndex: 4,

    /**
     * Pinning must not create a second header surface.
     *
     * The base HeaderCell background is already opaque. Re-declaring
     * backgroundColor here used to beat MuiTableCell-head/theme
     * styling through selector specificity, which is why Details and
     * Actions looked lighter than the scrolling header columns.
     */
    backgroundClip: "padding-box",
  },

  /**
   * Logical positioning automatically mirrors:
   *
   * LTR:
   *   start -> left
   *
   * RTL:
   *   start -> right
   */
  '&[data-pinned="start"]': {
    insetInlineStart: "var(--DataTable-column-pinned-offset)",
  },

  /**
   * LTR:
   *   end -> right
   *
   * RTL:
   *   end -> left
   */
  '&[data-pinned="end"]': {
    insetInlineEnd: "var(--DataTable-column-pinned-offset)",
  },

  /**
   * Draw the boundary only on the pinned edge adjacent to the
   * scrolling center region.
   */
  '&[data-pinned="start"][data-pinned-boundary="true"]': {
    borderInlineEnd: "1px solid",
    borderInlineEndColor: (theme.vars ?? theme).palette.divider,
  },

  '&[data-pinned="end"][data-pinned-boundary="true"]': {
    borderInlineStart: "1px solid",
    borderInlineStartColor: (theme.vars ?? theme).palette.divider,
  },
}));

/**
 * ------------------------------------------------------------------
 * HeaderCellContent structural slot
 * ------------------------------------------------------------------
 *
 * This is the single width-owning content wrapper directly beneath
 * the physical TableCell.
 *
 * Do not reintroduce nested 100%-height chains.
 *
 * TableCell owns physical dimensions.
 * HeaderCellContent owns the inline content canvas.
 * DataTableHeaderContent owns semantic/interactable layout.
 */
const HeaderCellContentRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "HeaderCellContent",
  overridesResolver: (_props, styles) => styles.headerCellContent,
})({
  display: "flex",
  alignItems: "center",
  width: "100%",
  minWidth: 0,

  /**
   * Keep header text rhythm deterministic without globally modifying
   * arbitrary Box/Stack descendants.
   */
  lineHeight: 1.25,
});

export interface DataTableHeaderCellProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly header: Header<MuiDataTableFeatures, TData, TValue>;

  /**
   * Zero-based visual header row position.
   *
   * Used to calculate vertical sticky offsets.
   */
  readonly headerRowIndex: number;
}

/**
 * Render one physical MUI table-header cell.
 *
 * Responsibilities:
 *
 * - committed TanStack width
 * - vertical sticky offset
 * - logical pinned offset
 * - density
 * - alignment
 * - AppHeader context
 * - resize-handle placement
 *
 * Semantic/interactable header content remains delegated to:
 *
 *   DataTableHeaderContent
 */
export function DataTableHeaderCell<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableHeaderCellProps<TData, TValue>) {
  const { table, header, headerRowIndex } = props;

  const { density } = useDataTableDensity();
  const { direction } = useTheme();

  const densityMetrics = getDataTableDensityMetrics(density);

  /**
   * Every normal header row has a deterministic height.
   *
   * Therefore stacked sticky headers can derive their top offset
   * without reading DOM layout.
   */
  const stickyTop = headerRowIndex * densityMetrics.headerHeight;

  const meta = header.column.columnDef.meta;

  /**
   * --------------------------------------------------------------
   * Header alignment policy
   * --------------------------------------------------------------
   *
   * Resource/column metadata may still explicitly override alignment:
   *
   *   headerAlign
   *       ↓
   *   align
   *       ↓
   *   default center
   *
   * Body-cell alignment remains independent and may continue using the
   * column's ordinary `align` metadata.
   */
  const configuredHeaderAlign = meta?.headerAlign ?? meta?.align;

  const align =
    configuredHeaderAlign === undefined
      ? "center"
      : (resolveTableCellAlignment(configuredHeaderAlign, direction) ??
        "center");

  /**
   * Only leaf headers correspond to one concrete pinnable/resizable
   * column.
   */
  const isLeafHeader = header.subHeaders.length === 0;

  /**
   * ================================================================
   * Placeholder header
   * ================================================================
   *
   * TanStack creates placeholder headers for grouped-column layout.
   *
   * They still require a physical TableCell so table-grid geometry
   * remains intact.
   */
  if (header.isPlaceholder) {
    return (
      <table.Subscribe
        selector={(state) => ({
          columnSizing: state.columnSizing,
          columnVisibility: state.columnVisibility,
          columnPinning: state.columnPinning,
        })}
      >
        {() => {
          const size = header.getSize();

          /**
           * Group/placeholder structure itself is not pinned as one
           * independent column.
           *
           * Only concrete leaf headers participate in pinning.
           */
          const pinnedLayout = isLeafHeader
            ? getDataTablePinnedLayout(table, header.column)
            : undefined;

          const style: DataTableHeaderCellStyle = {
            "--DataTable-column-size": `${size}px`,
            "--DataTable-header-sticky-top": `${stickyTop}px`,
            "--DataTable-column-pinned-offset": pinnedLayout
              ? `${pinnedLayout.offset}px`
              : undefined,
          };

          // const pinnedSx = getDataTablePinnedSx(pinnedLayout, "header");

          return (
            <HeaderCellRoot
              className={dataTableClasses.headerCell}
              align={align}
              colSpan={header.colSpan}
              data-column-id={header.column.id}
              data-header-placeholder="true"
              data-header-leaf={isLeafHeader ? "true" : undefined}
              data-pinned={pinnedLayout?.position}
              data-pinned-boundary={pinnedLayout?.isCenterBoundary || undefined}
              data-density={density}
              style={style}
              // sx={{
              //   /**
              //    * All header cells own vertical stickiness.
              //    *
              //    * Pinned leaf headers additionally receive logical
              //    * inline positioning through pinnedSx.
              //    */
              //   position: "sticky",
              //   top: `${stickyTop}px`,
              //   zIndex: 2,
              //   backgroundColor: "background.paper",
              //   boxSizing: "border-box",
              //   width: `${size}px`,
              //   minWidth: `${size}px`,
              //   maxWidth: `${size}px`,
              //   height: `${densityMetrics.headerHeight}px`,
              //   minHeight: `${densityMetrics.headerHeight}px`,
              //   px: densityMetrics.cellPaddingInline,
              //   py: densityMetrics.cellPaddingBlock,
              //   // whiteSpace: "nowrap",
              //   // overflow: "hidden",
              //   ...pinnedSx,
              // }}
            />
          );
        }}
      </table.Subscribe>
    );
  }

  /**
   * ================================================================
   * Real header
   * ================================================================
   */
  return (
    <table.AppHeader
      header={header}
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnResizing: state.columnResizing,
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        sorting: state.sorting,
      })}
    >
      {(appHeader) => {
        /**
         * These reads stay inside the subscribed AppHeader render.
         *
         * TanStack table state may change independently of the outer
         * React component..
         */
        const size = header.getSize();

        const pinnedLayout = isLeafHeader
          ? getDataTablePinnedLayout(table, header.column)
          : undefined;

        // const pinnedSx = getDataTablePinnedSx(pinnedLayout, "header");

        const sortDirection = isLeafHeader
          ? header.column.getIsSorted()
          : false;

        const style: DataTableHeaderCellStyle = {
          "--DataTable-column-size": `${size}px`,
          "--DataTable-header-sticky-top": `${stickyTop}px`,
          "--DataTable-column-pinned-offset": pinnedLayout
            ? `${pinnedLayout.offset}px`
            : undefined,
        };

        return (
          <HeaderCellRoot
            className={dataTableClasses.headerCell}
            align={align}
            colSpan={header.colSpan}
            /**
             * Leaf headers represent columns.
             *
             * Group headers represent groups of columns.
             */
            scope={isLeafHeader ? "col" : "colgroup"}
            data-column-id={header.column.id}
            data-header-leaf={isLeafHeader ? "true" : undefined}
            data-pinned={pinnedLayout?.position}
            data-pinned-boundary={pinnedLayout?.isCenterBoundary || undefined}
            data-density={density}
            sortDirection={sortDirection}
            style={style}
            // sx={{
            //   /**
            //    * Vertically sticky for every header.
            //    *
            //    * Pinned leaf headers additionally receive logical
            //    * inline positioning through pinnedSx.
            //    */
            //   position: "sticky",
            //   top: `${stickyTop}px`,
            //   zIndex: 2,
            //   backgroundColor: "background.paper",

            //   /**
            //    * Give generic header content an explicit text color.
            //    *
            //    * Resource columns can still provide richer custom
            //    * header components later.
            //    */
            //   color: "text.primary",
            //   fontWeight: 600,

            //   /**
            //    * ----------------------------------------------------
            //    * TanStack committed width
            //    * ----------------------------------------------------
            //    */
            //   boxSizing: "border-box",
            //   width: `${size}px`,
            //   minWidth: `${size}px`,
            //   maxWidth: `${size}px`,
            //   height: `${densityMetrics.headerHeight}px`,
            //   minHeight: `${densityMetrics.headerHeight}px`,
            //   px: densityMetrics.cellPaddingInline,
            //   py: densityMetrics.cellPaddingBlock,
            //   whiteSpace: densityMetrics.nowrap ? "nowrap" : "normal",

            //   /**
            //    * IMPORTANT
            //    * ----------------------------------------------------
            //    *
            //    * Do NOT clip the complete physical cell.
            //    *
            //    * Header labels own their own text truncation.
            //    *
            //    * Leaving this visible also gives:
            //    *
            //    * - resize handles
            //    * - menus
            //    * - sort indicators
            //    *
            //    * enough room to render correctly.
            //    */
            //   overflow: "visible",

            //   /**
            //    * Pinned leaf headers override the inline sticky position and
            //    * z-index while preserving the top offset above.
            //    */
            //   ...pinnedSx,
            // }}
          >
            {/**
             * ------------------------------------------------------
             * Content layout
             * ------------------------------------------------------
             *
             * IMPORTANT:
             *
             * There is deliberately:
             *
             *   NO width: "100%"
             *   NO height: "100%"
             *
             * here.
             *
             * A normal block-level flex container automatically
             * occupies the table-cell's available inline space.
             *
             * Percentage height through a table-cell is not a stable
             * layout contract.
             */}
            <HeaderCellContentRoot
              className={dataTableClasses.headerCellContent}
            >
              <DataTableHeaderContent
                table={table}
                header={header}
                align={align}
              />
            </HeaderCellContentRoot>

            {/**
             * Only leaf headers should expose a resize handle.
             *
             * Group header width is derived from descendants and must
             * not have an independent resizing lifecycle.
             */}
            {isLeafHeader && <appHeader.ResizeHandle />}
          </HeaderCellRoot>
        );
      }}
    </table.AppHeader>
  );
}
