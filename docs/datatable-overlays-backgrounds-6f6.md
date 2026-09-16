# Phase 1.7.10.6F.6 — Fullscreen overlays and pinned backgrounds

## Fullscreen menu bug

The fullscreen shell used theme.zIndex.modal + 1. MUI Menu, Popover, and Select menus portal into the modal layer, so they could exist and accept keyboard focus while being painted behind the table. Previous checks confirmed menu existence and Escape behavior but did not test visual occlusion. This phase adds actual pointer hit-testing to live acceptance.

The fullscreen shell now uses theme.zIndex.modal - 1. With this application's default scale, fullscreen is 1299 and modal overlays are 1300. This fixes the common cause for density menus, column menus, the column manager, and MUI select menus without per-menu z-index patches. Ordinary drawers/app bars remain below fullscreen on the standard MUI scale. Custom theme overrides must preserve this relative order; a fullscreen table inside an unrelated transformed ancestor or nested modal still needs separate verification.

## Pinned background compositing

The inherited --DataTable-row-background can be translucent for hover and selection. A translucent pinned background allows horizontally scrolling cell content to bleed through. Pinned cells now paint that value as a constant-color linear gradient over an underlying palette.background.paper color:

```tsx
backgroundColor: (theme.vars ?? theme).palette.background.paper,
backgroundImage:
  "linear-gradient(var(--DataTable-row-background), var(--DataTable-row-background))",
```

The gradient retains the existing row-state variable, while paper supplies the solid base. This avoids duplicating TanStack selection state or calculating colors in JavaScript. It also lets the paper color use the existing CSS-variable palette. Themes intentionally providing translucent paper must provide an opaque pinned-cell base if they require full occlusion.

## Verification

- Typecheck and TanStack feature synchronization passed.
- 36 suites / 192 tests passed.
- New regression tests assert the density modal is above fullscreen, density selection still updates cells, and pinned cells retain a paper base when selected.
- Live density menu: modal 1300 versus table 1299; elementFromPoint at menu center belongs to the menu. Clicking Compact changed the actual body-cell density while keeping fullscreen active.
- Live column menu: center hit-test belongs to menu.
- Live column manager: modal 1300 and center hit-test belongs to dialog.
- Restored Comfortable density, closed popovers, and exited fullscreen.

The shared stacking fix covers MUI modal-based overlays; not every individual select was exercised live. RTL browser layout and selected/hover sticky-cell compositing during actual horizontal scrolling remain acceptance gaps. The current app remains LTR. No claim is made that all presentation acceptance is complete.

## Remaining phase

6F.7 should close the remaining RTL, narrow-screen, and scrolling acceptance matrix with an explicit browser fixture, then decide whether the presentation foundation is ready for TranslationKey CRUD. The intentional header error.main remains unchanged.

## Complete changed files

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
    // Fullscreen is below portaled MUI menus, popovers, and dialogs.
    zIndex: theme.zIndex.modal - 1,
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
    // Paint the state tint over paper, never over scrolling cell content.
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
    backgroundImage:
      "linear-gradient(var(--DataTable-row-background), var(--DataTable-row-background))",
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
    zIndex: String(theme.zIndex.modal - 1),
  });
});

