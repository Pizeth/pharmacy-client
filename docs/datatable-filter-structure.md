# Phase 1.7.10.6B.2 — Structural DataTable theme family

The filter structure now belongs to one MUI component family:
`theme.components.RazethDataTable.styleOverrides`. The five leaf input controls
keep their individual component registrations.

## Public slots and classes

| Renderer | Styled slot | Theme override key | Stable class |
| --- | --- | --- | --- |
| DataTableFilterRow | FilterRow | filterRow | RazethDataTable-filterRow |
| DataTableFilterCell | FilterCell | filterCell | RazethDataTable-filterCell |
| DataTableFilterIndicator | FilterIndicator | filterIndicator | RazethDataTable-filterIndicator |

The existing `globalFilter` slot and global-search utility classes are retained.
`DataTableClassKey` is derived from the utility-class registry.
`DataTableSlotKey` excludes the existing global-search helper classes because
they have no direct `styleOverrides` resolver. Those helpers remain usable as
nested CSS selectors. Future structural slots should be registered when their
renderers are migrated, rather than advertised before they work.

## Theme registration

`src/theme.d.ts` maps `RazethDataTable` to `DataTableSlotKey` and exposes its
`styleOverrides` using MUI's `ComponentsOverrides` type. The family is deliberately
style-only in this phase: whole-table `defaultProps` and variants remain part of
6F. Individual leaf controls retain their existing defaults/variants contracts.

Each structural root uses the existing `DATA_TABLE_COMPONENT_NAME` constant and
an explicit resolver, for example:

```tsx
const FilterCellRoot = styled(TableCell, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterCell",
  overridesResolver: (_props, styles) => styles.filterCell,
})({});
```

The empty base style here is intentional. 6B.2 establishes slot identity and
override routing. The existing filter row/cell `sx` and pinning geometry are
preserved for 6B.3, where permanent rules move into these styled roots and runtime
dimensions become typed CSS variables. Until then, existing local `sx` rules take
precedence over conflicting family overrides. The example below uses properties
that do not conflict with those local rules.

## Theme example

```tsx
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    RazethDataTable: {
      styleOverrides: {
        filterRow: {
          outlineStyle: "solid",
          outlineWidth: "1px",
        },
        filterCell: {
          outlineStyle: "dashed",
          outlineWidth: "2px",
        },
        filterIndicator: ({ theme }) => ({
          color: (theme.vars ?? theme).palette.secondary.main,
          fontSize: "18px",
        }),
      },
    },
  },
});
```

## Indicator migration

The former standalone `RazethDataTableFilterIndicator` name is removed. Configure
`RazethDataTable.styleOverrides.filterIndicator` instead of a separate component's
`styleOverrides.root`. The indicator no longer calls `useThemeProps` for a leaf
component registration. Its active state continues to come from its caller, and
inactive indicators render nothing.

The caller's `className`, `component`, and `sx` are preserved. The stable class is
merged with the caller class. The default icon color now resolves the real palette
value: `"primary.main"` is an sx token, not a valid raw CSS color in `styled`.
Icon font size inherits from the root so the family override can control it.
The indicator remains decorative (`aria-hidden="true"`).

## Acceptance checks

Validation: `npm run typecheck` passed, including TanStack feature synchronization.
`npm run test:datatable -- --runInBand` passed all 59 tests across 9 suites.
`git diff --check` passed. Browser acceptance remains for 6B.6.

The real-table test renders a TanStack-backed filter row with one filterable and
one non-filterable column. It verifies family overrides through stable classes,
the accessible text filter, and preservation of the non-filterable grid cell.
The indicator tests cover family overrides, inactive state, caller customization,
and accessibility. No generated Emotion class names are asserted.

## Complete implementation source

The following snapshot includes the full files changed for 6B.2, including the
row/cell geometry intentionally retained for the next phase.

### src/components/DataTable/mui/styles/dataTableClasses.ts

