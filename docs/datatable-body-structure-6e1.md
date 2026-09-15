# Phase 1.7.10.6E.1 — Body and row structural slots

## Result

Two slots join the existing RazethDataTable family: `body` and `bodyRow`. Their utility classes are `RazethDataTable-body` and `RazethDataTable-bodyRow`. Both have explicit overridesResolver mappings; the registry-derived slot type extends theme augmentation automatically.

The Body slot wraps MUI TableBody in every existing rendering branch: error, loading, empty, and populated. Error/loading precedence, filter-aware empty content, minimum colSpan of one, and TanStack's final row-model rendering remain unchanged. State-row and detail-panel internals are not migrated here.

The BodyRow slot wraps MUI TableRow. The existing selected/hover CSS custom-property values move from dynamic sx into styled rules. `data-selected` derives directly from the existing rowSelection subscription. Finite density states determine minimum row height using the existing metrics. No additional row state or effect is introduced.

The row-background variable remains `--DataTable-row-background`, preserving the body-cell dependency on it. Existing alpha-based selection colors and hover colors are unchanged; this migration does not establish that pinned-cell compositing is opaque. That requires separate verification with the body-cell migration.

The row continues to render the existing visible-cell model and custom AppCell/FlexRender content. Column width, pinning, padding, and cell overflow remain together for 6E.2. The intentional error.main header-label accent is unchanged.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        body: { borderBlockEnd: '1px solid #ddd' },
        bodyRow: {
          '&[data-density="compact"]': { minHeight: 32 },
          '&[data-selected="true"]': {
            '--DataTable-row-background': '#e3f2fd',
          },
        },
      },
    },
  },
});
```

The variable is consumed by pinned body cells. MUI TableRow still owns its standard hover/selected background rules; changing the variable alone is not a replacement for customizing every visible row background.

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

### src/components/DataTable/mui/components/DataTableBody.tsx

```tsx
"use client";

import { styled, TableBody } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../table";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import {
  DataTableEmptyState,
  DataTableErrorState,
  DataTableLoadingState,
} from "./states";
import { normalizeDataTableGlobalFilter } from "../utils";
import { DataTableDetailPanelRenderer } from "./detail-panel";
import { DataTableBodyRowGroup } from "./DataTableBodyRowGroup";

const BodyRoot = styled(TableBody, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Body",
  overridesResolver: (_props, styles) => styles.body,
})({});

export interface DataTableBodyProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;
}

/**
 * Render the table's final row model.
 *
 * We intentionally use:
 *
 *   table.getRowModel()
 *
 * rather than:
 *
 *   table.getCoreRowModel()
 *
 * because getRowModel() represents the final TanStack row-model pipeline:
 *
 * core
 *   -> filtering
 *   -> sorting
 *   -> pagination
 *   -> ...
 *
 * depending on the registered feature family and manual-mode options.
 */
export function DataTableBody<TData extends RowData>(
  props: DataTableBodyProps<TData>,
) {
  const { table, renderDetailPanel } = props;

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        pagination: state.pagination,
        sorting: state.sorting,
        columnFilters: state.columnFilters,
        globalFilter: state.globalFilter,
        expanded: state.expanded,
      })}
    >
      {(selected) => {
        const rows = table.getRowModel().rows;

        const visibleColumnCount = table.getVisibleLeafColumns().length;

        /**
         * Guard against an invalid colSpan=0.
         *
         * In practice at least one visible column should normally remain,
         * but the renderer should still produce valid markup if every
         * hideable column becomes hidden.
         */
        const colSpan = Math.max(1, visibleColumnCount);

        const meta = table.options.meta;

        const globalFilter = normalizeDataTableGlobalFilter(
          selected.globalFilter,
        );

        const hasActiveFilters =
          selected.columnFilters.length > 0 ||
          normalizeDataTableGlobalFilter(selected.globalFilter).length > 0;

        if (meta?.error) {
          return (
            <BodyRoot className={dataTableClasses.body}>
              <DataTableErrorState colSpan={colSpan}>
                {meta.error}
              </DataTableErrorState>
            </BodyRoot>
          );
        }

        if (meta?.loading) {
          return (
            <BodyRoot className={dataTableClasses.body}>
              <DataTableLoadingState colSpan={colSpan}>
                {meta.loadingContent}
              </DataTableLoadingState>
            </BodyRoot>
          );
        }

        if (rows.length === 0) {
          return (
            <BodyRoot className={dataTableClasses.body}>
              <DataTableEmptyState
                colSpan={colSpan}
                filtered={hasActiveFilters}
              >
                {hasActiveFilters ? meta?.noResultsContent : meta?.emptyContent}
              </DataTableEmptyState>
            </BodyRoot>
          );
        }

        return (
          <BodyRoot className={dataTableClasses.body}>
            {rows.map((row) => (
              <DataTableBodyRowGroup
                key={row.id}
                table={table}
                row={row}
                renderDetailPanel={renderDetailPanel}
              />
            ))}
          </BodyRoot>
        );
      }}
    </table.Subscribe>
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

