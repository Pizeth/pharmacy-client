# Phase 1.7.10.6F.5 � Direction-aware alignment

Logical column alignment now follows the MUI theme direction. This phase also performed live fullscreen acceptance against the authenticated TranslationKey page.

## Alignment contract

| Metadata | LTR | RTL |
| --- | --- | --- |
| start / body default | left | right |
| end | right | left |
| center | center | center |
| unconfigured header | center | center |

The helper accepts direction as a second argument, defaulting to ltr for existing callers. HeaderCell and BodyCell read the active theme direction. Header metadata precedence is unchanged: headerAlign, then align, then centered fallback. The native MUI align prop receives the resolved physical value.

HeaderContent needs a separate adjustment: flex-start follows document direction while the incoming alignment is physical. In RTL, physical right therefore uses flex-start and physical left uses flex-end. Without this step, fixing the mapping alone would reverse edge headers twice. The centered three-track grid remains unchanged, as does the intentional header label error.main color.

DataTableShell now sets dir from theme.direction. This synchronizes native table flow, logical sticky positioning, and flex/grid direction with the alignment mapping. A theme change updates the existing cells without remounting the table or replacing TanStack state.

## Configuration

```tsx
const rtlTheme = createTheme({ direction: "rtl" });

<ThemeProvider theme={rtlTheme}>
  <DataTable table={table} />
</ThemeProvider>
```

Column metadata remains logical:

```tsx
helper.accessor("name", {
  header: "Name",
  meta: { align: "start", headerAlign: "center" },
});
```

This patch targets the repository's current Emotion/MUI pipeline, which does not configure a Stylis RTL transform. It does not establish compatibility with a separately installed RTL CSS-flipping plugin: that pipeline must be tested to avoid double-flipping physical text alignment. Standalone low-level renderer consumers must supply matching DOM direction as well as theme direction; the high-level DataTable handles its own shell. Portals do not inherit the shell's DOM direction and remain part of the wider RTL audit. TanStack resize direction remains table-creation configuration and must match the chosen direction.

## Validation

- Typecheck and TanStack feature synchronization passed.
- 36 suites / 190 tests passed.
- git diff --check passed, with Windows line-ending warnings.
- New tests cover LTR/RTL body alignment, edge headers, centered/default headers, direction switching without remount, and helper compatibility.

## Live acceptance on localhost:8080/admin/i18n

The route initially redirected to login; the authenticated session subsequently became available.

- Fullscreen entry passed.
- The shell height matched the 856px viewport.
- The scrolling container had 601px client height and 1557px scroll height.
- Pagination bottom was 757px, inside the viewport.
- Escape in the Key column menu closed the menu while keeping fullscreen active.
- Escape from the fullscreen action exited fullscreen.
- The table was returned to inline mode without changing filters, sorting, or column configuration.

The live application remained LTR. RTL browser geometry, actual end-to-end scrolling, narrow viewport behavior, portal direction, and sticky selected/hover background compositing remain unverified. These measured checks are not a claim that the entire 6F acceptance matrix is complete.

## Next phase

6F.6: finish sticky-cell background compositing and the remaining RTL/browser acceptance work before closing the presentation foundation. Do not begin resource CRUD on an assumed fully verified table.

## Complete changed source

### src/components/DataTable/mui/components/alignment.ts

```ts
import type { TableCellProps } from "@mui/material";
import type { MuiDataTableAlignment } from "../meta";

/** Resolve logical metadata to MUI's physical alignment in the theme direction. */
export function resolveTableCellAlignment(
  alignment: MuiDataTableAlignment | undefined,
  direction: "ltr" | "rtl" = "ltr",
): TableCellProps["align"] {
  if (alignment === "center") return "center";
  if (alignment === "end") return direction === "rtl" ? "left" : "right";
  return direction === "rtl" ? "right" : "left";
}

```

### src/components/DataTable/mui/components/DataTableBodyCell.tsx

