# Phase 1.7.10.6D.3 — Pagination structural theme slots

## Implementation

Pagination now participates in the `RazethDataTable` structural family through nine named slots. Every slot has a stable utility class and explicit style-override mapping. The registry-derived slot type updates MUI augmentation automatically.

| Slot | Responsibility |
| --- | --- |
| pagination | Semantic footer, wrapping layout and density spacing |
| paginationDivider | Divider above the footer |
| paginationControls | Status and navigation grouping |
| paginationStatus | Current page / page count text |
| paginationActions | First, previous, next and last control group |
| paginationButton | Shared navigation-button presentation |
| pageSize | Page-size label/control group |
| pageSizeLabel | Rows-per-page label |
| pageSizeSelect | Numeric page-size select |

The footer and three prior `sx` rules move into styled slots. Static MUI Stack direction, spacing and alignment props remain as before. Footer density geometry is resolved once in the styled definition for compact, comfortable and spacious states, selected through `data-density`. Padding still converts the existing spacing units with `theme.spacing()`, while minimum heights remain pixels.

Density is finite presentation state, so no inline geometry variables are necessary here. TanStack remains responsible for pagination values and navigation capability. No effects, local page-index state, or independent page-count arithmetic were added.

## Preserved behavior

- Known counts display `Page N of M`; a known empty count retains `Page 1 of 1`.
- Unknown manual counts (`-1`) display `Page N` and hide both first/last controls, preserving the existing behavior.
- Previous/next availability comes directly from TanStack.
- First, previous, next and last callbacks still invoke the corresponding TanStack APIs.
- Page-size selection remains numeric and invokes `table.setPageSize()` with the chosen value.
- The optional page-size selector, its layout placeholder, tooltip wrappers for disabled buttons, accessible names, and RTL icon mapping remain unchanged.
- Intentional `error.main` header-label styling remains unchanged.

This is a presentation migration. Existing pagination subscription and server-query semantics are preserved. Broader data-refresh synchronization behavior is not redesigned here.

## Theme example

```tsx
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        pagination: {
          backgroundColor: '#fafafa',
          '&[data-density="compact"]': { paddingBlock: 4 },
        },
        paginationDivider: { borderColor: '#ddd' },
        paginationControls: { flexWrap: 'wrap' },
        paginationStatus: { fontWeight: 600 },
        paginationActions: { paddingInlineStart: 4 },
        paginationButton: { borderRadius: 6 },
        pageSize: { alignSelf: 'center' },
        pageSizeLabel: { fontWeight: 600 },
        pageSizeSelect: { minWidth: 88 },
      },
    },
  },
});
```

MUI disabled-button styles still apply. Use an explicit `&.Mui-disabled` override only when intentionally changing that state. Match the density selector when overriding density-specific footer spacing. Raw numeric CSS lengths in these overrides are pixels where applicable.

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

### src/components/DataTable/mui/components/pagination/DataTablePagination.tsx