```tsx
import { generateUtilityClass, generateUtilityClasses } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME } from "./constants";

/**
 * We are starting the utility-class registry incrementally.
 *
 * Do not define every future DataTable slot before we actually migrate it.
 *
 * Existing components will be added during the later visual/theme audit.
 */
export const dataTableClasses = generateUtilityClasses(
  DATA_TABLE_COMPONENT_NAME,
  [
    "globalFilter",
    "globalFilterFullWidth",
    "globalFilterClearButton",
    "filterRow",
    "filterCell",
    "filterIndicator",
  ],
);

export type DataTableClassKey = keyof typeof dataTableClasses;

/** Only named styled slots have a direct styleOverrides resolver. */
export type DataTableSlotKey = Exclude<
  DataTableClassKey,
  "globalFilterFullWidth" | "globalFilterClearButton"
>;

/**
 * Generate one stable DataTable utility class.
 */
export function getDataTableUtilityClass(slot: DataTableClassKey): string {
  return generateUtilityClass(DATA_TABLE_COMPONENT_NAME, slot);
}

```

### src/components/DataTable/mui/styles/index.ts

```tsx
export { DATA_TABLE_COMPONENT_NAME } from "./constants";

export { dataTableClasses, getDataTableUtilityClass } from "./dataTableClasses";

export type { DataTableClassKey, DataTableSlotKey } from "./dataTableClasses";

```

### src/components/DataTable/mui/theme/componentNames.ts

```tsx
/**
 * ------------------------------------------------------------------
 * MUI theme component names owned by DataTable
 * ------------------------------------------------------------------
 *
 * Keep these names centralized.
 *
 * They are used by:
 *
 * - useThemeProps()
 * - styled()
 * - MUI theme ComponentsPropsList augmentation
 * - future theme.components styleOverrides/defaultProps/variants
 *
 * Do not duplicate these string literals throughout the component
 * implementation.
 */
export const DATA_TABLE_THEME_COMPONENT_NAMES = {
  textFilter: "RazethDataTableTextFilter",
  numberFilter: "RazethDataTableNumberFilter",
  numberRangeFilter: "RazethDataTableNumberRangeFilter",
  booleanFilter: "RazethDataTableBooleanFilter",
  selectFilter: "RazethDataTableSelectFilter",
} as const;

export type DataTableThemeComponentName =
  (typeof DATA_TABLE_THEME_COMPONENT_NAMES)[keyof typeof DATA_TABLE_THEME_COMPONENT_NAMES];

```

### src/components/DataTable/mui/theme/types.ts

```tsx
import type { MuiDataTableDensity } from "../density";
import type {
  DataTableToolbarSearchMode,
  DataTableToolbarSearchPosition,
} from "../components/toolbar";
import type {
  DataTableBooleanFilterProps,
  DataTableNumberFilterProps,
  DataTableNumberRangeFilterProps,
  DataTableSelectFilterProps,
  DataTableTextFilterProps,
} from "../components/filtering/types";

/**
 * Theme-level defaults supported by RazethDataTable.
 *
 * Important:
 *
 * Do not put row/resource-specific values here.
 *
 * Theme defaults should describe presentation and generic behavior,
 * not:
 *
 * - columns
 * - data
 * - API adapters
 * - resource query mappings
 */
export interface DataTableThemeProps {
  /**
   * Default density for DataTables.
   */
  readonly density?: MuiDataTableDensity;

  /**
   * Whether the standard toolbar is rendered.
   */
  readonly enableToolbar?: boolean;

  /**
   * Whether global search is rendered.
   */
  readonly enableGlobalSearch?: boolean;

  readonly searchMode?: DataTableToolbarSearchMode;

  readonly searchPosition?: DataTableToolbarSearchPosition;

  /**
   * Default visibility of the column-management action.
   */
  readonly enableColumnManager?: boolean;

  /**
   * Default density switch visibility.
   */
  readonly enableDensityToggle?: boolean;

  /**
   * Default fullscreen action visibility.
   */
  readonly enableFullscreen?: boolean;
}

/**
 * Slots addressable through:
 *
 *   theme.components.RazethDataTable.styleOverrides
 */
export type { DataTableClassKey, DataTableSlotKey } from "../styles/dataTableClasses";

/**
 * ------------------------------------------------------------------
 * DataTable-specific MUI ComponentsPropsList extension
 * ------------------------------------------------------------------
 *
 * This interface is deliberately kept inside the DataTable package.
 *
 * The application-level RazethComponentsPropsList can extend it rather
 * than importing every individual DataTable component prop type.
 *
 * That keeps theme augmentation scalable as more DataTable slots become
 * theme-aware later.
 */
export interface DataTableComponentsPropsList {
  RazethDataTableTextFilter: Partial<DataTableTextFilterProps>;
  RazethDataTableNumberFilter: Partial<DataTableNumberFilterProps>;
  RazethDataTableNumberRangeFilter: Partial<DataTableNumberRangeFilterProps>;
  RazethDataTableBooleanFilter: Partial<DataTableBooleanFilterProps>;
  RazethDataTableSelectFilter: Partial<DataTableSelectFilterProps>;
}

```

