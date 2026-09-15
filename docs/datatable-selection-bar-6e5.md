# Phase 1.7.10.6E.5 — Selection bar and bulk-action structural slots

## Baseline and scope

This implementation builds on the current local 6E.3 body-state and 6E.4 detail-panel files. Those changes are preserved. It migrates the selection bar and application bulk-action surfaces; row/header selection checkboxes and expansion triggers are not part of this step.

Eight slots join RazethDataTable:

| Slot | Surface |
| --- | --- |
| selectionBar | Wrapping container, selected surface color and spacing |
| selectionBarDivider | Divider that exists only with a nonempty selection |
| selectionBarStart | Selected status and application start content |
| selectionBarEnd | Application end content, actions and clear control |
| selectionBarStatus | Polite live status text |
| selectionClearButton | Clear-selection button |
| bulkActions | Application bulk-action group |
| bulkActionButton | Individual application action |

Each slot has a stable utility class and explicit overridesResolver. The class-derived slot type extends MUI augmentation automatically. Existing Stack alignment/spacing props remain; permanent sx is moved into styled rules. No runtime CSS variables are needed for this fixed layout.

## Preserved behavior

TanStack rowSelection is the only selection state. Empty selection renders nothing, including the divider. The bar derives IDs, resolves selected rows through the existing helper, and passes the same context to renderStartContent, renderEndContent and application actions.

Hidden actions remain absent. Disabled actions remain disabled and retain a tooltip event target. Action callbacks receive the current context and keep event prevention/propagation behavior. Clearable=false still omits the clear button. Clearing calls table.setRowSelection({}). The status remains role=status with polite and atomic live-region semantics. Labels, icon, button variants/colors and action order are unchanged.

This migration does not change the selectedRows helper's lookup policy. It still calls table.getRow(id, true) for each selected ID. Behavior for IDs unavailable in the row model is not hardened or claimed as verified here; the action-context tests use loaded selected rows. The separate toolbar summary's ID-only counting contract is unchanged.

The intentional error.main header accent is preserved. Detail panels, loading/error/empty-state content, row checkbox behavior and expansion behavior remain untouched.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        selectionBar: { paddingBlock: 12 },
        selectionBarDivider: { borderColor: '#ddd' },
        selectionBarStart: { minWidth: 160 },
        selectionBarEnd: { alignSelf: 'center' },
        selectionBarStatus: { fontWeight: 700 },
        selectionClearButton: { borderRadius: 6 },
        bulkActions: { paddingInlineStart: 4 },
        bulkActionButton: { borderRadius: 6 },
      },
    },
  },
});
```

These are theme styles, not a replacement for application authorization, action callbacks or disabled/hidden predicates. No real external bulk action was executed during verification.

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

### src/components/DataTable/mui/components/selection/DataTableSelectionBar.tsx

```tsx
// src/components/DataTable/mui/components/selection/DataTableSelectionBar.tsx

"use client";

import { Box, Button, Divider, Stack, Typography, styled } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTableBulkActions } from "./DataTableBulkActions";

import {
  getDataTableSelectedRowIds,
  getDataTableSelectedRows,
} from "./selectedRows";

import type {
  DataTableSelectionBarConfig,
  DataTableSelectionContext,
} from "./types";

const SelectionBarRoot = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBar",
  overridesResolver: (_props, styles) => styles.selectionBar,
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1),
  minHeight: 52,
  backgroundColor: (theme.vars ?? theme).palette.action.selected,
  flexWrap: "wrap",
}));
const SelectionBarDividerRoot = styled(Divider, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBarDivider",
  overridesResolver: (_props, styles) => styles.selectionBarDivider,
})({});
const SelectionBarStartRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBarStart",
  overridesResolver: (_props, styles) => styles.selectionBarStart,
})({ minWidth: 0, flex: "1 1 auto", flexWrap: "wrap" });
const SelectionBarEndRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBarEnd",
  overridesResolver: (_props, styles) => styles.selectionBarEnd,
})({ minWidth: 0, flexWrap: "wrap" });
const SelectionBarStatusRoot = styled(Typography, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionBarStatus",
  overridesResolver: (_props, styles) => styles.selectionBarStatus,
})({ whiteSpace: "nowrap" });
const SelectionClearButtonRoot = styled(Button, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SelectionClearButton",
  overridesResolver: (_props, styles) => styles.selectionClearButton,
})({});

export interface DataTableSelectionBarProps<
  TData extends RowData,
> extends DataTableSelectionBarConfig<TData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * High-level status and bulk-action surface for TanStack row selection.
 *
 * No independent selection state is stored here.
 */