```tsx
"use client";

import { Box, Divider, Stack, Typography, styled } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTablePageSizeSelect } from "./DataTablePageSizeSelect";
import { DataTablePaginationActions } from "./DataTablePaginationActions";
import type { DataTablePaginationConfig } from "./types";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";

const PaginationRoot = styled("footer", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "Pagination",
  overridesResolver: (_props, styles) => styles.pagination,
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  paddingInline: theme.spacing(2),
  flexWrap: "wrap",
  ...Object.fromEntries(
    (["compact", "comfortable", "spacious"] as const).map((density) => {
      const metrics = getDataTableDensityMetrics(density);
      return [
        `&[data-density="${density}"]`,
        {
          paddingBlock: theme.spacing(metrics.footerPaddingBlock),
          minHeight: `${metrics.footerHeight}px`,
        },
      ];
    }),
  ),
}));
const PaginationDividerRoot = styled(Divider, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationDivider",
  overridesResolver: (_props, styles) => styles.paginationDivider,
})({});
const PaginationControlsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationControls",
  overridesResolver: (_props, styles) => styles.paginationControls,
})({});
const PaginationStatusRoot = styled(Typography, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationStatus",
  overridesResolver: (_props, styles) => styles.paginationStatus,
})({ whiteSpace: "nowrap" });

export interface DataTablePaginationProps<
  TData extends RowData,
> extends DataTablePaginationConfig {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Pagination footer for the MUI DataTable.
 *
 * TanStack owns:
 *
 * - pageIndex
 * - pageSize
 * - next/previous capability
 * - page count
 * - row count
 * - manual/client pagination semantics
 *
 * This component only renders controls.
 */
export function DataTablePagination<TData extends RowData>(
  props: DataTablePaginationProps<TData>,
) {
  const {
    table,
    pageSizeOptions = [10, 25, 50, 100, 200],
    showFirstLastButtons = true,
    showPageSizeSelector = true,
  } = props;

  const { density } = useDataTableDensity();

  return (
    <table.Subscribe source={table.atoms.pagination}>
      {(pagination) => {
        const { pageIndex, pageSize } = pagination;

        const canPreviousPage = table.getCanPreviousPage();

        const canNextPage = table.getCanNextPage();

        const pageCount = table.getPageCount();

        /**
         * TanStack uses -1 to represent unknown page count in
         * manual/server pagination.
         */
        const hasKnownPageCount = pageCount >= 0;

        const displayPage = pageIndex + 1;

        return (
          <>
            <PaginationDividerRoot
              className={dataTableClasses.paginationDivider}
            />
            <PaginationRoot
              className={dataTableClasses.pagination}
              data-density={density}
            >
              {showPageSizeSelector ? (
                <DataTablePageSizeSelect
                  pageSize={pageSize}
                  options={pageSizeOptions}
                  onChange={(nextPageSize) => {
                    table.setPageSize(nextPageSize);
                  }}
                />
              ) : (
                <Box />
              )}

              <PaginationControlsRoot
                className={dataTableClasses.paginationControls}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <PaginationStatusRoot
                  className={dataTableClasses.paginationStatus}
                  variant="body2"
                  color="text.secondary"
                >
                  {hasKnownPageCount ? (
                    <>
                      Page {displayPage} of {Math.max(1, pageCount)}
                    </>
                  ) : (
                    <>Page {displayPage}</>
                  )}
                </PaginationStatusRoot>

                <DataTablePaginationActions
                  canPreviousPage={canPreviousPage}
                  canNextPage={canNextPage}
                  showFirstLastButtons={
                    showFirstLastButtons && hasKnownPageCount
                  }
                  onFirstPage={() => {
                    table.firstPage();
                  }}
                  onPreviousPage={() => {
                    table.previousPage();
                  }}
                  onNextPage={() => {
                    table.nextPage();
                  }}
                  onLastPage={() => {
                    table.lastPage();
                  }}
                />
              </PaginationControlsRoot>
            </PaginationRoot>
          </>
        );
      }}
    </table.Subscribe>
  );
}
```

### src/components/DataTable/mui/components/pagination/DataTablePaginationActions.tsx