### src/theme.d.ts

```tsx
// src/theme.d.ts

import {
  CssVarsTheme,
  PaletteMode,
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
  CssVarsThemeOptions,
  ComponentsOverrides,
} from "@mui/material/styles";
import type { DataTableSlotKey } from "@/components/DataTable/mui/styles/dataTableClasses";

import { ClassKey, CustomComponents } from "@/types/classKey";
import {
  Line,
  Meteor,
  RazethComponentsPropsList,
  SideImage,
} from "@/interfaces/theme.interface";

declare module "@mui/material/styles" {
  interface Palette {
    passwordStrength: string[] | ((theme: MuiTheme) => string[]);
    link: {
      hover: string;
    };
    card: string;
    customShadows: {
      neumorphic: string;
      inset: string;
      circleWell: string;
    };
    dynamic: {
      background: string;
    };
  }
  interface PaletteOptions {
    passwordStrength?: string[] | ((theme: MuiTheme) => string[]);
    link?: {
      hover?: string;
    };
    card?: string;
    customShadows?: {
      neumorphic: string;
      inset: string;
      circleWell: string;
    };
    dynamic?: {
      background: string;
    };
  }

  // 1. Extend ThemeVars to include your custom keys for CSS Variables
  interface ThemeVars {
    sideImage?: SideImage;
    // You can add other custom variable paths here
  }

  interface CommonColors {
    whiteChannel: string;
    blackChannel: string;
  }

  // 2. Merge MuiTheme with CssVarsTheme and your custom properties
  interface Theme extends CssVarsTheme {
    // explicitly non-optional — this is the missing piece
    vars: CssVarsTheme["vars"];
    custom: {
      sideImage: SideImage;
      lines: Line[];
      meteor: Meteor;
      paper: string;
    };
  }

  // 3. Do the same for ThemeOptions
  interface ThemeOptions extends CssVarsThemeOptions {
    custom?: {
      sideImage?: SideImage;
      lines?: Line[];
      meteor?: Meteor;
      paper?: string;
    };
  }

  // ComponentNameToClassKey can derive its keys from our map.
  // Note: If each component has different keys (e.g., 'root', 'card'),
  // this interface should be defined manually for full accuracy.
  interface ComponentNameToClassKey extends Record<
    keyof RazethComponentsPropsList,
    ClassKey
  > {
    RazethDataTable: DataTableSlotKey;
  }

  // ComponentsPropsList directly extends our map.
  interface ComponentsPropsList extends RazethComponentsPropsList {}

  interface Components extends CustomComponents {
    /** Structural slots share styles; whole-table defaults come in phase 6F. */
    RazethDataTable?: {
      styleOverrides?: ComponentsOverrides<MuiTheme>["RazethDataTable"];
    };
    // Your custom components are now automatically included
    // You can still add standard MUI component overrides here if needed
  }
}

export type GradientRow = {
  y: number; // the row baseline
  dotY: number; // the dot’s y position
};

export type GradientPoint = {
  x: number;
  y: number;
  small?: boolean; // true = small dot, false = long streak
};

export type GradientOptions = {
  dotSize?: number; // default 1.5
  streakWidth?: number; // default 4
  streakHeight?: number; // default 100
  color?: string; // default "var(--c)"
};

export type IconSize = "small" | "medium" | "large" | number | string;

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
})({});

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
            sx={{
              backgroundColor: "background.paper",
            }}
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

import { Box, styled, TableCell } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import { getDataTableDensityMetrics, useDataTableDensity } from "../../density";
import type { MuiDataTableInstance } from "../../table";
import { getDataTablePinnedLayout, getDataTablePinnedSx } from "../pinning";
import { DataTableColumnFilter } from "../filtering";

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
})({});

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

        const pinnedSx = getDataTablePinnedSx(pinnedLayout, "header");

        const canFilter = column.getCanFilter();

        return (
          <FilterCellRoot
            className={dataTableClasses.filterCell}
            data-filter-column-id={column.id}
            data-pinned={pinnedLayout?.position}
            data-density={density}
            sx={{
              /**
               * The entire filter row is part of the sticky header
               * stack.
               */
              position: "sticky",
              top: `${stickyTop}px`,
              zIndex: 3,

              /**
               * Sticky cells require their own background.
               */
              backgroundColor: "background.paper",
              boxSizing: "border-box",

              /**
               * Keep this cell synchronized with the exact committed
               * TanStack column width.
               */
              width: `${size}px`,
              minWidth: `${size}px`,
              maxWidth: `${size}px`,

              /**
               * The subheader needs enough room for MUI small inputs.
               *
               * We don't force DataTableColumnFilter itself to know
               * anything about density or header structure.
               */
              height: `${Math.max(40, densityMetrics.headerHeight - 4)}px`,
              px: 0.75,
              py: 0.5,
              verticalAlign: "middle",

              /**
               * Some MUI controls, labels, and menus need to remain
               * visually unrestricted by the table cell itself.
               */
              overflow: "visible",

              /**
               * Compact the existing standard filtering controls when
               * they are hosted in the header filter row.
               *
               * This is presentation styling only.
               * Filter behavior remains completely inside
               * DataTableColumnFilter.
               */
              "& .MuiFormControl-root": {
                minWidth: 0,
              },

              "& .MuiInputBase-root": {
                minWidth: 0,
              },

              /**
               * Pinned positioning must come last so pinned header
               * behavior wins over the generic sticky cell rules.
               */
              ...pinnedSx,
            }}
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
              <Box
                aria-hidden="true"
                sx={{
                  width: "100%",
                  minHeight: 32,
                }}
              />
            )}
          </FilterCellRoot>
        );
      }}
    </table.Subscribe>
  );
}

```

