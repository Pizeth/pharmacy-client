# Phase 1.7.10.6D.4 — Selection summary and toolbar/pagination audit

## Implementation

`DataTableToolbarSelection` now renders a named `ToolbarSelection` styled Chip under `RazethDataTable`. It exposes the stable `RazethDataTable-toolbarSelection` utility class and `styleOverrides.toolbarSelection`. The existing registry-derived slot type extends MUI augmentation without importing the rendering component into the neutral theme types.

The slot has no new default CSS. It preserves the small primary outlined Chip, check icon and label. This makes the existing presentation theme-addressable without changing its geometry or interactions. The summary remains informational rather than becoming a clear-selection button.

The count continues to come from `table.atoms.rowSelection`. It deliberately does not use the currently loaded selected-row model: selected IDs outside a manually paginated page must still contribute to the count. Empty selection renders nothing. Changes made through `table.setRowSelection` update the summary directly.

TanStack v9 selection state contains selected IDs mapped to `true`; removing an ID represents deselection. The tests use that actual contract rather than introducing false-valued entries. No new selection state or synchronization effect was added.

The intentional `error.main` header-label accent remains unchanged.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbarSelection: {
          fontWeight: 600,
          borderRadius: 6,
          '& .MuiChip-icon': { fontSize: 18 },
        },
      },
    },
  },
});
```

Use this slot for the toolbar summary. It does not style body selection checkboxes, a bulk-action selection bar, or selected table rows.

## 6D source audit

| Surface | Result |
| --- | --- |
| Toolbar container/start/center/end/search regions | Seven structural slots from 6D.1 |
| Toolbar action group, filter status and five active triggers | Seven slots from 6D.2, including the manager trigger in its own directory |
| Pagination/footer/density/navigation/page-size surfaces | Nine structural slots from 6D.3 |
| Toolbar selection summary | New toolbarSelection slot |
| Permanent sx in toolbar and pagination folders | No matches in the current source audit |
| State ownership | TanStack query/selection/pagination state; existing presentation providers for visibility/density/fullscreen |
| Intentional header accent | Preserved |

Existing MUI Stack layout props remain as documented in previous phases. Absence of `sx` does not imply every underlying MUI menu/dialog subcomponent has acquired a custom slot. Column-manager dialog contents, density-menu contents and leaf input components retain their existing contracts. The unused legacy visibility-button file is not exported by the toolbar actions barrel.

Whole-family defaultProps, variants, comprehensive RTL/accessibility polish and the body/selection-bar migration remain later phases. These are not silently folded into this summary slot.

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

### src/components/DataTable/mui/components/toolbar/DataTableToolbarSelection.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/toolbar/DataTableToolbarSelection.tsx

import { Chip, styled } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";

const ToolbarSelectionRoot = styled(Chip, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "ToolbarSelection",
  overridesResolver: (_props, styles) => styles.toolbarSelection,
})({});

export interface DataTableToolbarSelectionProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Lightweight selected-row indicator.
 *
 * We intentionally count the rowSelection state itself rather than
 * requiring an additional selected-row model.
 */
export function DataTableToolbarSelection<TData extends RowData>(
  props: DataTableToolbarSelectionProps<TData>,
) {
  const { table } = props;

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {(rowSelection) => {
        const selectedCount =
          Object.values(rowSelection).filter(Boolean).length;

        if (selectedCount === 0) {
          return null;
        }

        return (
          <ToolbarSelectionRoot
            className={dataTableClasses.toolbarSelection}
            size="small"
            icon={<CheckCircleOutline />}
            label={`${selectedCount} selected`}
            color="primary"
            variant="outlined"
          />
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/toolbar/toolbarSelectionTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { act, render, screen } from "@testing-library/react";
import type { RowSelectionState } from "@tanstack/table-core";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import type { MuiDataTableInstance } from "../../table";
import { DataTableToolbarSelection } from "./DataTableToolbarSelection";

type Row = { id: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([helper.accessor("id", { header: "ID" })]);
const data = [{ id: "visible" }];
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        toolbarSelection: { backgroundColor: "rgb(10, 20, 30)" },
      },
    },
  },
});
function mount(selection: RowSelectionState) {
  let table!: MuiDataTableInstance<Row>;
  function Fixture() {
    table = useMuiDataTable({
      columns,
      data,
      getRowId: (row) => row.id,
      initialState: { rowSelection: selection },
      manualPagination: true,
    });
    return (
      <table.AppTable>
        <DataTableToolbarSelection table={table} />
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
it("themes the selection summary and counts selected IDs outside the loaded page", () => {
  const { container } = mount({ visible: true, offPage: true });
  expect(screen.getByText("2 selected")).toBeVisible();
  expect(
    container.querySelector(`.${dataTableClasses.toolbarSelection}`),
  ).toHaveStyle({ backgroundColor: "rgb(10, 20, 30)" });
  expect(screen.queryByRole("button")).toBeNull();
});
it("omits the summary when selection is empty", () => {
  const { container } = mount({});
  expect(container.querySelector(`.${dataTableClasses.toolbarSelection}`)).toBeNull();
});

it("tracks TanStack selection changes and removes the summary when cleared", () => {
  const { getTable } = mount({});
  act(() => getTable().setRowSelection({ visible: true }));
  expect(screen.getByText("1 selected")).toBeVisible();
  act(() => getTable().setRowSelection({ visible: true, offPage: true }));
  expect(screen.getByText("2 selected")).toBeVisible();
  act(() => getTable().setRowSelection({}));
  expect(screen.queryByText(/selected/)).toBeNull();
});
```

## Verification

- `npm run typecheck`: passed, including TanStack feature synchronization.
- `npm run test:datatable -- --runInBand`: **24 suites, 125 tests passed**.

New tests verify the theme override, selected IDs outside the loaded page, non-interactive summary semantics, empty selection, live TanStack selection updates and clearing.

No live-browser acceptance was run in this step. The source migration/audit does not close the previously recorded live RTL, touch, pinned-scrolling and complete 6D responsive/action acceptance gaps.

The next source implementation phase is **6E.1 — inspect and migrate body structural slots**, with selection controls, detail panels and state rows kept in bounded subsequent steps. Browser acceptance remains tracked separately and must pass before declaring the entire presentation foundation complete.