```tsx
"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import { IconButton, Stack, Tooltip, styled } from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const PaginationActionsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationActions",
  overridesResolver: (_props, styles) => styles.paginationActions,
})({});
const PaginationButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PaginationButton",
  overridesResolver: (_props, styles) => styles.paginationButton,
})({});

export interface DataTablePaginationActionsProps {
  readonly canPreviousPage: boolean;
  readonly canNextPage: boolean;
  readonly showFirstLastButtons: boolean;
  readonly onFirstPage: () => void;
  readonly onPreviousPage: () => void;
  readonly onNextPage: () => void;
  readonly onLastPage: () => void;
}

export function DataTablePaginationActions(
  props: DataTablePaginationActionsProps,
) {
  const {
    canPreviousPage,
    canNextPage,
    showFirstLastButtons,
    onFirstPage,
    onPreviousPage,
    onNextPage,
    onLastPage,
  } = props;

  const theme = useTheme();

  const rtl = theme.direction === "rtl";

  return (
    <PaginationActionsRoot
      className={dataTableClasses.paginationActions}
      direction="row"
      alignItems="center"
      spacing={0.25}
    >
      {showFirstLastButtons && (
        <Tooltip title="First page">
          <span>
            <PaginationButtonRoot
              className={dataTableClasses.paginationButton}
              size="small"
              disabled={!canPreviousPage}
              onClick={onFirstPage}
              aria-label="First page"
            >
              {rtl ? <LastPage /> : <FirstPage />}
            </PaginationButtonRoot>
          </span>
        </Tooltip>
      )}

      <Tooltip title="Previous page">
        <span>
          <PaginationButtonRoot
            className={dataTableClasses.paginationButton}
            size="small"
            disabled={!canPreviousPage}
            onClick={onPreviousPage}
            aria-label="Previous page"
          >
            {rtl ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </PaginationButtonRoot>
        </span>
      </Tooltip>

      <Tooltip title="Next page">
        <span>
          <PaginationButtonRoot
            className={dataTableClasses.paginationButton}
            size="small"
            disabled={!canNextPage}
            onClick={onNextPage}
            aria-label="Next page"
          >
            {rtl ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </PaginationButtonRoot>
        </span>
      </Tooltip>

      {showFirstLastButtons && (
        <Tooltip title="Last page">
          <span>
            <PaginationButtonRoot
              className={dataTableClasses.paginationButton}
              size="small"
              disabled={!canNextPage}
              onClick={onLastPage}
              aria-label="Last page"
            >
              {rtl ? <FirstPage /> : <LastPage />}
            </PaginationButtonRoot>
          </span>
        </Tooltip>
      )}
    </PaginationActionsRoot>
  );
}
```

### src/components/DataTable/mui/components/pagination/DataTablePageSizeSelect.tsx

```tsx
"use client";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";

import {
  styled,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

const PageSizeRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSize",
  overridesResolver: (_props, styles) => styles.pageSize,
})({});
const PageSizeLabelRoot = styled(Typography, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSizeLabel",
  overridesResolver: (_props, styles) => styles.pageSizeLabel,
})({ whiteSpace: "nowrap" });
const PageSizeSelectRoot = styled(Select<number>, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "PageSizeSelect",
  overridesResolver: (_props, styles) => styles.pageSizeSelect,
})({ minWidth: 72 });

export interface DataTablePageSizeSelectProps {
  readonly pageSize: number;
  readonly options: readonly number[];
  readonly onChange: (pageSize: number) => void;
}

export function DataTablePageSizeSelect(props: DataTablePageSizeSelectProps) {
  const { pageSize, options, onChange } = props;

  return (
    <PageSizeRoot
      className={dataTableClasses.pageSize}
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <PageSizeLabelRoot
        className={dataTableClasses.pageSizeLabel}
        variant="body2"
        color="text.secondary"
      >
        Rows per page
      </PageSizeLabelRoot>

      <FormControl size="small">
        <PageSizeSelectRoot
          className={dataTableClasses.pageSizeSelect}
          value={pageSize}
          onChange={(event) => {
            const nextPageSize = event.target.value;

            if (typeof nextPageSize !== "number") {
              return;
            }

            onChange(nextPageSize);
          }}
          inputProps={{
            "aria-label": "Rows per page",
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </PageSizeSelectRoot>
      </FormControl>
    </PageSizeRoot>
  );
}
```

### src/components/DataTable/mui/components/pagination/paginationTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  DataTableDensityProvider,
  getDataTableDensityMetrics,
} from "../../density";
import { dataTableClasses } from "../../styles";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import { DataTablePagination } from "./DataTablePagination";

