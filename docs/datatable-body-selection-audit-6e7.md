# Phase 1.7.10.6E.7 � Body/selection source audit and targeted fixes

## Audit outcome

The audit found two concrete remaining items: the background refresh indicator still used local sx, and the selection bar resolved every selected ID through an unconditional row lookup even when server pagination had not loaded that row.

The existing 6E body/row/cell, state, detail-panel, selection-bar, checkbox and expansion-trigger slots remain intact. This phase does not change the intentional error.main header accent.

## Background-refresh slot

`refreshingIndicator` joins RazethDataTable with a stable class and explicit overridesResolver. It wraps the existing LinearProgress. The fixed 2px reserved height, flexShrink, opacity transition and bar-transform transition move to styled rules. Existing aria-hidden drives visibility; no second visible state is added.

The progress hook is unchanged. Real request progress and simulated trickle retain their existing labels, completion behavior and delayed hiding. Idle visibility remains hidden rather than display:none, preserving layout height.

## Off-page selection fix

The selected-row resolver now reads `table.getCoreRowModel().rowsById` and returns only loaded rows. It does not invent records or erase unavailable IDs. Selection context maintains these distinct meanings:

| Field | Meaning |
| --- | --- |
| selectedRowIds | All selected IDs, including unavailable off-page records |
| selectedCount | Count of selected IDs |
| selectedRows | Selected rows available in the currently loaded core model |

For server bulk actions, use selectedRowIds. A selectedRows-based operation sees only loaded records; applications requiring complete record data must obtain it themselves or disable the action until available. This contract is now documented in the public context type. Existing action callbacks and clear-selection behavior remain unchanged.

The previous unconditional table.getRow lookup is removed. The core model preserves loaded rows that filtering or client pagination may hide, while naturally omitting data that server pagination has never loaded. No independent row cache or data-fetching behavior is introduced.

## Remaining acceptance

Source searches found no active sx in the audited states, detail-panel, selection and utility-control folders. The remaining matches are commented-out historical code. Body row/cell migration was completed in prior phases.

This is not whole-table visual acceptance. Live RTL, touch, pinned scrolling, selected/hover pinned-background compositing, responsive layout and the full interaction matrix remain pending. Existing physical body-text alignment and utility-control subscription behavior were not redesigned here. Page/data-transition coverage is not implied by the loaded-row selection test.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        refreshingIndicator: {
          borderRadius: 2,
          '& .MuiLinearProgress-bar': { backgroundColor: '#1565c0' },
        },
      },
    },
  },
});
```

Keep the reserved height when styling progress if layout stability is required. The component already controls accessibility visibility and progress values.

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
  | "globalFilterFullWidth"
  | "globalFilterClearButton";

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

### src/components/DataTable/mui/components/states/DataTableRefreshingIndicator.tsx

```tsx
// src/components/DataTable/mui/components/states/DataTableRefreshingIndicator.tsx

"use client";

import { LinearProgress, styled } from "@mui/material";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import { useDataTableRefreshingProgress } from "./useDataTableRefreshingProgress";