```tsx
"use client";

import { styled, TableCell, useTheme } from "@mui/material";
import type { CSSProperties } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { Cell, CellData, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { resolveTableCellAlignment } from "./alignment";
import { getDataTablePinnedLayout } from "./pinning";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";

export interface DataTableBodyCellStyle extends CSSProperties {
  readonly "--DataTable-column-size": string;
  readonly "--DataTable-column-pinned-offset"?: string;
}

const BodyCellRoot = styled(TableCell, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BodyCell",
  overridesResolver: (_props, styles) => styles.bodyCell,
})(({ theme }) => ({
  boxSizing: "border-box",
  width: "var(--DataTable-column-size)",
  minWidth: "var(--DataTable-column-size)",
  maxWidth: "var(--DataTable-column-size)",
  overflow: "hidden",
  ...Object.fromEntries(
    (["compact", "comfortable", "spacious"] as const).map((density) => {
      const metrics = getDataTableDensityMetrics(density);
      return [
        `&[data-density="${density}"]`,
        {
          height: metrics.nowrap ? `${metrics.bodyRowHeight}px` : undefined,
          minHeight: `${metrics.bodyRowHeight}px`,
          paddingInline: theme.spacing(metrics.cellPaddingInline),
          paddingBlock: theme.spacing(metrics.cellPaddingBlock),
          whiteSpace: metrics.nowrap ? "nowrap" : "normal",
          textOverflow: metrics.nowrap ? "ellipsis" : undefined,
        },
      ];
    }),
  ),
  '&[data-pinned="start"], &[data-pinned="end"]': {
    position: "sticky",
    zIndex: 1,
    backgroundColor: "var(--DataTable-row-background)",
    backgroundClip: "padding-box",
  },
  '&[data-pinned="start"]': {
    insetInlineStart: "var(--DataTable-column-pinned-offset)",
  },
  '&[data-pinned="end"]': {
    insetInlineEnd: "var(--DataTable-column-pinned-offset)",
  },
  '&[data-pinned="start"][data-pinned-boundary="true"]': {
    borderInlineEnd: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  },
  '&[data-pinned="end"][data-pinned-boundary="true"]': {
    borderInlineStart: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  },
}));

export interface DataTableBodyCellProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly cell: Cell<MuiDataTableFeatures, TData, TValue>;
}

/**
 * Render one body cell.
 *
 * AppCell performs two important jobs:
 *
 * 1. provides TanStack's cell context
 * 2. exposes the context-bound FlexRender helper
 *
 * We deliberately do not directly call:
 *
 *   cell.getValue()
 *
 * because that would bypass custom columnDef.cell rendering.
 */
export function DataTableBodyCell<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableBodyCellProps<TData, TValue>) {
  const { table, cell } = props;

  const { density } = useDataTableDensity();
  const { direction } = useTheme();

  const meta = cell.column.columnDef.meta;

  const align = resolveTableCellAlignment(meta?.align, direction);

  return (
    <table.AppCell
      cell={cell}
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
      })}
    >
      {(appCell) => {
        /**
         * These reads belong inside the subscribed child render.
         */
        const size = cell.column.getSize();

        const pinnedLayout = getDataTablePinnedLayout(table, cell.column);

        const style: DataTableBodyCellStyle = {
          "--DataTable-column-size": `${size}px`,
          "--DataTable-column-pinned-offset": pinnedLayout
            ? `${pinnedLayout.offset}px`
            : undefined,
        };

        return (
          <BodyCellRoot
            className={dataTableClasses.bodyCell}
            align={align}
            data-column-id={cell.column.id}
            data-pinned={pinnedLayout?.position}
            data-pinned-boundary={pinnedLayout?.isCenterBoundary || undefined}
            data-density={density}
            style={style}
          >
            <appCell.FlexRender />
          </BodyCellRoot>
        );
      }}
    </table.AppCell>
  );
}

```

### src/components/DataTable/mui/components/DataTableHeaderCell.tsx

```tsx
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
  zIndex: 2,

  /**
   * Sticky cells must remain opaque or scrolling rows become visible
   * underneath them.
   */
  backgroundColor: (theme.vars ?? theme).palette.background.paper,

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
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
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

```

### src/components/DataTable/mui/components/DataTableShell.tsx

```tsx
"use client";

import { Box, styled, useTheme } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { ReactNode } from "react";
import { useDataTableFullscreen } from "../fullscreen";
import type { DataTableOwnerState } from "../theme";

/**
 * ------------------------------------------------------------------
 * Root structural slot
 * ------------------------------------------------------------------
 *
 * The shared structural ownerState deliberately contains only stable
 * visual variant state.
 *
 * Mutable fullscreen state remains represented through:
 *
 *   data-fullscreen
 *
 * rather than being duplicated into ownerState.
 */
const ShellRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{
  readonly ownerState: DataTableOwnerState;
}>(({ theme, ownerState }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: 0,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,

  /**
   * ============================================================
   * Built-in visual variants
   * ============================================================
   *
   * `outlined` preserves the exact pre-6F.3 shell appearance.
   *
   * `plain` removes only outer chrome.
   *
   * Neither variant modifies:
   *
   * - table state
   * - toolbar behavior
   * - header/body behavior
   * - density
   * - pagination
   * - selection
   */
  ...(ownerState.variant === "outlined"
    ? {
        border: "1px solid",
        borderColor: (theme.vars ?? theme).palette.divider,
        borderRadius:
          typeof theme.shape.borderRadius === "number"
            ? theme.shape.borderRadius * 2
            : `calc(${theme.shape.borderRadius} * 2)`,
      }
    : {
        border: 0,
        borderRadius: 0,
      }),

  overflow: "hidden",
  boxSizing: "border-box",

  /**
   * ============================================================
   * Mutable fullscreen state
   * ============================================================
   *
   * This remains provider-owned runtime state rather than variant
   * ownerState.
   */
  '&[data-fullscreen="true"]': {
    borderRadius: 0,
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100dvh",
    maxWidth: "100vw",
    maxHeight: "100dvh",
    zIndex: theme.zIndex.modal + 1,
    [`& > .${dataTableClasses.content}`]: {
      flex: "1 1 0%",
      minHeight: 0,
      overflow: "hidden",
      [`& > :not(.${dataTableClasses.container})`]: { flexShrink: 0 },
    },
    [`& > .${dataTableClasses.toolbar}`]: { flexShrink: 0 },
  },
}));

export interface DataTableShellProps {
  readonly children: ReactNode;

  /**
   * Shared styling state resolved by DataTable.
   *
   * This is intentionally not the full DataTable props object.
   */
  readonly ownerState: DataTableOwnerState;
}

/**
 * Outer visual shell for the high-level DataTable.
 *
 * Fullscreen applies here so:
 *
 * - toolbar
 * - table body
 * - selection bar
 * - pagination
 *
 * participate together.
 */
export function DataTableShell(props: DataTableShellProps) {
  const { children, ownerState } = props;
  const { direction } = useTheme();

  const { fullscreen, setFullscreen } = useDataTableFullscreen();

  return (
    <ShellRoot
      dir={direction}
      ownerState={ownerState}
      className={dataTableClasses.root}
      /**
       * Stable debugging/theme selector for the resolved public
       * visual variant.
       *
       * The actual `variant` prop itself is NOT forwarded to the DOM.
       */
      data-variant={ownerState.variant}
      data-fullscreen={fullscreen ? "true" : undefined}
      onKeyDown={(event) => {
        // Respect nested controls that consume Escape (menus, popovers, inputs).
        // Ignore portal events: their DOM target is outside this shell.
        if (
          fullscreen &&
          event.key === "Escape" &&
          !event.defaultPrevented &&
          event.currentTarget.contains(event.target as Node)
        ) {
          event.preventDefault();
          event.stopPropagation();
          setFullscreen(false);
        }
      }}
    >
      {children}
    </ShellRoot>
  );
}

```