### src/components/DataTable/mui/components/filtering/DataTableFilterIndicator.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/filtering/DataTableFilterIndicator.tsx

import { Box, styled } from "@mui/material";
import type { BoxProps } from "@mui/material";
import clsx from "clsx";
import { FilterAlt } from "@mui/icons-material";
import { DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX } from "../headerLayout";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { DataTableFilterIndicatorProps } from "./types";

const Root = styled(Box, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterIndicator",
  overridesResolver: (_props, styles) => styles.filterIndicator,
})<BoxProps & { ownerState: DataTableFilterIndicatorProps }>(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
  minWidth: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
  maxWidth: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
  height: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
  flex: "0 0 auto",
  color: (theme.vars ?? theme).palette.primary.main,
  "& .MuiSvgIcon-root": {
    fontSize: "inherit",
  },
  fontSize: `${DATA_TABLE_HEADER_FILTER_INDICATOR_SIZE_PX}px`,
}));

/**
 * Small header indicator showing that a column currently has
 * an active filter.
 *
 * This is intentionally not a button yet.
 *
 * The future column filter/menu trigger will own click behavior.
 */
export function DataTableFilterIndicator(
  props: DataTableFilterIndicatorProps,
) {
  const { active, component = "span", className, sx } = props;

  if (!active) {
    return null;
  }

  return (
    <Root
      ownerState={{ ...props }}
      className={clsx(dataTableClasses.filterIndicator, className)}
      sx={sx}
      component={component}
      aria-hidden="true"
    >
      <FilterAlt />
    </Root>
  );
}