const RefreshingIndicatorRoot = styled(LinearProgress, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "RefreshingIndicator",
  overridesResolver: (_props, styles) => styles.refreshingIndicator,
})(({ theme }) => ({
  height: 2,
  flexShrink: 0,
  opacity: 1,
  visibility: "visible",
  '&[aria-hidden="true"]': { opacity: 0, visibility: "hidden" },
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
  "& .MuiLinearProgress-bar": {
    transition: "transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
}));

export interface DataTableRefreshingIndicatorProps {
  /**
   * Whether background/server refreshing is active.
   */
  readonly refreshing: boolean;

  /**
   * Optional REAL request progress.
   *
   * Range:
   *
   *   0 .. 100
   *
   * When omitted, DataTable uses its simulated trickle behavior.
   */
  readonly progress?: number;
}

/**
 * Non-blocking top progress indicator for server/background refreshes.
 *
 * This intentionally behaves more like YouTube/NProgress than a
 * traditional indeterminate LinearProgress:
 *
 *   start quickly
 *   ↓
 *   progressively slow down
 *   ↓
 *   never fake 100%
 *   ↓
 *   actual refresh completes
 *   ↓
 *   finish at 100%
 *   ↓
 *   disappear
 *
 * When actual request progress is available, the same component
 * becomes a true determinate indicator.
 *
 * Unlike the full loading state, this does not replace existing table
 * rows.
 */
export function DataTableRefreshingIndicator(
  props: DataTableRefreshingIndicatorProps,
) {
  const { refreshing, progress } = props;

  const { visible, value, determinate } = useDataTableRefreshingProgress({
    refreshing,
    progress,
  });

  return (
    <RefreshingIndicatorRoot
      className={dataTableClasses.refreshingIndicator}
      variant="determinate"
      value={value}
      aria-label={determinate ? "Loading table data" : "Refreshing table data"}
      aria-hidden={!visible}
      aria-valuetext={
        visible
          ? determinate
            ? `${Math.round(value)}% loaded`
            : "Refreshing table data"
          : undefined
      }
    />
  );
}
```

### src/components/DataTable/mui/components/states/refreshingIndicatorTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, render, screen } from "@testing-library/react";
import { dataTableClasses } from "../../styles";
import { DataTableRefreshingIndicator } from "./DataTableRefreshingIndicator";
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        refreshingIndicator: { borderRadius: "7px" },
      },
    },
  },
});
function indicator(refreshing: boolean, progress?: number) {
  return (
    <ThemeProvider theme={theme}>
      <DataTableRefreshingIndicator
        refreshing={refreshing}
        progress={progress}
      />
    </ThemeProvider>
  );
}
it("themes real progress and retains the idle layout slot after completion", () => {
  jest.useFakeTimers();
  try {
    const { rerender, container, unmount } = render(indicator(true, 40));
    const bar = screen.getByRole("progressbar", { name: "Loading table data" });
    expect(bar).toHaveClass(dataTableClasses.refreshingIndicator);
    expect(bar).toHaveStyle({ height: "2px", borderRadius: "7px" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    rerender(indicator(false));
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    act(() => jest.advanceTimersByTime(500));
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(
      container.querySelector(`.${dataTableClasses.refreshingIndicator}`),
    ).toHaveStyle({ height: "2px", visibility: "hidden" });
    unmount();
  } finally {
    jest.useRealTimers();
  }
});
it("keeps simulated refresh progress labelled as refreshing", () => {
  const { unmount } = render(indicator(true));
  const bar = screen.getByRole("progressbar", {
    name: "Refreshing table data",
  });
  expect(bar).toHaveAttribute("aria-valuetext", "Refreshing table data");
  expect(Number(bar.getAttribute("aria-valuenow"))).toBeLessThan(100);
  unmount();
});
```

### src/components/DataTable/mui/components/selection/selectedRows.ts

```ts
// src/components/DataTable/mui/components/selection/selectedRows.ts

import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

/**
 * Minimal row-selection map shape required by the MUI selection UI.
 *
 * TanStack row-selection state uses row IDs as keys and booleans as
 * selected flags.
 */
export type DataTableRowSelectionState = Readonly<Record<string, boolean>>;

/**
 * Return selected row IDs while ignoring stale/false entries.
 */
export function getDataTableSelectedRowIds(
  rowSelection: DataTableRowSelectionState,
): string[] {
  const ids: string[] = [];

  for (const [rowId, selected] of Object.entries(rowSelection)) {
    if (selected) {
      ids.push(rowId);
    }
  }

  return ids;
}

/**
 * Resolve the selected rows available in the loaded core model.
 * Manual pagination can retain IDs whose data is not loaded. Keep those
 * IDs in the selection context, but do not invent rows or throw for them.
 */
export function getDataTableSelectedRows<TData extends RowData>(
  table: MuiDataTableInstance<TData>,

  selectedRowIds: readonly string[],
): Row<MuiDataTableFeatures, TData>[] {
  const rows: Row<MuiDataTableFeatures, TData>[] = [];

  const rowsById = table.getCoreRowModel().rowsById;
  for (const rowId of selectedRowIds) {
    const row = rowsById[rowId];
    if (row) rows.push(row);
  }

  return rows;
}
```

### src/components/DataTable/mui/components/selection/types.ts

```ts
// src/components/DataTable/mui/components/selection/types.ts

import type { ReactNode } from "react";
import type { ButtonProps } from "@mui/material";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

/**
 * Fully typed current-selection context.
 *
 * This is derived from TanStack's rowSelection state at render time.
 * It does not own any independent selection state.
 */
export interface DataTableSelectionContext<TData extends RowData> {
  /**
   * Current React-aware DataTable instance.
   */
  readonly table: MuiDataTableInstance<TData>;

  /**
   * IDs currently selected in TanStack rowSelection state.
   */
  readonly selectedRowIds: readonly string[];

  /**
   * Selected rows present in the loaded core model. With manual pagination,
   * this can be a subset of selectedRowIds. Use IDs for server bulk actions.
   */
  readonly selectedRows: readonly Row<MuiDataTableFeatures, TData>[];

  readonly selectedCount: number;
}

/**
 * One application-defined bulk action.
 *
 * Examples:
 *
 * - delete selected documents
 * - print selected documents
 * - archive selected users
 * - assign selected records
 *
 * DataTable only presents and invokes the action.
 * Application behavior remains outside the framework.
 */
export interface DataTableBulkAction<TData extends RowData> {
  /**
   * Stable application-defined ID.
   */
  readonly id: string;

  /**
   * Human-readable label.
   */
  readonly label: string;

  /**
   * Optional icon renderer.
   */
  readonly renderIcon?: (
    context: DataTableSelectionContext<TData>,
  ) => ReactNode;

  /**
   * MUI semantic color.
   *
   * Default: "primary".
   */
  readonly color?: ButtonProps["color"];

  /**
   * MUI presentation variant.
   *
   * Default: "text".
   */
  readonly variant?: ButtonProps["variant"];

  /**
   * Hide this action for the current selection.
   */
  readonly isHidden?: (context: DataTableSelectionContext<TData>) => boolean;

  /**
   * Disable this action for the current selection.
   */
  readonly isDisabled?: (context: DataTableSelectionContext<TData>) => boolean;

  /**
   * Application callback.
   */
  readonly onClick: (context: DataTableSelectionContext<TData>) => void;
}

/**
 * Configuration for the high-level selection status bar.
 */
export interface DataTableSelectionBarConfig<TData extends RowData> {
  /**
   * Application-defined bulk actions.
   */
  readonly actions?: readonly DataTableBulkAction<TData>[];

  /**
   * Whether the clear-selection button is rendered.
   *
   * Default: true.
   */
  readonly clearable?: boolean;

  /**
   * Optional static leading content.
   */
  readonly startContent?: ReactNode;

  /**
   * Optional dynamic leading content.
   *
   * Takes precedence over startContent.
   */
  readonly renderStartContent?: (
    context: DataTableSelectionContext<TData>,
  ) => ReactNode;

  /**
   * Optional static trailing content.
   *
   * This renders before bulk actions.
   */
  readonly endContent?: ReactNode;

  /**
   * Dynamic trailing content.
   */
  readonly renderEndContent?: (
    context: DataTableSelectionContext<TData>,
  ) => ReactNode;
}
```

### src/components/DataTable/mui/components/selection/selectionBarTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { DataTableSelectionBar } from "./DataTableSelectionBar";

const helper = createMuiDataTableColumnHelper<{ id: string }>();
const columns = helper.columns([helper.accessor("id", {})]);
const data = [{ id: "a" }, { id: "b" }];
const slots = [
  "selectionBar",
  "selectionBarDivider",
  "selectionBarStart",
  "selectionBarEnd",
  "selectionBarStatus",
  "selectionClearButton",
  "bulkActions",
  "bulkActionButton",
] as const;
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: Object.fromEntries(
        slots.map((slot) => [slot, { borderTopWidth: "3px" }]),
      ),
    },
  },
});
function mount({
  empty = false,
  offPage = false,
  clearable = true,
  hidden = false,
  disabled = false,
} = {}) {
  const onAction = jest.fn();
  function Fixture() {
    const table = useMuiDataTable({
      columns,
      data,
      getRowId: (row) => row.id,
      initialState: {
        rowSelection: empty
          ? {}
          : offPage
            ? { a: true, missing: true }
            : { a: true, b: true },
      },
    });
    return (
      <table.AppTable>
        <DataTableSelectionBar
          table={table}
          clearable={clearable}
          renderStartContent={(context) => (
            <span>
              {context.selectedRows.map((row) => row.original.id).join(",")}
            </span>
          )}
          endContent={<span>Custom end</span>}
          actions={[
            {
              id: "inspect",
              label: "Inspect",
              isHidden: () => hidden,
              isDisabled: () => disabled,
              onClick: onAction,
            },
          ]}
        />
      </table.AppTable>
    );
  }
  const result = render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );
  return { ...result, onAction };
}
it("themes all selection surfaces and preserves live status and custom content", () => {
  const { container } = mount();
  for (const slot of slots)
    expect(container.querySelector(`.${dataTableClasses[slot]}`)).toHaveStyle({
      borderTopWidth: "3px",
    });
  expect(screen.getByRole("status")).toHaveTextContent("2 rows selected");
  expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  expect(screen.getByText("a,b")).toBeVisible();
  expect(screen.getByText("Custom end")).toBeVisible();
});
it("passes the current selection context to a bulk action", () => {
  const { onAction } = mount();
  fireEvent.click(
    screen.getByRole("button", { name: "Inspect for 2 selected rows" }),
  );
  expect(onAction).toHaveBeenCalledTimes(1);
  expect(onAction.mock.calls[0][0].selectedRowIds).toEqual(["a", "b"]);
  expect(onAction.mock.calls[0][0].selectedCount).toBe(2);
});
it("clears selection and removes the complete bar including its divider", () => {
  const { container } = mount();
  fireEvent.click(
    screen.getByRole("button", { name: "Clear all selected rows" }),
  );
  expect(screen.queryByRole("status")).toBeNull();
  expect(
    container.querySelector(`.${dataTableClasses.selectionBarDivider}`),
  ).toBeNull();
});
it("preserves disabled actions and optional clearing", () => {
  const { onAction } = mount({ disabled: true, clearable: false });
  const button = screen.getByRole("button", {
    name: "Inspect for 2 selected rows",
  });
  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(onAction).not.toHaveBeenCalled();
  expect(
    screen.queryByRole("button", { name: "Clear all selected rows" }),
  ).toBeNull();
});
it("omits hidden actions", () => {
  mount({ hidden: true });
  expect(
    screen.queryByRole("button", { name: "Inspect for 2 selected rows" }),
  ).toBeNull();
});
it("renders nothing for empty selection", () => {
  const { container } = mount({ empty: true });
  expect(
    container.querySelector(`.${dataTableClasses.selectionBar}`),
  ).toBeNull();
});

it("preserves off-page IDs and supplies only loaded rows to actions", () => {
  const { onAction } = mount({ offPage: true });
  expect(screen.getByRole("status")).toHaveTextContent("2 rows selected");
  fireEvent.click(
    screen.getByRole("button", { name: "Inspect for 2 selected rows" }),
  );
  const context = onAction.mock.calls[0][0];
  expect(context.selectedRowIds).toEqual(["a", "missing"]);
  expect(context.selectedRows.map((row: { id: string }) => row.id)).toEqual([
    "a",
  ]);
  expect(context.selectedCount).toBe(2);
});
```

## Verification

- npm run typecheck: passed, including feature synchronization.
- npm run test:datatable -- --runInBand: **31 suites, 169 tests passed**.
- New regression coverage verifies an unavailable selected ID remains in the action context while selectedRows contains only loaded rows.
- Progress coverage verifies the slot override, reserved height, real progress, completion/hiding and simulated refresh labeling.

No real external bulk action or live-browser acceptance was performed in this phase.

Next source phase: **6F.1 � whole-table root/container and theme-contract audit**. Full presentation-foundation acceptance remains open until the recorded live checks are resolved.