### src/components/DataTable/mui/components/rtlAlignment.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { DataTable } from "./DataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { dataTableClasses } from "../styles";
import { resolveTableCellAlignment } from "./alignment";

const helper = createMuiDataTableColumnHelper<{
  start: string;
  end: string;
  center: string;
  fallback: string;
}>();
const columns = helper.columns([
  helper.accessor("start", { header: "Start", meta: { align: "start" } }),
  helper.accessor("end", { header: "End", meta: { align: "end" } }),
  helper.accessor("center", { header: "Center", meta: { align: "center" } }),
  helper.accessor("fallback", { header: "Default" }),
]);
const data = [{ start: "S", end: "E", center: "C", fallback: "F" }];
function Fixture({ direction }: { direction: "ltr" | "rtl" }) {
  const table = useMuiDataTable({ columns, data });
  return (
    <ThemeProvider theme={createTheme({ direction })}>
      <DataTable table={table} toolbar={false} pagination={false} />
    </ThemeProvider>
  );
}
it.each(["ltr", "rtl"] as const)(
  "resolves logical cell and header alignment in %s",
  (direction) => {
    const { container } = render(<Fixture direction={direction} />);
    expect(
      container.querySelector(`.${dataTableClasses.root}`),
    ).toHaveAttribute("dir", direction);
    const start = direction === "rtl" ? "right" : "left";
    const end = direction === "rtl" ? "left" : "right";
    expect(screen.getByRole("cell", { name: "S" })).toHaveStyle({
      textAlign: start,
    });
    expect(screen.getByRole("cell", { name: "E" })).toHaveStyle({
      textAlign: end,
    });
    expect(screen.getByRole("cell", { name: "C" })).toHaveStyle({
      textAlign: "center",
    });
    expect(screen.getByRole("cell", { name: "F" })).toHaveStyle({
      textAlign: start,
    });
    for (const [id, physical, justifyContent] of [
      ["start", start, "flex-start"],
      ["end", end, "flex-end"],
    ]) {
      const header = container.querySelector(`th[data-column-id="${id}"]`)!;
      expect(header).toHaveStyle({ textAlign: physical });
      const content = header.querySelector(
        `.${dataTableClasses.headerContent}`,
      );
      expect(content).toHaveAttribute("data-align", physical);
      expect(content).toHaveStyle({ justifyContent });
    }
    for (const id of ["center", "fallback"]) {
      const content = container.querySelector(
        `th[data-column-id="${id}"] .${dataTableClasses.headerContent}`,
      );
      expect(content).toHaveAttribute("data-align", "center");
      expect(content).toHaveStyle({
        gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
      });
    }
  },
);
it("updates direction on an existing table without a remount", () => {
  const view = render(<Fixture direction="ltr" />);
  const cell = screen.getByRole("cell", { name: "S" });
  view.rerender(<Fixture direction="rtl" />);
  expect(screen.getByRole("cell", { name: "S" })).toBe(cell);
  expect(cell).toHaveStyle({ textAlign: "right" });
  view.rerender(<Fixture direction="ltr" />);
  expect(cell).toHaveStyle({ textAlign: "left" });
});
it("keeps the helper's default direction compatible with existing LTR callers", () => {
  expect(resolveTableCellAlignment(undefined)).toBe("left");
  expect(resolveTableCellAlignment("end")).toBe("right");
  expect(resolveTableCellAlignment("center", "rtl")).toBe("center");
});

```

