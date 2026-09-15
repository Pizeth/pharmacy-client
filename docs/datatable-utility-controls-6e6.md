# Phase 1.7.10.6E.6 — Selection checkboxes and expansion triggers

## Theme contract

Four controls now join RazethDataTable as named styled slots:

| Slot | Component |
| --- | --- |
| selectAllCheckbox | Current-page selection checkbox |
| selectRowCheckbox | Row selection checkbox |
| expandRowButton | Row detail expansion trigger |
| expandAllButton | Expand/collapse-all trigger |

Each uses a stable utility class and explicit overridesResolver. The registry-derived DataTableSlotKey updates the existing MUI augmentation automatically. No additional theme family or runtime geometry variable is introduced.

Checkbox roots retain their default MUI small-control styling; the named slot supplies a customization point without changing sizing. The expansion buttons move their fixed 28px dimensions and primary focus outline from sx into styled rules. Focus styling supports both :focus-visible and MUI's Mui-focusVisible class.

## Behavior preserved

- The select-all checkbox continues to call TanStack's current-page selection APIs, including indeterminate state.
- Row controls use the existing cell/table contexts and rowSelection subscription. Conditional selection and hierarchical indeterminate computation remain TanStack-owned.
- Selection change handlers and click propagation guards are unchanged.
- Row expansion remains absent for non-expandable rows. Expanded state, accessible names and aria-controls come from the existing APIs and accessibility provider.
- The expanded trigger references the actual detail-panel region; the region is labelled by that trigger.
- Expand-all keeps its disabled wrapper for tooltips, pressed state, current icons and table.toggleAllRowsExpanded call.
- Existing subscription slices and icon direction behavior are preserved; this step does not redesign page/data-change subscriptions or RTL glyph policy.
- No local selection/expansion state or synchronization effects are added.
- The intentional error.main header accent and completed detail-panel/selection-bar work remain unchanged.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        selectAllCheckbox: { borderRadius: 6 },
        selectRowCheckbox: {
          '&.Mui-checked': { color: '#1565c0' },
        },
        expandRowButton: {
          '&[aria-expanded="true"]': { backgroundColor: '#e3f2fd' },
        },
        expandAllButton: {
          '&[aria-pressed="true"]': { backgroundColor: '#e3f2fd' },
        },
      },
    },
  },
});
```

Use the existing MUI checkbox state classes and ARIA expanded/pressed attributes when styling state. No duplicate active state prop is needed. Disabled MUI styles remain in effect unless explicitly overridden.

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

### src/components/DataTable/mui/columns/selection/DataTableSelectAllCheckbox.tsx

```tsx
"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { styled, Checkbox } from "@mui/material";
import {
  useMuiDataTableContext,
  //   useMuiDataTableHeaderContext,
} from "../../table";

/**
 * Header-level select-all checkbox.
 *
 * Selection policy:
 *
 * - checked:
 *     every selectable row on the current page is selected
 *
 * - indeterminate:
 *     at least one, but not every selectable row on the current page
 *     is selected
 *
 * - unchecked:
 *     no selectable rows on the current page are selected
 *
 * Important TanStack v9 distinction:
 *
 * `useMuiDataTableHeaderContext()` gives us the current header context,
 * whose `table` property is the core:
 *
 *   Table<TFeatures, TData>
 *
 * `Subscribe`, however, is a React integration API and exists on:
 *
 *   ReactTable<TFeatures, TData, TSelected>
 *
 * Therefore reactive subscription must come from
 * `useMuiDataTableContext()`.
 */
const SelectAllCheckboxRoot = styled(Checkbox, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectAllCheckbox",
  overridesResolver: (_props, styles) => styles.selectAllCheckbox,
})({});

