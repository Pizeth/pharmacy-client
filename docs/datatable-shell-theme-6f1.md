# Phase 1.7.10.6F.1 — Table shell theme slots

The outer shell, content wrapper, scrolling viewport, and native table now belong to the RazethDataTable theme family. Permanent layout moved from internal sx to styled slots. TanStack supplies runtime total width through a typed CSS variable.

| Slot | Stable class | Responsibility |
| --- | --- | --- |
| root | RazethDataTable-root | Border, background, fullscreen shell |
| content | RazethDataTable-content | Column layout below the toolbar |
| container | RazethDataTable-container | Scrolling viewport |
| table | RazethDataTable-table | Fixed table layout and total width |

## Runtime geometry and prop precedence

DataTableTableStyle extends React CSSProperties and requires `--DataTable-table-size`. A separately typed local object avoids contextual typing errors from MUI's style prop. The existing sizing/visibility subscription recalculates the visible total width after either state changes. Width and minWidth use `var(--DataTable-table-size)` in the styled table slot.

Caller tableProps and containerProps still forward to MUI. Stable classes are merged with caller classes. Caller style properties are preserved and spread after the generated variable; explicit inline width overrides continue to work. Caller sx is forwarded unchanged, including arrays and functions, and retains precedence over the styled base and theme overrides. No new resource-specific state is introduced.

Fullscreen uses the existing provider and data-fullscreen attribute. A styled attribute selector replaces the conditional sx block. Normal border radius retains the original factor of two, including support for string theme radii. Existing content flex behavior is preserved; this phase does not claim to resolve remaining live fullscreen scrolling concerns.

The intentional header label-track error.main color is preserved.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        root: { borderColor: "steelblue" },
        content: { gap: 0 },
        container: { overscrollBehaviorX: "contain" },
        table: { borderSpacing: 0 },
      },
    },
  },
});
```

## Verification

- DataTable regression suite: 32 suites, 172 tests passed.
- Project typecheck and TanStack feature synchronization passed after the typing corrections.
- git diff --check passed (existing Windows line-ending warnings only).
- New tests verify all four stable slots, theme application, caller class/style/sx precedence, live total-width changes after resize and hide, and fullscreen root geometry.
- Browser acceptance was not run in this phase. Actual fullscreen scrolling, horizontal pinning compositing, and RTL alignment still require live checks. JSDOM verifies the CSS-variable contract rather than browser layout resolution.

## Next phase

6F.2 should audit and wire the whole-table theme defaultProps contract, including precedence between explicit props, provider defaults, and theme defaults. The existing DataTableThemeProps declarations do not by themselves establish that all defaults are consumed. Variants, RTL, accessibility, and remaining browser acceptance should be tracked explicitly before closing 6F.

## Complete source snapshots

These snapshots include the accumulated class registry from earlier phases; this phase adds root, content, container, and table.

### src/components/DataTable/mui/components/DataTable.tsx

```tsx
"use client";

import { Box, Table, TableContainer, styled } from "@mui/material";
import type { TableContainerProps, TableProps } from "@mui/material";
import type { CSSProperties } from "react";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { RowData } from "@tanstack/table-core";
import { DataTableDensityProvider } from "../density";
import type { DataTableDensityConfig } from "../density";
import { DataTableFullscreenProvider } from "../fullscreen";
import type { DataTableFullscreenConfig } from "../fullscreen";
import type { MuiDataTableInstance } from "../table";
import { DataTableBody } from "./DataTableBody";
import { DataTableColumnGroup } from "./DataTableColumnGroup";
import { DataTableHead } from "./DataTableHead";
import { DataTableSelectionBar } from "./selection";
import type { DataTableSelectionBarConfig } from "./selection";
import { DataTablePagination } from "./pagination";
import type { DataTablePaginationConfig } from "./pagination";
import { DataTableShell } from "./DataTableShell";
import { DataTableRefreshingIndicator } from "./states";
import { DataTableToolbar } from "./toolbar";
import type { DataTableToolbarConfig } from "./toolbar";
import { DataTableFilterDisplayProvider } from "../filter-display";
import type { DataTableFilterDisplayConfig } from "../filter-display";
import { DataTableDetailPanelRenderer } from "./detail-panel";
import { DataTableAccessibilityProvider } from "../accessibility";

const ContentRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Content",
  overridesResolver: (_props, styles) => styles.content,
})({ display: "flex", flexDirection: "column", minWidth: 0 });

