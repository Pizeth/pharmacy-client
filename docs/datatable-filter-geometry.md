# Phase 1.7.10.6B.3 — Filter CSS-variable geometry

The filter row and filter cell no longer contain `sx`. Their named styled slots
own all permanent presentation. TanStack and density metrics supply only runtime
measurements through a typed React style object.

## Runtime contract

| CSS variable | Source | Consumed by |
| --- | --- | --- |
| `--DataTable-column-size` | `column.getSize()` | width, minWidth, maxWidth |
| `--DataTable-filter-sticky-top` | header row count × density header height | top |
| `--DataTable-filter-cell-height` | max(40, density header height − 4) | height |
| `--DataTable-column-pinned-offset` | TanStack start/after offset | logical inline inset |

`DataTableFilterCellStyle` extends React's CSSProperties with explicit pixel-valued
custom properties. A separately typed variable avoids React's contextual excess
property check on a JSX style literal without using a cast or broad string index.
The type is exported through the filter-row barrel.

```tsx
const style: DataTableFilterCellStyle = {
  "--DataTable-column-size": `${size}px`,
  "--DataTable-filter-sticky-top": `${stickyTop}px`,
  "--DataTable-filter-cell-height": `${Math.max(40, densityMetrics.headerHeight - 4)}px`,
  "--DataTable-column-pinned-offset": pinnedLayout
    ? `${pinnedLayout.offset}px`
    : undefined,
};

// Measurements stay inline; CSS rules are resolved by the styled slot.
// <FilterCellRoot style={style} ... />
```

## Static presentation and pinning

FilterRow owns its paper background. FilterCell owns sticky positioning, sizing
rules, box sizing, vertical alignment, overflow, and input minimum widths. MUI
spacing is resolved explicitly using `theme.spacing(0.75)` horizontally and
`theme.spacing(0.5)` vertically. Palette values use `(theme.vars ?? theme).palette`
so the styled rules receive actual CSS colors or theme variables.

The cell still uses the existing `getDataTablePinnedLayout` function. It no longer
calls `getDataTablePinnedSx`; that helper remains unchanged for the other renderers.
The existing `data-pinned` attribute selects start/end rules, and
`data-pinned-boundary="true"` selects the logical border adjacent to the center.
Ordinary filter cells keep z-index 3; pinned cells keep z-index 4 and padding-box
background clipping. Logical insets and borders preserve the LTR/RTL model.

When unpinned, the attribute and offset variable are removed. No stale physical
left/right offsets are stored. TanStack remains responsible for calculating all
pinning offsets. The subscriptions still update committed sizing, pinning, and
filter state; the parent row continues to subscribe to visibility and ordering.

Non-filterable columns retain a styled, aria-hidden placeholder with the original
full width and 32px minimum height. Its span uses display:block to preserve the
previous Box layout behavior.

## Theme overrides now take precedence

Local `sx` no longer overrides permanent row/cell presentation. For example:

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        filterRow: { backgroundColor: "#f5f7fa" },
        filterCell: {
          backgroundColor: "#f5f7fa",
          paddingInline: "10px",
          paddingBlock: "6px",
          '&[data-pinned="start"][data-pinned-boundary="true"]': {
            borderInlineEndWidth: "2px",
          },
        },
      },
    },
  },
});
```

State-specific pinning selectors have greater specificity than plain root rules;
use matching selectors when overriding those state-specific styles. Runtime
variables remain inline, keeping table measurements synchronized with TanStack.
Custom header heights must stay consistent with density metrics to preserve the
existing stacked-header offset calculation.

## Verification

Typechecking and TanStack feature synchronization passed. The DataTable suite
passed 62 tests across 9 suites. New coverage checks live resizing, start/end
pinning offsets and boundaries, unpin cleanup, both theme directions, and density
and header-depth changes. The existing structural test now verifies overrides of
background and padding, which were previously controlled by local sx.

These tests use real TanStack controls, semantic attributes, and explicit CSS
variables; they do not assert generated Emotion classes. JSDOM does not establish
actual sticky scroll rendering or physical RTL layout. Browser acceptance remains
scheduled for 6B.6.

## Complete source

The source snapshot below contains every file changed in this phase.

### src/components/DataTable/mui/components/filter-row/types.ts

```tsx
import type { CSSProperties } from "react";