export function DataTableSelectAllCheckbox() {
  /**
   * Current enriched header context.
   *
   * We keep this because this component semantically belongs to a
   * header renderer, even though the actual React subscription comes
   * from the table-level context below.
   */
  //   const header = useMuiDataTableHeaderContext();

  /**
   * Current React/App table.
   *
   * This table owns:
   *
   * - Subscribe
   * - FlexRender
   * - reactive state
   *
   * while still exposing the normal TanStack table APIs.
   */
  const table = useMuiDataTableContext();

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {() => {
        /**
         * Use TanStack's table APIs instead of calculating these states
         * manually from rowSelection.
         *
         * These APIs understand:
         *
         * - pagination
         * - conditional row selection
         * - sub-row selection
         * - current selectable rows
         */
        const checked = table.getIsAllPageRowsSelected();

        const indeterminate = !checked && table.getIsSomePageRowsSelected();

        return (
          <SelectAllCheckboxRoot
            className={dataTableClasses.selectAllCheckbox}
            size="small"
            checked={checked}
            indeterminate={indeterminate}
            inputProps={{
              "aria-label": "Select all rows on current page",
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            onClick={(event) => {
              /**
               * Prevent future sortable-header / column-menu click
               * handling from also running when the checkbox itself
               * is clicked.
               */
              event.stopPropagation();
            }}
            /**
             * Useful for tests and future styling.
             */
            // data-column-id={header.column.id}
          />
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/columns/selection/DataTableSelectRowCheckbox.tsx

```tsx
"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { styled, Checkbox } from "@mui/material";
import {
  useMuiDataTableCellContext,
  useMuiDataTableContext,
} from "../../table";

/**
 * Row-level selection checkbox.
 *
 * The cell context supplies the current row/cell.
 *
 * The table-level AppTable context supplies the ReactTable required
 * for fine-grained subscriptions.
 */
const SelectRowCheckboxRoot = styled(Checkbox, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectRowCheckbox",
  overridesResolver: (_props, styles) => styles.selectRowCheckbox,
})({});

export function DataTableSelectRowCheckbox() {
  /**
   * Enriched TanStack cell context.
   *
   * `cell.row` is the exact row represented by this checkbox.
   */
  const cell = useMuiDataTableCellContext();

  const row = cell.row;

  /**
   * React/App table.
   *
   * Do NOT use:
   *
   *   cell.table.Subscribe
   *
   * because CellContext.table is the core Table rather than ReactTable.
   */
  const table = useMuiDataTableContext();

  return (
    <table.Subscribe
      source={table.atoms.rowSelection}
      //   selector={() => ({
      //     checked: row.getIsSelected(),
      //     indeterminate: row.getIsSomeSelected(),
      //     disabled: !row.getCanSelect(),
      //   })}
      selector={(rowSelection) => ({
        /**
         * Direct lookup is sufficient for this row's own selected
         * state and avoids recomputing the entire selected-row model.
         */
        checked: Boolean(rowSelection?.[row.id]),

        /**
         * For hierarchical rows, TanStack determines whether only
         * some descendants are selected.
         */
        indeterminate: row.getIsSomeSelected(),

        /**
         * Honors:
         *
         *   enableRowSelection
         *
         * including the per-row callback form.
         */
        disabled: !row.getCanSelect(),
      })}
    >
      {({ checked, indeterminate, disabled }) => (
        <SelectRowCheckboxRoot
          className={dataTableClasses.selectRowCheckbox}
          size="small"
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          inputProps={{
            "aria-label": `Select row ${row.id}`,
          }}
          /**
           * Delegate selection behavior completely to TanStack.
           *
           * This preserves:
           *
           * - multi-selection behavior
           * - sub-row selection
           * - range selection handling
           * - conditional selection
           */
          onChange={row.getToggleSelectedHandler()}
          onClick={(event) => {
            /**
             * Prevent future row-click navigation/selection handlers
             * from seeing this checkbox click.
             */
            event.stopPropagation();
          }}
          data-row-id={row.id}
        />
      )}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/columns/expansion/DataTableExpandRowButton.tsx

```tsx
// mui/columns/expansion/DataTableExpandRowButton.tsx

"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { styled, IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import {
  useMuiDataTableCellContext,
  useMuiDataTableContext,
} from "../../table";
import { useDataTableAccessibility } from "../../accessibility";

/**
 * Expansion control rendered inside the dedicated expansion display
 * column.
 *
 * Row state comes from the cell context.
 * React subscriptions come from the table context.
 */
const ExpandRowButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ExpandRowButton",
  overridesResolver: (_props, styles) => styles.expandRowButton,
})(({ theme }) => ({
  width: 28,
  height: 28,
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export function DataTableExpandRowButton() {
  const table = useMuiDataTableContext();

  const cell = useMuiDataTableCellContext();

  const row = cell.row;

  const { getExpandButtonId, getDetailPanelId } = useDataTableAccessibility();

  const expandButtonId = getExpandButtonId(row.id);

  const detailPanelId = getDetailPanelId(row.id);

  return (
    <table.Subscribe selector={(state) => state.expanded}>
      {() => {
        const canExpand = row.getCanExpand();

        if (!canExpand) {
          return null;
        }

        const expanded = row.getIsExpanded();

        return (
          <Tooltip title={expanded ? "Collapse row" : "Expand row"}>
            <ExpandRowButtonRoot
              className={dataTableClasses.expandRowButton}
              id={expandButtonId}
              size="small"
              aria-label={
                expanded
                  ? `Collapse details for row ${row.id}`
                  : `Expand details for row ${row.id}`
              }
              aria-expanded={expanded}
              aria-controls={expanded ? detailPanelId : undefined}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                row.toggleExpanded();
              }}
            >
              {expanded ? (
                <KeyboardArrowDown fontSize="small" />
              ) : (
                <KeyboardArrowRight fontSize="small" />
              )}
            </ExpandRowButtonRoot>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/columns/expansion/DataTableExpandAllButton.tsx

```tsx
// mui/columns/expansion/DataTableExpandAllButton.tsx

"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { styled, IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useMuiDataTableContext } from "../../table";

/**
 * Header control for expanding/collapsing every expandable row.
 *
 * Uses the React table context because Subscribe is a React-layer API.
 */
const ExpandAllButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ExpandAllButton",
  overridesResolver: (_props, styles) => styles.expandAllButton,
})(({ theme }) => ({
  width: 28,
  height: 28,
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export function DataTableExpandAllButton() {
  const table = useMuiDataTableContext();

  return (
    <table.Subscribe selector={(state) => state.expanded}>
      {() => {
        const canExpand = table.getCanSomeRowsExpand();

        const allExpanded = table.getIsAllRowsExpanded();

        // const someExpanded = table.getIsSomeRowsExpanded();

        // const active = allExpanded || someExpanded;

        return (
          <Tooltip title={allExpanded ? "Collapse all" : "Expand all"}>
            <span>
              <ExpandAllButtonRoot
                className={dataTableClasses.expandAllButton}
                size="small"
                disabled={!canExpand}
                aria-label={
                  allExpanded
                    ? "Collapse all expandable rows"
                    : "Expand all expandable rows"
                }
                aria-pressed={allExpanded}
                // aria-pressed={active}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  table.toggleAllRowsExpanded();
                }}
              >
                {allExpanded ? (
                  <KeyboardArrowUp fontSize="small" />
                ) : (
                  <KeyboardArrowDown fontSize="small" />
                )}
              </ExpandAllButtonRoot>
            </span>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/columns/utilityControlsTheme.spec.tsx

```tsx
import { Table, TableHead } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../accessibility";
import { DataTableDensityProvider } from "../density";
import { DataTableBody } from "../components/DataTableBody";
import { DataTableHeaderRow } from "../components/DataTableHeaderRow";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../table";
import { dataTableClasses } from "../styles";
import { createSelectionColumn } from "./selection";
import { createExpansionColumn } from "./expansion";

type Row = { id: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  createSelectionColumn<Row>(),
  createExpansionColumn<Row>(),
  helper.accessor("id", {
    enableResizing: false,
    meta: { enableColumnMenu: false },
  }),
]);
const data = [{ id: "a" }, { id: "b" }];
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        selectAllCheckbox: { borderRadius: "7px" },
        selectRowCheckbox: { borderRadius: "7px" },
        expandRowButton: { borderRadius: "7px" },
        expandAllButton: { borderRadius: "7px" },
      },
    },
  },
});
function mount(disabled = false) {
  function Fixture() {
    const table = useMuiDataTable({
      columns,
      data,
      getRowId: (row) => row.id,
      enableRowSelection: (row) => !disabled || row.id !== "b",
      getRowCanExpand: () => !disabled,
    });
    return (
      <table.AppTable>
        <DataTableAccessibilityProvider>
          <DataTableDensityProvider>
            <Table>
              <TableHead>
                <DataTableHeaderRow
                  table={table}
                  headerGroup={table.getHeaderGroups()[0]}
                  headerRowIndex={0}
                />
              </TableHead>
              <DataTableBody
                table={table}
                renderDetailPanel={({ row }) => <span>Details {row.id}</span>}
              />
            </Table>
          </DataTableDensityProvider>
        </DataTableAccessibilityProvider>
      </table.AppTable>
    );
  }
  return render(
    <ThemeProvider theme={theme}>
      <Fixture />
    </ThemeProvider>,
  );
}
it("applies utility control overrides without changing expansion geometry", () => {
  const { container } = mount();
  for (const slot of [
    "selectAllCheckbox",
    "selectRowCheckbox",
    "expandRowButton",
    "expandAllButton",
  ] as const) {
    expect(container.querySelector(`.${dataTableClasses[slot]}`)).toHaveStyle({
      borderRadius: "7px",
    });
  }
  expect(
    screen.getByRole("button", { name: "Expand details for row a" }),
  ).toHaveStyle({ width: "28px", height: "28px" });
});
it("preserves individual, indeterminate and select-all page behavior", () => {
  mount();
  const all = screen.getByRole("checkbox", {
    name: "Select all rows on current page",
  });
  fireEvent.click(screen.getByRole("checkbox", { name: "Select row a" }));
  expect(screen.getByRole("checkbox", { name: "Select row a" })).toBeChecked();
  expect(all).toHaveAttribute("data-indeterminate", "true");
  fireEvent.click(all);
  expect(screen.getByRole("checkbox", { name: "Select row b" })).toBeChecked();
  expect(all).toBeChecked();
  fireEvent.click(all);
  expect(
    screen.getByRole("checkbox", { name: "Select row a" }),
  ).not.toBeChecked();
});
it("links row expansion to its real detail panel and supports expand-all", () => {
  mount();
  fireEvent.click(
    screen.getByRole("button", { name: "Expand details for row a" }),
  );
  const button = screen.getByRole("button", {
    name: "Collapse details for row a",
  });
  const panel = document.getElementById(button.getAttribute("aria-controls")!);
  expect(panel).toHaveAttribute("role", "region");
  expect(panel).toHaveAttribute("aria-labelledby", button.id);
  expect(panel).toHaveTextContent("Details a");
  fireEvent.click(
    screen.getByRole("button", { name: "Expand all expandable rows" }),
  );
  expect(screen.getByText("Details b")).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Collapse all expandable rows" }),
  );
  expect(screen.queryByText("Details a")).toBeNull();
});
it("respects non-selectable and non-expandable rows", () => {
  mount(true);
  expect(screen.getByRole("checkbox", { name: "Select row b" })).toBeDisabled();
  expect(
    screen.queryByRole("button", { name: "Expand details for row a" }),
  ).toBeNull();
  expect(
    screen.getByRole("button", { name: "Expand all expandable rows" }),
  ).toBeDisabled();
});
```

## Verification

- npm run typecheck: passed, including feature synchronization.
- npm run test:datatable -- --runInBand: **30 suites, 166 tests passed**.
- Four new integration tests cover all slot overrides, preserved 28px expansion geometry, row and select-all state, indeterminate state, detail-panel ARIA linkage, expand/collapse-all behavior, and non-selectable/non-expandable rows.

The fixture uses production selection/expansion column factories, MUI TableHead, the real body renderer, and production accessibility/density providers. It exercises loaded flat rows; hierarchical range selection and page/data transitions are not newly verified by these tests.

No live-browser acceptance was run in this phase. Previously recorded live RTL, touch, pinned-scrolling and full responsive acceptance gaps remain pending. The source migration is not a claim that the whole presentation foundation is accepted.

Next bounded step: **6E.7 — final body/selection audit and targeted remaining behavior checks**, before the whole-table 6F theme-contract work.