```

### src/components/DataTable/mui/components/filter-row/filterStructureTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { DataTableDensityProvider } from "../../density";
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

function FilterStructure() {
  const table = useMuiDataTable({ columns, data });
  return (
    <DataTableAccessibilityProvider>
      <DataTableDensityProvider>
        <table>
          <thead>
            <DataTableFilterRow table={table} headerRowCount={1} />
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
          filterRow: { outlineStyle: "solid", outlineWidth: "1px" },
          filterCell: { outlineStyle: "dashed", outlineWidth: "2px" },
        },
      },
    },
  });
  render(<ThemeProvider theme={theme}><FilterStructure /></ThemeProvider>);
  const row = screen.getByRole("row", { name: "Column filters" });
  expect(row).toHaveClass(dataTableClasses.filterRow);
  expect(row).toHaveStyle({ outlineStyle: "solid", outlineWidth: "1px" });
  expect(row.children).toHaveLength(2);
  for (const cell of Array.from(row.children)) {
    expect(cell).toHaveClass(dataTableClasses.filterCell);
    expect(cell).toHaveStyle({ outlineStyle: "dashed", outlineWidth: "2px" });
  }
  expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  const actionsCell = row.querySelector('[data-filter-column-id="actions"]');
  expect(actionsCell?.firstElementChild).toHaveAttribute("aria-hidden", "true");
  expect(actionsCell?.querySelector("input")).toBeNull();
});

```

### src/components/DataTable/mui/components/filtering/filterIndicatorTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { render } from "@testing-library/react";
import { dataTableClasses } from "../../styles";
import { DataTableFilterIndicator } from "./DataTableFilterIndicator";

describe("structural filter indicator theme", () => {
  const theme = createTheme({
    components: {
      RazethDataTable: {
        styleOverrides: {
          filterRow: { outlineWidth: "1px" },
          filterCell: { outlineWidth: "2px" },
          filterIndicator: { color: "rgb(12, 34, 56)", fontSize: "20px" },
        },
      },
    },
  });

  it("renders the active indicator with its family override and stable class", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <DataTableFilterIndicator active className="custom-indicator" />
      </ThemeProvider>,
    );
    const indicator = container.firstElementChild;
    expect(indicator?.tagName).toBe("SPAN");
    expect(indicator).toHaveClass(dataTableClasses.filterIndicator, "custom-indicator");
    expect(indicator).toHaveStyle({ color: "rgb(12, 34, 56)", fontSize: "20px" });
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator).not.toHaveAttribute("ownerState");
  });

  it("removes the indicator when the caller's canonical filter state becomes inactive", () => {
    const { container, rerender } = render(<DataTableFilterIndicator active />);
    expect(container.firstChild).not.toBeNull();
    rerender(<DataTableFilterIndicator active={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("preserves caller component and sx customization", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <DataTableFilterIndicator active component="div" sx={{ color: "rgb(65, 43, 21)" }} />
      </ThemeProvider>,
    );
    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.firstChild).toHaveClass(dataTableClasses.filterIndicator);
    expect(container.firstChild).toHaveStyle({ color: "rgb(65, 43, 21)" });
  });
});

```