/** Runtime measurements only; permanent presentation belongs to styled slots. */
export interface DataTableFilterCellStyle extends CSSProperties {
  "--DataTable-column-size": `${number}px`;
  "--DataTable-filter-sticky-top": `${number}px`;
  "--DataTable-filter-cell-height": `${number}px`;
  "--DataTable-column-pinned-offset"?: `${number}px`;
}

```

### src/components/DataTable/mui/components/filter-row/index.ts

```tsx
// src/components/DataTable/mui/components/filter-row/index.ts

export * from "./DataTableFilterCell";
export * from "./DataTableFilterRow";
export type { DataTableFilterCellStyle } from "./types";

```

### src/components/DataTable/mui/components/filter-row/DataTableFilterRow.tsx

```tsx
// src/components/DataTable/mui/components/filter-row/DataTableFilterRow.tsx

"use client";

import { styled, TableRow } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";
import type { MuiDataTableInstance } from "../../table";
import { DataTableFilterCell } from "./DataTableFilterCell";
import { useDataTableAccessibility } from "../../accessibility";

export interface DataTableFilterRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;

  /**
   * Number of normal header rows rendered above the filter row.
   */
  readonly headerRowCount: number;
}

const FilterRowRoot = styled(TableRow, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterRow",
  overridesResolver: (_props, styles) => styles.filterRow,
})(({ theme }) => ({
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
}));

/**
 * Dedicated column-filter subheader row.
 *
 * Uses visible leaf columns rather than header groups because each
 * filter belongs to one concrete leaf column.
 */
export function DataTableFilterRow<TData extends RowData>(
  props: DataTableFilterRowProps<TData>,
) {
  const { table, headerRowCount } = props;

  const { filterRowId } = useDataTableAccessibility();

  const { density } = useDataTableDensity();

  const densityMetrics = getDataTableDensityMetrics(density);

  const stickyTop = headerRowCount * densityMetrics.headerHeight;

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
      })}
    >
      {() => {
        const columns = table.getVisibleLeafColumns();

        return (
          <FilterRowRoot
            className={dataTableClasses.filterRow}
            id={filterRowId}
            data-filter-row="true"
            aria-label="Column filters"
          >
            {columns.map((column) => (
              <DataTableFilterCell
                key={column.id}
                table={table}
                column={column}
                stickyTop={stickyTop}
              />
            ))}
          </FilterRowRoot>
        );
      }}
    </table.Subscribe>
  );
}

```

### src/components/DataTable/mui/components/filter-row/DataTableFilterCell.tsx

```tsx
// src/components/DataTable/mui/components/filter-row/DataTableFilterCell.tsx

"use client";

import { styled, TableCell } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";
import type { MuiDataTableInstance } from "../../table";
import { getDataTablePinnedLayout } from "../pinning";
import { DataTableColumnFilter } from "../filtering";
import type { DataTableFilterCellStyle } from "./types";

export interface DataTableFilterCellProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;

  /**
   * Vertical sticky offset of the filter row.
   *
   * The filter row sits immediately below all normal header rows.
   */
  readonly stickyTop: number;
}

const FilterCellRoot = styled(TableCell, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterCell",
  overridesResolver: (_props, styles) => styles.filterCell,
})(({ theme }) => ({
  position: "sticky",
  top: "var(--DataTable-filter-sticky-top)",
  zIndex: 3,
  backgroundColor: (theme.vars ?? theme).palette.background.paper,
  boxSizing: "border-box",
  width: "var(--DataTable-column-size)",
  minWidth: "var(--DataTable-column-size)",
  maxWidth: "var(--DataTable-column-size)",
  height: "var(--DataTable-filter-cell-height)",
  paddingInline: theme.spacing(0.75),
  paddingBlock: theme.spacing(0.5),
  verticalAlign: "middle",
  overflow: "visible",
  "& .MuiFormControl-root, & .MuiInputBase-root": { minWidth: 0 },

  // Pinning remains logical, so these rules work in both LTR and RTL.
  '&[data-pinned="start"], &[data-pinned="end"]': {
    zIndex: 4,
    backgroundClip: "padding-box",
  },
  '&[data-pinned="start"]': {
    insetInlineStart: "var(--DataTable-column-pinned-offset)",
  },
  '&[data-pinned="end"]': {
    insetInlineEnd: "var(--DataTable-column-pinned-offset)",
  },
  '&[data-pinned="start"][data-pinned-boundary="true"]': {
    borderInlineEnd: "1px solid",
    borderInlineEndColor: (theme.vars ?? theme).palette.divider,
  },
  '&[data-pinned="end"][data-pinned-boundary="true"]': {
    borderInlineStart: "1px solid",
    borderInlineStartColor: (theme.vars ?? theme).palette.divider,
  },
}));