export function DataTableSelectionBar<TData extends RowData>(
  props: DataTableSelectionBarProps<TData>,
) {
  const {
    table,
    actions = [],
    clearable = true,
    startContent,
    renderStartContent,
    endContent,
    renderEndContent,
  } = props;

  return (
    <table.Subscribe selector={(state) => state.rowSelection}>
      {(rowSelection) => {
        const selectedRowIds = getDataTableSelectedRowIds(rowSelection);

        const selectedCount = selectedRowIds.length;

        /**
         * The selection bar should not consume vertical space while
         * no rows are selected.
         */
        if (selectedCount === 0) {
          return null;
        }

        const selectedRows = getDataTableSelectedRows(table, selectedRowIds);

        const context: DataTableSelectionContext<TData> = {
          table,
          selectedRowIds,
          selectedRows,
          selectedCount,
        };

        const renderedStartContent = renderStartContent
          ? renderStartContent(context)
          : startContent;

        const renderedEndContent = renderEndContent
          ? renderEndContent(context)
          : endContent;

        return (
          <>
            <SelectionBarDividerRoot
              className={dataTableClasses.selectionBarDivider}
            />

            <SelectionBarRoot
              className={dataTableClasses.selectionBar}
              data-selection-bar="true"
            >
              {/**
               * LEFT SIDE
               *
               * selected status + application content
               */}
              <SelectionBarStartRoot
                className={dataTableClasses.selectionBarStart}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <SelectionBarStatusRoot
                  className={dataTableClasses.selectionBarStatus}
                  variant="body2"
                  fontWeight={600}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {selectedCount === 1
                    ? "1 row selected"
                    : `${selectedCount} rows selected`}
                </SelectionBarStatusRoot>

                {renderedStartContent}
              </SelectionBarStartRoot>

              {/**
               * RIGHT SIDE
               *
               * custom content + application bulk actions + clear
               */}
              <SelectionBarEndRoot
                className={dataTableClasses.selectionBarEnd}
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0.5}
              >
                {renderedEndContent}

                <DataTableBulkActions<TData>
                  actions={actions}
                  context={context}
                />

                {clearable && (
                  <SelectionClearButtonRoot
                    className={dataTableClasses.selectionClearButton}
                    size="small"
                    color="inherit"
                    aria-label="Clear all selected rows"
                    startIcon={<CloseOutlined fontSize="small" />}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      table.setRowSelection({});
                    }}
                  >
                    Clear
                  </SelectionClearButtonRoot>
                )}
              </SelectionBarEndRoot>
            </SelectionBarRoot>
          </>
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/selection/DataTableBulkActions.tsx

```tsx
// src/components/DataTable/mui/components/selection/DataTableBulkActions.tsx

"use client";

import { styled, Stack } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import { DataTableBulkActionButton } from "./DataTableBulkActionButton";
import type { DataTableBulkAction, DataTableSelectionContext } from "./types";

const BulkActionsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BulkActions",
  overridesResolver: (_props, styles) => styles.bulkActions,
})({ flexWrap: "wrap", minWidth: 0 });

export interface DataTableBulkActionsProps<TData extends RowData> {
  readonly actions: readonly DataTableBulkAction<TData>[];

  readonly context: DataTableSelectionContext<TData>;
}

export function DataTableBulkActions<TData extends RowData>(
  props: DataTableBulkActionsProps<TData>,
) {
  const { actions, context } = props;

  if (actions.length === 0) {
    return null;
  }

  return (
    <BulkActionsRoot
      className={dataTableClasses.bulkActions}
      direction="row"
      alignItems="center"
      spacing={0.5}
    >
      {actions.map((action) => (
        <DataTableBulkActionButton<TData>
          key={action.id}
          action={action}
          context={context}
        />
      ))}
    </BulkActionsRoot>
  );
}
```

### src/components/DataTable/mui/components/selection/DataTableBulkActionButton.tsx

```tsx
// src/components/DataTable/mui/components/selection/DataTableBulkActionButton.tsx

"use client";

import { styled, Button, Tooltip } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import type { DataTableBulkAction, DataTableSelectionContext } from "./types";

const BulkActionButtonRoot = styled(Button, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BulkActionButton",
  overridesResolver: (_props, styles) => styles.bulkActionButton,
})({ whiteSpace: "nowrap" });

export interface DataTableBulkActionButtonProps<TData extends RowData> {
  readonly action: DataTableBulkAction<TData>;
  readonly context: DataTableSelectionContext<TData>;
}

export function DataTableBulkActionButton<TData extends RowData>(
  props: DataTableBulkActionButtonProps<TData>,
) {
  const { action, context } = props;

  const hidden = action.isHidden?.(context) ?? false;

  if (hidden) {
    return null;
  }

  const disabled = action.isDisabled?.(context) ?? false;

  const icon = action.renderIcon?.(context);

  const button = (
    <BulkActionButtonRoot
      className={dataTableClasses.bulkActionButton}
      size="small"
      color={action.color ?? "primary"}
      variant={action.variant ?? "text"}
      disabled={disabled}
      aria-label={`${action.label} for ${context.selectedCount} selected ${
        context.selectedCount === 1 ? "row" : "rows"
      }`}
      startIcon={icon}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (disabled) {
          return;
        }

        action.onClick(context);
      }}
    >
      {action.label}
    </BulkActionButtonRoot>
  );

  /**
   * Keep the label available as a tooltip on compact/narrow layouts,
   * and ensure disabled buttons still have a tooltip event target.
   */
  return (
    <Tooltip title={action.label}>
      <span>{button}</span>
    </Tooltip>
  );
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
      initialState: { rowSelection: empty ? {} : { a: true, b: true } },
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
```

## Verification

- npm run typecheck: passed, including feature synchronization.
- npm run test:datatable -- --runInBand: **29 suites, 162 tests passed**.
- Six new tests cover all slot overrides, live status and custom content, action context, clearing, disabled/hidden actions, optional clearing and empty selection.
- The existing state and detail-panel regression suites pass alongside this implementation.

Live-browser verification was not performed for 6E.5. Existing RTL, touch, pinned-scrolling and complete presentation acceptance gaps remain pending.

Next bounded step: **6E.6 — selection checkboxes and expansion triggers**, followed by the remaining body/selection audit before closing 6E.