### src/components/DataTable/mui/components/bodyStructureTheme.spec.tsx

```tsx
import { Table } from "@mui/material";
import { alpha, createTheme, ThemeProvider } from "@mui/material/styles";
import { act, render, screen } from "@testing-library/react";
import {
  DataTableDensityProvider,
  getDataTableDensityMetrics,
} from "../density";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import type { MuiDataTableInstance } from "../table";
import { DataTableBody } from "./DataTableBody";

type Row = { name: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    cell: (info) => `Cell: ${info.getValue()}`,
  }),
]);
const data = [{ name: "alpha" }];
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        body: { backgroundColor: "rgb(10, 20, 30)" },
        bodyRow: { borderTopWidth: "3px" },
      },
    },
  },
});
function mount(
  state: "data" | "empty" | "loading" | "error" = "data",
  density: "compact" | "comfortable" | "spacious" = "comfortable",
) {
  let table!: MuiDataTableInstance<Row>;
  function Fixture() {
    table = useMuiDataTable({
      columns,
      data: state === "empty" ? [] : data,
      meta: {
        loading: state === "loading",
        error: state === "error" ? "Unavailable" : undefined,
      },
    });
    return (
      <table.AppTable>
        <DataTableDensityProvider density={density}>
          <Table>
            <DataTableBody table={table} />
          </Table>
        </DataTableDensityProvider>
      </table.AppTable>
    );
  }
  const result = render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );
  return { ...result, getTable: () => table };
}
it.each(["data", "empty", "loading", "error"] as const)(
  "themes the tbody in the %s branch",
  (state) => {
    mount(state);
    const body = screen.getByRole("rowgroup");
    expect(body.tagName).toBe("TBODY");
    expect(body).toHaveClass(dataTableClasses.body);
    expect(body).toHaveStyle({ backgroundColor: "rgb(10, 20, 30)" });
    if (state === "data")
      expect(screen.getByRole("cell", { name: "Cell: alpha" })).toBeVisible();
    if (state === "error")
      expect(screen.getByText("Unavailable")).toBeVisible();
  },
);
it.each(["compact", "comfortable", "spacious"] as const)(
  "preserves %s row height and row overrides",
  (density) => {
    const { container } = mount("data", density);
    expect(container.querySelector(`.${dataTableClasses.bodyRow}`)).toHaveStyle(
      {
        minHeight: `${getDataTableDensityMetrics(density).bodyRowHeight}px`,
        borderTopWidth: "3px",
      },
    );
  },
);
it("derives selected row appearance from TanStack without replacing cell rendering", () => {
  const { container, getTable } = mount();
  const row = container.querySelector(`.${dataTableClasses.bodyRow}`)!;
  expect(
    getComputedStyle(row).getPropertyValue("--DataTable-row-background"),
  ).toBe(theme.palette.background.paper);
  act(() => getTable().setRowSelection({ "0": true }));
  expect(row).toHaveAttribute("data-selected", "true");
  expect(row).toHaveClass("Mui-selected");
  expect(
    getComputedStyle(row).getPropertyValue("--DataTable-row-background"),
  ).toBe(
    alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
  );
  expect(screen.getByRole("cell", { name: "Cell: alpha" })).toBeVisible();
  act(() => getTable().setRowSelection({}));
  expect(row).not.toHaveAttribute("data-selected");
});
```

## Validation

- npm run typecheck: passed, including feature synchronization.
- npm run test:datatable -- --runInBand: **25 suites, 133 tests passed**.
- Eight new cases cover the four body branches, three density heights, selection/deselection, named overrides, and custom cell rendering.

No live-browser verification was performed for this phase. The existing RTL, touch, pinned-scrolling, and complete responsive acceptance gaps remain pending. This is the first body migration step, not completion of 6E.

Next: **6E.2 — body-cell slot, typed width/pinning CSS variables, and alignment/visibility verification**.