// Structural blank content keeps non-filterable columns in the table grid.
const FilterCellPlaceholder = styled("span")({
  display: "block",
  width: "100%",
  minHeight: 32,
});

/**
 * Renders one leaf-column cell in the optional filter subheader row.
 *
 * Responsibilities of this component:
 *
 * - preserve column sizing
 * - preserve sticky header positioning
 * - preserve logical start/end pinning
 * - render a structural blank cell for non-filterable columns
 * - mount the existing DataTableColumnFilter renderer
 *
 * It deliberately does NOT know anything about filter-value shapes.
 *
 * Text, number, range, boolean, select, date, etc. belong to
 * DataTableColumnFilter and its specialized editors.
 */
export function DataTableFilterCell<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableFilterCellProps<TData, TValue>) {
  const { table, column, stickyTop } = props;

  const { density } = useDataTableDensity();

  const densityMetrics = getDataTableDensityMetrics(density);

  return (
    <table.Subscribe
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnPinning: state.columnPinning,
        columnFilters: state.columnFilters,
      })}
    >
      {() => {
        const size = column.getSize();

        const pinnedLayout = getDataTablePinnedLayout(table, column);
        const canFilter = column.getCanFilter();

        const style: DataTableFilterCellStyle = {
          "--DataTable-column-size": `${size}px`,
          "--DataTable-filter-sticky-top": `${stickyTop}px`,
          "--DataTable-filter-cell-height": `${Math.max(40, densityMetrics.headerHeight - 4)}px`,
          "--DataTable-column-pinned-offset": pinnedLayout
            ? `${pinnedLayout.offset}px`
            : undefined,
        };

        return (
          <FilterCellRoot
            className={dataTableClasses.filterCell}
            data-filter-column-id={column.id}
            data-pinned={pinnedLayout?.position}
            data-density={density}
            data-pinned-boundary={pinnedLayout?.isCenterBoundary || undefined}
            style={style}
          >
            {canFilter ? (
              <DataTableColumnFilter column={column} />
            ) : (
              /**
               * Never remove an unfilterable column's structural
               * cell.
               *
               * Expansion, selection, actions, and any ordinary
               * column with enableColumnFilter=false must still
               * occupy their normal table-grid position.
               */
              <FilterCellPlaceholder aria-hidden="true" />
            )}
          </FilterCellRoot>
        );
      }}
    </table.Subscribe>
  );
}