const ContainerRoot = styled(TableContainer, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Container",
  overridesResolver: (_props, styles) => styles.container,
})({ overflowX: "auto", position: "relative", flex: 1, minHeight: 0 });

const TableRoot = styled(Table, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Table",
  overridesResolver: (_props, styles) => styles.table,
})({
  tableLayout: "fixed",
  borderCollapse: "separate",
  borderSpacing: 0,
  width: "var(--DataTable-table-size)",
  minWidth: "var(--DataTable-table-size)",
});

export interface DataTableTableStyle extends CSSProperties {
  "--DataTable-table-size": string;
}

export interface DataTableProps<TData extends RowData>
  extends
    DataTableDensityConfig,
    DataTableFullscreenConfig,
    DataTableFilterDisplayConfig {
  /**
   * Table instance created by useMuiDataTable().
   *
   * We deliberately accept the completed table instance rather than
   * data/columns here.
   *
   * Table creation and table rendering are separate responsibilities.
   */
  readonly table: MuiDataTableInstance<TData>;

  /**
   * Props forwarded to MUI's <Table>.
   */
  readonly tableProps?: Omit<TableProps, "children">;

  /**
   * Props forwarded to MUI's <TableContainer>.
   */
  readonly containerProps?: Omit<TableContainerProps, "children">;

  /**
   * false:
   *   don't render the standard toolbar.
   *
   * true / undefined:
   *   render default toolbar.
   *
   * object:
   *   configure standard toolbar.
   */
  readonly toolbar?: boolean | DataTableToolbarConfig<TData>;

  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;

  /**
   * false:
   *   disable the selection status/bulk-action bar.
   *
   * undefined:
   *   no selection bar by default.
   *
   * object:
   *   render the configured selection bar whenever rows are selected.
   */
  readonly selectionBar?: false | DataTableSelectionBarConfig<TData>;

  /**
   * false disables pagination UI.
   *
   * An object customizes the pagination renderer.
   */
  readonly pagination?: false | DataTablePaginationConfig;

  /**
   * Non-blocking server/background refresh state.
   *
   * Unlike table meta.loading, this does NOT replace the current rows.
   *
   * Default: false.
   */
  readonly refreshing?: boolean;

  /**
   * Optional real background-request progress in the range 0..100.
   *
   * When omitted while `refreshing` is true, the refresh indicator uses
   * a YouTube/NProgress-style simulated trickle.
   *
   * This value is presentation-only and is never stored in TanStack
   * table state.
   */
  readonly refreshProgress?: number;
}

/**
 * MUI renderer for a fully-created MUI DataTable instance.
 *
 * Responsibilities:
 *
 * - install TanStack's AppTable context
 * - render the semantic MUI table shell
 * - delegate header rendering
 * - delegate body rendering
 *
 * It intentionally does NOT:
 *
 * - create TanStack state
 * - own table configuration
 * - own pagination
 * - own toolbar state
 * - duplicate TanStack subscriptions
 *
 * TanStack owns:
 *
 * - table state
 * - row models
 * - column widths
 * - resize state
 * - column APIs
 *
 * This component owns only the native/MUI rendering shell.
 */
