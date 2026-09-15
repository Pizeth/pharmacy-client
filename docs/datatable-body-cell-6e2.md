# Phase 1.7.10.6E.2 — Body-cell slots and typed runtime geometry

## Changes

`DataTableBodyCell` now uses a named `BodyCell` styled MUI TableCell under `RazethDataTable`, with the stable `RazethDataTable-bodyCell` class and explicit `styleOverrides.bodyCell` mapping. The registry-derived slot type automatically extends MUI augmentation.

The former static and dynamic `sx` object is removed. Permanent width rules, density padding, overflow, pin positioning, layering and boundary borders live in the slot. TanStack supplies only two typed custom properties through `DataTableBodyCellStyle`:

```tsx
const style: DataTableBodyCellStyle = {
  "--DataTable-column-size": `${size}px`,
  "--DataTable-column-pinned-offset": pinnedLayout
    ? `${pinnedLayout.offset}px`
    : undefined,
};
```

`data-pinned` selects logical start/end positioning. `data-pinned-boundary` selects the border facing the scrolling center. Clearing pinning removes the offset rather than retaining stale geometry. Density remains a finite themed state selected by `data-density`.

## Subscription correction

The cell now subscribes to column visibility and order in addition to sizing and pinning. Those inputs affect visible pinned boundaries. The row now subscribes to column order as well as visibility and pinning so reordered visible cells update without remounting the row. TanStack still calculates every size/offset and supplies the visible-cell sequence.

The cell still renders through AppCell and its context-bound FlexRender helper. Custom resource renderers are preserved; no direct replacement with cell.getValue is introduced. No local geometry state or synchronization effect is added.

## Preserved contracts and limits

- Width, minWidth and maxWidth use the same column-size variable.
- Density heights, padding, whitespace and ellipsis policy are unchanged.
- Pinned cells retain z-index 1, padding-box background clipping and the row-background custom property.
- Logical start/end pinning and center-boundary borders are preserved.
- The current body alignment helper still maps start to physical left and end to physical right. This phase preserves that behavior; it does not claim to complete RTL text-alignment policy.
- Row hover/selection background values remain unchanged. The earlier alpha-compositing/opacity caveat for pinned backgrounds remains pending visual verification.
- The intentional error.main header-label accent remains unchanged.
- The old getDataTablePinnedSx helper is no longer called by the body cell. Its definition is retained rather than removed as an unrelated compatibility cleanup.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        bodyCell: {
          fontSize: '0.875rem',
          '&[data-density="compact"]': { paddingBlock: 4 },
          '&[data-pinned="start"][data-pinned-boundary="true"]': {
            borderInlineEndColor: '#90caf9',
          },
        },
      },
    },
  },
});
```

Use matching state selectors when overriding density/pinning rules. Leave runtime width/offset values under TanStack ownership unless deliberately replacing the table sizing contract.

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
    "toolbarSearch",
    "toolbar",
    "toolbarSelection",
    "pagination",
    "paginationDivider",
    "paginationControls",
    "paginationStatus",
    "paginationActions",
    "paginationButton",
    "pageSize",
    "pageSizeLabel",
    "pageSizeSelect",

    "toolbarActions",
    "toolbarFilterStatus",
    "searchToggleButton",
    "filterToggleButton",
    "densityButton",
    "fullscreenButton",
    "columnManagerButton",

    "toolbarRow",
    "toolbarStart",
    "toolbarCenter",
    "toolbarEnd",
    "toolbarSearchRow",
    "body",
    "bodyRow",
    "bodyCell",
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

### src/components/DataTable/mui/components/DataTableBodyCell.tsx

```tsx
"use client";

import { styled, TableCell } from "@mui/material";
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

  const meta = cell.column.columnDef.meta;

  const align = resolveTableCellAlignment(meta?.align);

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

### src/components/DataTable/mui/components/DataTableBodyRow.tsx

```tsx
"use client";

import { alpha, styled, TableRow } from "@mui/material";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyCell } from "./DataTableBodyCell";
import { getDataTableDensityMetrics, useDataTableDensity } from "../density";

const BodyRowRoot = styled(TableRow, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BodyRow",
  overridesResolver: (_props, styles) => styles.bodyRow,
})(({ theme }) => {
  const selectedBackground = alpha(
    theme.palette.primary.main,
    theme.palette.action.selectedOpacity,
  );
  const selectedHoverBackground = alpha(
    theme.palette.primary.main,
    Math.min(
      1,
      theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
    ),
  );
  return {
    "--DataTable-row-background": theme.palette.background.paper,
    "&:hover": { "--DataTable-row-background": theme.palette.action.hover },
    '&[data-selected="true"]': {
      "--DataTable-row-background": selectedBackground,
      "&:hover": { "--DataTable-row-background": selectedHoverBackground },
    },
    ...Object.fromEntries(
      (["compact", "comfortable", "spacious"] as const).map((density) => [
        `&[data-density="${density}"]`,
        { minHeight: `${getDataTableDensityMetrics(density).bodyRowHeight}px` },
      ]),
    ),
  };
});

export interface DataTableBodyRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
}

/**
 * Render a single TanStack row.
 *
 * We intentionally use row.getVisibleCells().
 *
 * The column-visibility feature therefore remains the authority over
 * which cells appear in the rendered row.
 *
 * The row background is communicated through a CSS variable.
 *
 * Pinned cells need a solid background so horizontally scrolling
 * cells cannot show through underneath them. Using a row-level CSS
 * variable lets pinned cells still participate in row hover behavior.
 */
export function DataTableBodyRow<TData extends RowData>(
  props: DataTableBodyRowProps<TData>,
) {
  const { table, row } = props;

  const { density } = useDataTableDensity();

  return (
    <table.Subscribe
      source={table.atoms.rowSelection}
      selector={(rowSelection) => Boolean(rowSelection?.[row.id])}
    >
      {(selected) => (
        <BodyRowRoot
          className={dataTableClasses.bodyRow}
          hover
          selected={selected}
          data-row-id={row.id}
          data-selected={selected ? "true" : undefined}
          data-density={density}
        >
          <table.Subscribe
            selector={(state) => ({
              columnVisibility: state.columnVisibility,
              columnOrder: state.columnOrder,
              columnPinning: state.columnPinning,
            })}
          >
            {() =>
              row
                .getVisibleCells()
                .map((cell) => (
                  <DataTableBodyCell key={cell.id} table={table} cell={cell} />
                ))
            }
          </table.Subscribe>
        </BodyRowRoot>
      )}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/bodyCellTheme.spec.tsx

```tsx
import { Table } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, render, screen } from "@testing-library/react";
import { DataTableDensityProvider } from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import type { MuiDataTableInstance } from "../table";
import { DataTableBody } from "./DataTableBody";