```

### src/components/DataTable/mui/components/filter-row/filterStructureTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { DataTableDensityProvider } from "../../density";
import type { MuiDataTableDensity } from "../../density";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { dataTableClasses } from "../../styles";
import { DataTableFilterRow } from "./DataTableFilterRow";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([
  helper.accessor("name", {
    header: "Name",
    enableColumnFilter: true,
    meta: { filterVariant: "text", filterLabel: "Name" },
  }),
  helper.display({ id: "actions", enableColumnFilter: false }),
]);
const data = [{ name: "Example" }];

function FilterStructure({ density = "comfortable", headerRowCount = 1 }: {
  density?: MuiDataTableDensity;
  headerRowCount?: number;
}) {
  const table = useMuiDataTable({ columns, data });
  return (
    <DataTableAccessibilityProvider>
      <DataTableDensityProvider density={density}>
        <button onClick={() => table.setColumnSizing({ name: 240, actions: 80 })}>Resize</button>
        <button onClick={() => table.setColumnPinning({ start: ["name", "actions"], end: [] })}>Pin start</button>
        <button onClick={() => table.setColumnPinning({ start: [], end: ["name", "actions"] })}>Pin end</button>
        <button onClick={() => table.setColumnPinning({ start: [], end: [] })}>Unpin</button>
        <table>
          <thead>
            <DataTableFilterRow table={table} headerRowCount={headerRowCount} />
          </thead>
        </table>
      </DataTableDensityProvider>
    </DataTableAccessibilityProvider>
  );
}

it("applies family overrides to the real filter row and retains non-filterable grid cells", () => {
  const theme = createTheme({
    components: {
      RazethDataTable: {
        styleOverrides: {
          filterRow: { backgroundColor: "rgb(10, 20, 30)" },
          filterCell: { backgroundColor: "rgb(30, 20, 10)", paddingInline: "12px" },
        },
      },
    },
  });
  render(<ThemeProvider theme={theme}><FilterStructure /></ThemeProvider>);
  const row = screen.getByRole("row", { name: "Column filters" });
  expect(row).toHaveClass(dataTableClasses.filterRow);
  expect(row).toHaveStyle({ backgroundColor: "rgb(10, 20, 30)" });
  expect(row.children).toHaveLength(2);
  for (const cell of Array.from(row.children)) {
    expect(cell).toHaveClass(dataTableClasses.filterCell);
    expect(cell).toHaveStyle({ backgroundColor: "rgb(30, 20, 10)", paddingInline: "12px" });
  }
  expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  const actionsCell = row.querySelector('[data-filter-column-id="actions"]');
  expect(actionsCell?.firstElementChild).toHaveAttribute("aria-hidden", "true");
  expect(actionsCell?.querySelector("input")).toBeNull();
});

it.each(["ltr", "rtl"] as const)("updates sizing and logical pin geometry in %s", (direction) => {
  render(<ThemeProvider theme={createTheme({ direction })}><FilterStructure /></ThemeProvider>);
  const row = screen.getByRole("row", { name: "Column filters" });
  const nameCell = row.querySelector<HTMLElement>('[data-filter-column-id="name"]')!;
  const actionsCell = row.querySelector<HTMLElement>('[data-filter-column-id="actions"]')!;
  fireEvent.click(screen.getByRole("button", { name: "Resize" }));
  expect(nameCell.style.getPropertyValue("--DataTable-column-size")).toBe("240px");
  expect(actionsCell.style.getPropertyValue("--DataTable-column-size")).toBe("80px");

  fireEvent.click(screen.getByRole("button", { name: "Pin start" }));
  expect(actionsCell.style.getPropertyValue("--DataTable-column-pinned-offset")).toBe("240px");
  expect(actionsCell).toHaveAttribute("data-pinned-boundary", "true");
  expect(nameCell).not.toHaveAttribute("data-pinned-boundary");
  expect(actionsCell).toHaveStyle({ insetInlineStart: "var(--DataTable-column-pinned-offset)", zIndex: "4" });

  fireEvent.click(screen.getByRole("button", { name: "Pin end" }));
  expect(nameCell.style.getPropertyValue("--DataTable-column-pinned-offset")).toBe("80px");
  expect(nameCell).toHaveAttribute("data-pinned-boundary", "true");
  expect(actionsCell).not.toHaveAttribute("data-pinned-boundary");
  expect(nameCell).toHaveStyle({ insetInlineEnd: "var(--DataTable-column-pinned-offset)" });

  fireEvent.click(screen.getByRole("button", { name: "Unpin" }));
  expect(nameCell).not.toHaveAttribute("data-pinned");
  expect(nameCell).not.toHaveAttribute("data-pinned-boundary");
  expect(nameCell.style.getPropertyValue("--DataTable-column-pinned-offset")).toBe("");
  expect(nameCell).toHaveStyle({ zIndex: "3" });
});

it("updates sticky geometry when density or header depth changes", () => {
  const { rerender } = render(<FilterStructure density="compact" headerRowCount={2} />);
  const cell = screen.getByRole("row", { name: "Column filters" }).firstElementChild as HTMLElement;
  expect(cell.style.getPropertyValue("--DataTable-filter-sticky-top")).toBe("80px");
  expect(cell.style.getPropertyValue("--DataTable-filter-cell-height")).toBe("40px");
  rerender(<FilterStructure density="spacious" headerRowCount={3} />);
  expect(cell.style.getPropertyValue("--DataTable-filter-sticky-top")).toBe("216px");
  expect(cell.style.getPropertyValue("--DataTable-filter-cell-height")).toBe("68px");
});

```