export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const {
    table,
    tableProps,
    containerProps,
    toolbar = true,
    renderDetailPanel,
    refreshing = false,
    refreshProgress,
    selectionBar = false,
    pagination = {},
    density,
    defaultDensity,
    onDensityChange,
    columnFilterDisplayMode,
    defaultColumnFilterDisplayMode,
    onColumnFilterDisplayModeChange,
    showColumnFilters,
    defaultShowColumnFilters,
    onShowColumnFiltersChange,
    fullscreen,
    defaultFullscreen,
    onFullscreenChange,
  } = props;

  const toolbarConfig = typeof toolbar === "object" ? toolbar : {};

  /**
   * Keep TanStack's resize-direction calculation aligned with the MUI theme.
   *
   * Ideally this option is supplied while creating the table:
   *
   *   columnResizeDirection: theme.direction
   *
   * We do not mutate table options here because renderers should not become
   * table configuration owners.
   */
  //   const direction = theme.direction;

  return (
    <table.AppTable>
      <DataTableAccessibilityProvider>
        <DataTableDensityProvider
          density={density}
          defaultDensity={defaultDensity}
          onDensityChange={onDensityChange}
        >
          <DataTableFullscreenProvider
            fullscreen={fullscreen}
            defaultFullscreen={defaultFullscreen}
            onFullscreenChange={onFullscreenChange}
          >
            <DataTableFilterDisplayProvider
              columnFilterDisplayMode={columnFilterDisplayMode}
              defaultColumnFilterDisplayMode={defaultColumnFilterDisplayMode}
              onColumnFilterDisplayModeChange={onColumnFilterDisplayModeChange}
              showColumnFilters={showColumnFilters}
              defaultShowColumnFilters={defaultShowColumnFilters}
              onShowColumnFiltersChange={onShowColumnFiltersChange}
            >
              <DataTableShell>
                {toolbar !== false && (
                  <DataTableToolbar table={table} {...toolbarConfig} />
                )}
                <ContentRoot className={dataTableClasses.content}>
                  <DataTableRefreshingIndicator
                    refreshing={refreshing}
                    progress={refreshProgress}
                  />
                  <ContainerRoot
                    {...containerProps}
                    className={[
                      dataTableClasses.container,
                      containerProps?.className,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <table.Subscribe
                      selector={(state) => ({
                        columnSizing: state.columnSizing,
                        columnVisibility: state.columnVisibility,
                      })}
                    >
                      {() => {
                        const totalSize = table.getTotalSize();
                        const tableStyle: DataTableTableStyle = {
                          "--DataTable-table-size": `${totalSize}px`,
                          ...tableProps?.style,
                        };

                        return (
                          <TableRoot
                            {...tableProps}
                            className={[
                              dataTableClasses.table,
                              tableProps?.className,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            style={tableStyle}
                          >
                            <DataTableColumnGroup table={table} />
                            <DataTableHead table={table} />
                            <DataTableBody
                              table={table}
                              renderDetailPanel={renderDetailPanel}
                            />
                          </TableRoot>
                        );
                      }}
                    </table.Subscribe>
                  </ContainerRoot>
                  {selectionBar !== false && (
                    <DataTableSelectionBar table={table} {...selectionBar} />
                  )}
                  {pagination !== false && (
                    <DataTablePagination table={table} {...pagination} />
                  )}
                </ContentRoot>
              </DataTableShell>
            </DataTableFilterDisplayProvider>
          </DataTableFullscreenProvider>
        </DataTableDensityProvider>
      </DataTableAccessibilityProvider>
    </table.AppTable>
  );
}

```

### src/components/DataTable/mui/components/DataTableShell.tsx

```tsx
"use client";

import { Box, styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../styles";
import type { ReactNode } from "react";
import { useDataTableFullscreen } from "../fullscreen";

const ShellRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: 0,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  border: "1px solid",
  borderColor: (theme.vars ?? theme).palette.divider,
  borderRadius:
    typeof theme.shape.borderRadius === "number"
      ? theme.shape.borderRadius * 2
      : `calc(${theme.shape.borderRadius} * 2)`,
  overflow: "hidden",
  '&[data-fullscreen="true"]': {
    borderRadius: 0,
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100dvh",
    maxWidth: "100vw",
    maxHeight: "100dvh",
    zIndex: theme.zIndex.modal + 1,
  },
}));

export interface DataTableShellProps {
  readonly children: ReactNode;
}

/**
 * Outer visual shell for the high-level DataTable.
 *
 * Fullscreen applies here so toolbar, table body, and pagination
 * participate together.
 */
export function DataTableShell(props: DataTableShellProps) {
  const { children } = props;

  const { fullscreen } = useDataTableFullscreen();

  return (
    <ShellRoot
      className={dataTableClasses.root}
      data-fullscreen={fullscreen ? "true" : undefined}
    >
      {children}
    </ShellRoot>
  );
}

```

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
    "root",
    "content",
    "container",
    "table",
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
     * Toolbar / pagination
     * ============================================================
     *
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

    /**
     * ============================================================
     * Body structure
     * ============================================================
     */
    "selectionBar",
    "selectionBarDivider",
    "selectionBarStart",
    "selectionBarEnd",
    "selectionBarStatus",
    "selectionClearButton",
    "bulkActions",
    "bulkActionButton",
    "selectAllCheckbox",
    "selectRowCheckbox",
    "expandRowButton",
    "expandAllButton",
    "refreshingIndicator",
    "body",
    "bodyRow",
    "bodyCell",

    /**
     * Body-wide loading/error/empty states.
     *
     * All three state renderers share:
     *
     *   BodyStateRow
     *   BodyStateCell
     *
     * while their actual content surfaces remain independently
     * themeable.
     */
    "bodyStateRow",
    "bodyStateCell",
    "emptyState",
    "loadingState",
    "errorState",

    /**
     * ============================================================
     * Detail-panel structure
     * ============================================================
     *
     * A detail panel is a renderer-owned full-width row attached to
     * TanStack row-expansion state.
     *
     * It deliberately remains separate from ordinary:
     *
     *   bodyRow
     *   bodyCell
     *
     * because application detail content does not participate in normal
     * cell sizing, truncation, pinning or density policies.
     */
    "detailPanelRow",
    "detailPanelCell",
    "detailPanel",

    /**
     * ============================================================
     * Header structure
     * ============================================================
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

    /**
     * ============================================================
     * Header affordances
     * ============================================================
     */
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
  "globalFilterFullWidth" | "globalFilterClearButton";

/**
 * Named structural slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
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

### src/components/DataTable/mui/components/tableShellTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { dataTableClasses } from "../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { DataTable } from "./DataTable";

const helper = createMuiDataTableColumnHelper<{ id: string; name: string }>();
const columns = helper.columns([
  helper.accessor("id", { size: 100 }),
  helper.accessor("name", { size: 120 }),
]);
const data = [{ id: "a", name: "Alpha" }];
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        root: { borderTopWidth: "3px" },
        content: { paddingBottom: "5px" },
        container: { paddingTop: "7px" },
        table: { borderSpacing: "2px" },
      },
    },
  },
});
function Fixture({ fullscreen = false }: { fullscreen?: boolean }) {
  const table = useMuiDataTable({ columns, data });
  return (
    <>
      <button onClick={() => table.setColumnSizing({ id: 160 })}>Resize</button>
      <button onClick={() => table.getColumn("name")?.toggleVisibility(false)}>
        Hide name
      </button>
      <DataTable
        table={table}
        toolbar={false}
        pagination={false}
        fullscreen={fullscreen}
        tableProps={{
          className: "custom-table",
          "aria-label": "Records",
          style: { opacity: 0.9 },
          sx: [{ borderSpacing: "4px" }],
        }}
        containerProps={{
          className: "custom-container",
          sx: () => ({ paddingTop: "9px" }),
        }}
      />
    </>
  );
}
function mount(fullscreen = false) {
  return render(
    <ThemeProvider theme={theme}>
      <Fixture fullscreen={fullscreen} />
    </ThemeProvider>,
  );
}
it("themes the shell and preserves caller classes, styles, and sx precedence", () => {
  const { container } = mount();
  expect(container.querySelector(`.${dataTableClasses.root}`)).toHaveStyle({
    borderTopWidth: "3px",
  });
  expect(container.querySelector(`.${dataTableClasses.content}`)).toHaveStyle({
    paddingBottom: "5px",
  });
  const viewport = container.querySelector(`.${dataTableClasses.container}`);
  expect(viewport).toHaveClass("custom-container");
  expect(viewport).toHaveStyle({ paddingTop: "9px", overflowX: "auto" });
  const table = screen.getByRole("table", { name: "Records" });
  expect(table).toHaveClass(dataTableClasses.table, "custom-table");
  expect(table).toHaveStyle({
    opacity: "0.9",
    borderSpacing: "4px",
    tableLayout: "fixed",
  });
});
it("updates total-width geometry through a CSS variable on resize and visibility changes", () => {
  mount();
  const table = screen.getByRole("table", { name: "Records" });
  expect(table.style.getPropertyValue("--DataTable-table-size")).toBe("220px");
  fireEvent.click(screen.getByRole("button", { name: "Resize" }));
  expect(table.style.getPropertyValue("--DataTable-table-size")).toBe("280px");
  fireEvent.click(screen.getByRole("button", { name: "Hide name" }));
  expect(table.style.getPropertyValue("--DataTable-table-size")).toBe("160px");
});
it("applies fullscreen geometry to the shared outer root", () => {
  const { container } = mount(true);
  const root = container.querySelector(`.${dataTableClasses.root}`);
  expect(root).toHaveAttribute("data-fullscreen", "true");
  expect(root).toHaveStyle({
    position: "fixed",
    width: "100vw",
    borderRadius: "0",
    zIndex: String(theme.zIndex.modal + 1),
  });
});

```