type Row = { a: string; b: string; c: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  helper.accessor("a", { size: 100, meta: { align: "start" } }),
  helper.accessor("b", { size: 120, meta: { align: "center" } }),
  helper.accessor("c", { size: 140, meta: { align: "end" } }),
]);
const data = [{ a: "A", b: "B", c: "C" }];
function mount(direction: "ltr" | "rtl" = "ltr") {
  let table!: MuiDataTableInstance<Row>;
  function Fixture() {
    table = useMuiDataTable({ columns, data });
    return (
      <table.AppTable>
        <DataTableDensityProvider density="comfortable">
          <Table>
            <DataTableBody table={table} />
          </Table>
        </DataTableDensityProvider>
      </table.AppTable>
    );
  }
  const result = render(
    <ThemeProvider
      theme={createTheme({
        direction,
        components: {
          RazethDataTable: {
            styleOverrides: { bodyCell: { color: "rgb(10, 20, 30)" } },
          },
        },
      })}
    >
      <Fixture />
    </ThemeProvider>,
  );
  return { ...result, getTable: () => table };
}
function cell(name: string) {
  return screen.getByRole("cell", { name });
}
it("themes the cell and preserves width variables and physical alignment", () => {
  const { getTable } = mount();
  expect(cell("A")).toHaveClass(dataTableClasses.bodyCell);
  expect(cell("A")).toHaveStyle({
    color: "rgb(10, 20, 30)",
    textAlign: "left",
  });
  expect(cell("B")).toHaveStyle({ textAlign: "center" });
  expect(cell("C")).toHaveStyle({ textAlign: "right" });
  expect(cell("A").style.getPropertyValue("--DataTable-column-size")).toBe(
    "100px",
  );
  expect(cell("A").style.width).toBe("");
  act(() => getTable().setColumnSizing({ a: 160 }));
  expect(cell("A").style.getPropertyValue("--DataTable-column-size")).toBe(
    "160px",
  );
});
it.each(["ltr", "rtl"] as const)(
  "updates logical pin offsets and boundaries in %s",
  (direction) => {
    const { getTable } = mount(direction);
    act(() => getTable().setColumnPinning({ start: ["a", "b"], end: ["c"] }));
    expect(
      cell("B").style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("100px");
    expect(cell("B")).toHaveAttribute("data-pinned-boundary", "true");
    expect(cell("A")).not.toHaveAttribute("data-pinned-boundary");
    expect(cell("B")).toHaveStyle({
      position: "sticky",
      insetInlineStart: "var(--DataTable-column-pinned-offset)",
    });
    expect(cell("C")).toHaveStyle({
      insetInlineEnd: "var(--DataTable-column-pinned-offset)",
    });
    act(() => getTable().setColumnSizing({ a: 160 }));
    expect(
      cell("B").style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("160px");
    act(() => getTable().setColumnVisibility({ b: false }));
    expect(screen.queryByRole("cell", { name: "B" })).toBeNull();
    expect(cell("A")).toHaveAttribute("data-pinned-boundary", "true");
    act(() => getTable().setColumnPinning({ start: [], end: [] }));
    expect(cell("A")).not.toHaveAttribute("data-pinned");
    expect(
      cell("A").style.getPropertyValue("--DataTable-column-pinned-offset"),
    ).toBe("");
  },
);
it("reacts to column ordering without remounting the row", () => {
  const { getTable } = mount();
  act(() => getTable().setColumnOrder(["c", "a", "b"]));
  expect(screen.getAllByRole("cell").map((node) => node.textContent)).toEqual([
    "C",
    "A",
    "B",
  ]);
});
```

## Validation

- `npm run typecheck`: passed, including TanStack feature synchronization.
- `npm run test:datatable -- --runInBand`: **26 suites, 137 tests passed**.
- New cases verify the theme override, typed width updates, physical text alignment, logical start/end pinning under LTR and RTL themes, resized offsets, visibility-dependent boundary markers, offset removal on unpin, and live column-order updates.

These are Jest/jsdom integration tests with real TanStack instances. They do not establish actual browser sticky scrolling, RTL placement, or opaque hover/selection compositing. Live-browser acceptance remains pending.

Next: **6E.3 — loading/error/empty state structural slots**, followed by detail-panel and selection-control surfaces in bounded steps.