const helper = createMuiDataTableColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
const data = [{ name: "A" }];
function Fixture({
  count = 3,
  showSize = true,
}: {
  count?: number;
  showSize?: boolean;
}) {
  const table = useMuiDataTable({
    columns,
    data,
    manualPagination: true,
    pageCount: count,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });
  return (
    <table.AppTable>
      <DataTablePagination
        table={table}
        pageSizeOptions={[10, 25]}
        showPageSizeSelector={showSize}
      />
    </table.AppTable>
  );
}
const slots = [
  "pagination",
  "paginationDivider",
  "paginationControls",
  "paginationStatus",
  "paginationActions",
  "paginationButton",
  "pageSize",
  "pageSizeLabel",
  "pageSizeSelect",
] as const;
const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: Object.fromEntries(
        slots.map((slot) => [slot, { backgroundColor: "rgb(10, 20, 30)" }]),
      ),
    },
  },
});
function mount(
  count = 3,
  density: "compact" | "comfortable" | "spacious" = "comfortable",
  showSize = true,
) {
  return render(
    <ThemeProvider theme={theme}>
      <DataTableDensityProvider density={density}>
        <Fixture count={count} showSize={showSize} />
      </DataTableDensityProvider>
    </ThemeProvider>,
  );
}
it("exposes all pagination theme slots", () => {
  const { container } = mount();
  for (const slot of slots)
    expect(container.querySelector(`.${dataTableClasses[slot]}${slot === "paginationButton" ? ":not([disabled])" : ""}`)).toHaveStyle({
      backgroundColor: "rgb(10, 20, 30)",
    });
  expect(
    container.querySelector(`.${dataTableClasses.pagination}`)?.tagName,
  ).toBe("FOOTER");
});
it.each(["compact", "comfortable", "spacious"] as const)(
  "keeps %s footer geometry",
  (density) => {
    const { container } = mount(3, density);
    const metrics = getDataTableDensityMetrics(density);
    expect(
      container.querySelector(`.${dataTableClasses.pagination}`),
    ).toHaveStyle({
      minHeight: `${metrics.footerHeight}px`,
      paddingBlock: theme.spacing(metrics.footerPaddingBlock),
    });
  },
);
it("navigates known pages and disables boundary controls", () => {
  mount();
  expect(screen.getByText("Page 1 of 3")).toBeVisible();
  expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  expect(screen.getByText("Page 2 of 3")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Last page" }));
  expect(screen.getByText("Page 3 of 3")).toBeVisible();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "First page" }));
  expect(screen.getByText("Page 1 of 3")).toBeVisible();
});
it("keeps unknown totals open-ended and hides first/last controls", () => {
  mount(-1);
  expect(screen.getByText("Page 1")).toBeVisible();
  expect(screen.queryByRole("button", { name: "Last page" })).toBeNull();
  expect(screen.queryByRole("button", { name: "First page" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Next page" }));
  expect(screen.getByText("Page 2")).toBeVisible();
});
it("preserves the empty-page display and optional size selector", () => {
  mount(0, "comfortable", false);
  expect(screen.getByText("Page 1 of 1")).toBeVisible();
  expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  expect(screen.queryByRole("combobox")).toBeNull();
});
it("commits a selected page size to TanStack", async () => {
  mount();
  fireEvent.mouseDown(screen.getByRole("combobox", { name: "Rows per page" }));
  fireEvent.click(
    await screen.findByRole("option", { name: "25" }),
  );
  expect(
    screen.getByRole("combobox", { name: "Rows per page" }),
  ).toHaveTextContent("25");
});
```

## Verification

- `npm run typecheck`: passed, including TanStack feature synchronization.
- `npm run test:datatable -- --runInBand`: **23 suites, 122 tests passed**.

New regression cases cover all nine theme slots, the three density geometries, known-page navigation boundaries, unknown totals, empty totals, optional page-size visibility, and page-size selection through a real TanStack table fixture.

No live-browser check was run for this phase. Existing RTL glyph mapping is preserved in source; live RTL, touch and pinned-scrolling acceptance from earlier phases remains pending. Jest checks do not establish visual layout or browser/server request acceptance.

Next focused step: **6D.4 — selection-summary styling and the remaining toolbar/pagination audit**, before closing 6D and starting the body migration.