```

### src/components/DataTable/mui/components/fullscreenInteraction.spec.tsx

```tsx
import { createPortal } from "react-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTable } from "./DataTable";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { dataTableClasses } from "../styles";
import type { DataTableVariant } from "../theme";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", {})]);
const data = [{ name: "Alpha" }];
function Fixture({
  controlled,
  onChange,
  variant = "outlined",
}: {
  controlled?: boolean;
  onChange?: (value: boolean) => void;
  variant?: DataTableVariant;
}) {
  const table = useMuiDataTable({ columns, data });
  return (
    <ThemeProvider theme={createTheme()}>
      <button>Outside</button>
      <DataTable
        table={table}
        variant={variant}
        fullscreen={controlled}
        defaultFullscreen
        onFullscreenChange={onChange}
        toolbar={{
          search: false,
          enableColumnManager: false,
          enableDensity: true,
          startContent: (
            <>
              <button
                onKeyDown={(event) => {
                  if (event.key === "Escape") event.preventDefault();
                }}
              >
                Consumes Escape
              </button>
              {createPortal(<button>Portal control</button>, document.body)}
            </>
          ),
        }}
      />
    </ThemeProvider>
  );
}
function root(container: HTMLElement) {
  return container.querySelector(`.${dataTableClasses.root}`)!;
}
it("exits uncontrolled fullscreen on Escape and keeps focus on the mounted action", () => {
  const onChange = jest.fn();
  const { container } = render(<Fixture onChange={onChange} />);
  const button = screen.getByRole("button", { name: "Exit fullscreen table" });
  button.focus();
  fireEvent.keyDown(button, { key: "Escape" });
  expect(root(container)).not.toHaveAttribute("data-fullscreen");
  expect(onChange).toHaveBeenCalledWith(false);
  expect(
    screen.getByRole("button", { name: "Enter fullscreen table" }),
  ).toHaveFocus();
  fireEvent.keyDown(button, { key: "Escape" });
  expect(onChange).toHaveBeenCalledTimes(1);
});
it("requests a controlled exit without changing owner-controlled state", () => {
  const onChange = jest.fn();
  const view = render(<Fixture controlled onChange={onChange} />);
  fireEvent.keyDown(
    screen.getByRole("button", { name: "Exit fullscreen table" }),
    { key: "Escape" },
  );
  expect(onChange).toHaveBeenCalledWith(false);
  expect(root(view.container)).toHaveAttribute("data-fullscreen", "true");
  view.rerender(<Fixture controlled={false} onChange={onChange} />);
  expect(root(view.container)).not.toHaveAttribute("data-fullscreen");
});
it("does not intercept consumed, portal, outside, or unrelated keyboard events", () => {
  const onChange = jest.fn();
  const { container } = render(<Fixture onChange={onChange} />);
  for (const name of ["Consumes Escape", "Portal control", "Outside"])
    fireEvent.keyDown(screen.getByRole("button", { name }), { key: "Escape" });
  fireEvent.keyDown(
    screen.getByRole("button", { name: "Exit fullscreen table" }),
    { key: "Enter" },
  );
  expect(onChange).not.toHaveBeenCalled();
  expect(root(container)).toHaveAttribute("data-fullscreen", "true");
});
it.each(["outlined", "plain"] as const)(
  "contains fullscreen layout for the %s variant",
  (variant) => {
    const { container } = render(<Fixture variant={variant} />);
    expect(root(container)).toHaveStyle({
      boxSizing: "border-box",
      height: "100dvh",
    });
    expect(container.querySelector(`.${dataTableClasses.content}`)).toHaveStyle(
      { flex: "1 1 0%", minHeight: "0", overflow: "hidden" },
    );
    expect(container.querySelector(`.${dataTableClasses.toolbar}`)).toHaveStyle(
      { flexShrink: "0" },
    );
    expect(
      container.querySelector(`.${dataTableClasses.pagination}`),
    ).toHaveStyle({ flexShrink: "0" });
    fireEvent.click(
      screen.getByRole("button", { name: "Exit fullscreen table" }),
    );
    expect(
      container.querySelector(`.${dataTableClasses.content}`),
    ).not.toHaveStyle({ overflow: "hidden" });
    expect(root(container)).toHaveAttribute("data-variant", variant);
  },
);

it("keeps the density menu modal above the fullscreen shell", () => {
  const { container } = render(<Fixture />);
  fireEvent.click(screen.getByRole("button", { name: "Change table density" }));
  const menu = screen.getByRole("menu", { name: "Table density" });
  const modal = menu.closest(".MuiModal-root")!;
  expect(Number(getComputedStyle(modal).zIndex)).toBeGreaterThan(
    Number(getComputedStyle(root(container)).zIndex),
  );
  fireEvent.click(screen.getByRole("menuitem", { name: "Compact" }));
  expect(
    container.querySelector(`.${dataTableClasses.bodyCell}`),
  ).toHaveAttribute("data-density", "compact");
  expect(root(container)).toHaveAttribute("data-fullscreen", "true");
});

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

it("paints pinned state tints over a solid paper base", () => {
  const { getTable } = mount();
  act(() => getTable().setColumnPinning({ start: ["a"], end: [] }));
  expect(cell("A")).toHaveStyle({
    backgroundColor: "rgb(255, 255, 255)",
    backgroundImage:
      "linear-gradient(var(--DataTable-row-background), var(--DataTable-row-background))",
  });
  act(() => getTable().setRowSelection({ "0": true }));
  expect(cell("A")).toHaveStyle({ backgroundColor: "rgb(255, 255, 255)" });
});

```

