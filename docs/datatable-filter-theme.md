# Phase 1.7.10.6A — Themeable filter controls

The five leaf filter controls use named MUI styled Root slots and `useThemeProps`.
The checkout already contained the component-name registry, theme-props mapping,
application augmentation, and initial styled controls. This pass completes their
theme-state wiring and fixes the number-range size and finite-number checks.

## How the theme reaches a control

1. `DATA_TABLE_THEME_COMPONENT_NAMES` supplies the same name to `useThemeProps`
   and `styled`, so defaults and styles resolve under the same theme entry.
2. `useThemeProps` merges caller props with that component's `defaultProps`.
3. Destructuring applies `size = "small"` only when neither caller nor theme
   specifies a size. Explicit caller props take precedence over theme defaults.
4. `ownerState={{ ...props, size }}` exposes the resolved filter props to the
   styled root. This matters for range controls because Stack has no `size` prop,
   and for select controls because FormControl does not receive the filter value.
   MUI filters `ownerState` out rather than forwarding it as a DOM attribute.
5. `overridesResolver` enables `styleOverrides.root`; the named Root slot also
   resolves theme variants against the root props and owner state.

The number-range control applies the resolved size to both inputs. Both endpoint
editors reject non-finite values. Clearing one bound preserves the other; clearing
the last bound calls `onClear`.

## Theme configuration example

Merge these entries into the application's existing theme configuration. The
function form of variant styles matches this project's custom theme contract.

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataTableNumberRangeFilter } from
  "@/components/DataTable/mui/components/filtering/DataTableNumberRangeFilter";

const theme = createTheme({
  components: {
    RazethDataTableTextFilter: { defaultProps: { size: "medium" } },
    RazethDataTableNumberFilter: { defaultProps: { size: "medium" } },
    RazethDataTableBooleanFilter: { defaultProps: { size: "medium" } },
    RazethDataTableSelectFilter: { defaultProps: { size: "medium" } },
    RazethDataTableNumberRangeFilter: {
      defaultProps: { size: "medium" },
      styleOverrides: {
        root: { paddingTop: "4px" },
      },
      variants: [
        {
          props: { size: "medium" },
          style: ({ theme }) => ({ paddingBottom: theme.spacing(1) }),
        },
      ],
    },
  },
});

// Inside a React component, supply the actual controlled state callbacks:
// <ThemeProvider theme={theme}>
//   <DataTableNumberRangeFilter
//     label="Price"
//     value={range}
//     onChange={setRange}
//     onClear={() => setRange([undefined, undefined])}
//   />
// </ThemeProvider>
```

The controls keep their narrow public props. This phase does not add arbitrary
TextField props, new slots, or utility-class APIs. The filter cell/row geometry
remains a separate phase.

## Verification

Verified in this checkout: **7 suites, 55 tests passed**, including 12 new tests.
TanStack feature synchronization passed. The full `npm run typecheck` reported
three errors in generated `.next/dev/types/validator.ts`: the empty generated
`routes.d.ts` is not a module and `LayoutProps` is missing at two locations. It
reported no errors in the changed source files. Browser validation was not run.

`filterTheme.spec.tsx` renders all five real controls under ThemeProvider and
checks theme default sizing, root overrides, matching size variants, caller size
precedence, and the absence of an ownerState DOM attribute. It also checks the
range-clear callbacks. Existing server-query and scalar-select tests remain part
of `npm run test:datatable -- --runInBand`.

## Complete source for this phase

The following source snapshot includes the registry, theme contract, five controls,
and regression tests. The application connects `DataTableComponentsPropsList`
through `RazethComponentsPropsList` in `src/interfaces/theme.interface.ts` and the
existing MUI module augmentation in `src/theme.d.ts`.

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
  filterIndicator: "RazethDataTableFilterIndicator",
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
} from "../components/filtering";

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
export type DataTableClassKey =
  | "root"
  | "shell"
  | "toolbar"
  | "toolbarStart"
  | "toolbarCenter"
  | "toolbarEnd"
  | "tableContainer"
  | "table"
  | "head"
  | "headerRow"
  | "headerCell"
  | "headerCellContent"
  | "headerLabel"
  | "headerActions"
  | "resizeHandle"
  | "filterRow"
  | "filterCell"
  | "body"
  | "bodyRow"
  | "bodyCell"
  | "pagination"
  | "selectionBar";

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

### src/components/DataTable/mui/theme/index.ts

```tsx
export { DATA_TABLE_THEME_COMPONENT_NAMES } from "./componentNames";
export type { DataTableThemeComponentName } from "./componentNames";
export type { DataTableComponentsPropsList } from "./types";

```

### src/components/DataTable/mui/components/filtering/DataTableTextFilter.tsx

```tsx
"use client";

//src/components/DataTable/mui/components/filtering/DataTableTextFilter.tsx

import { styled, TextField, useThemeProps } from "@mui/material";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

export interface DataTableTextFilterProps {
  readonly value: string;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly onChange: (value: string) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.textFilter;

/**
 * ------------------------------------------------------------------
 * Root slot
 * ------------------------------------------------------------------
 *
 * This is deliberately a named MUI styled component.
 *
 * Consumers can later configure:
 *
 * theme.components.RazethDataTableTextFilter
 *
 * using:
 *
 * - defaultProps
 * - styleOverrides.root
 * - variants
 */
const Root = styled(TextField, {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{ ownerState: DataTableTextFilterProps }>(() => ({
  width: "100%",
  minWidth: 0,

  /**
   * MUI inputs otherwise occasionally retain an intrinsic minimum
   * width that competes with narrow table columns.
   */
  "& .MuiInputBase-root": {
    minWidth: 0,
  },
}));

/**
 * Standard text filter input.
 *
 * This component owns only MUI editing behavior.
 *
 * TanStack filter state remains owned by the caller.
 */
export function DataTableTextFilter(inProps: DataTableTextFilterProps) {
  const props = useThemeProps({
    props: inProps,
    name: COMPONENT_NAME,
  });

  const { value, label, size = "small", onChange, onClear } = props;

  return (
    <Root
      ownerState={{ ...props, size }}
      fullWidth
      size={size}
      label={label}
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value;

        if (nextValue.length === 0) {
          onClear();

          return;
        }

        onChange(nextValue);
      }}
      slotProps={{
        htmlInput: {
          autoComplete: "off",

          spellCheck: false,
        },
      }}
    />
  );
}

```

### src/components/DataTable/mui/components/filtering/DataTableNumberFilter.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/filtering/DataTableNumberFilter.tsx

import { styled, TextField, useThemeProps } from "@mui/material";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

export interface DataTableNumberFilterProps {
  readonly value: number | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly onChange: (value: number) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.numberFilter;

const Root = styled(TextField, {
  name: COMPONENT_NAME,
  slot: "Root",

  overridesResolver: (_props, styles) => styles.root,
})<{ ownerState: DataTableNumberFilterProps }>(() => ({
  width: "100%",
  minWidth: 0,

  "& .MuiInputBase-root": {
    minWidth: 0,
  },
}));

/**
 * Single numeric-value filter editor.
 *
 * Empty input removes the corresponding TanStack filter.
 */
export function DataTableNumberFilter(inProps: DataTableNumberFilterProps) {
  const props = useThemeProps({
    props: inProps,
    name: COMPONENT_NAME,
  });

  const { value, label, size = "small", onChange, onClear } = props;

  return (
    <Root
      ownerState={{ ...props, size }}
      fullWidth
      size={size}
      type="number"
      label={label}
      value={value ?? ""}
      onChange={(event) => {
        const rawValue = event.target.value;

        if (rawValue.length === 0) {
          onClear();

          return;
        }

        const parsed = Number(rawValue);

        if (!Number.isFinite(parsed)) {
          return;
        }

        onChange(parsed);
      }}
    />
  );
}

```

### src/components/DataTable/mui/components/filtering/DataTableNumberRangeFilter.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/filtering/DataTableNumberRangeFilter.tsx

import { Stack, styled, TextField, useThemeProps } from "@mui/material";
import type { DataTableNumberRangeValue } from "./types";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

export interface DataTableNumberRangeFilterProps {
  readonly value: DataTableNumberRangeValue;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly onChange: (value: DataTableNumberRangeValue) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.numberRangeFilter;

const Root = styled(Stack, {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{ ownerState: DataTableNumberRangeFilterProps }>(() => ({
  width: "100%",
  minWidth: 0,

  "& .MuiTextField-root": {
    minWidth: 0,
  },

  "& .MuiInputBase-root": {
    minWidth: 0,
  },
}));

export function DataTableNumberRangeFilter(
  inProps: DataTableNumberRangeFilterProps,
) {
  const props = useThemeProps({
    props: inProps,
    name: COMPONENT_NAME,
  });

  const { value, label, size = "small", onChange, onClear } = props;

  const [min, max] = value;

  const updateMin = (rawValue: string): void => {
    const nextMin = rawValue.length === 0 ? undefined : Number(rawValue);

    if (nextMin !== undefined && !Number.isFinite(nextMin)) {
      return;
    }

    if (nextMin === undefined && max === undefined) {
      onClear();

      return;
    }

    onChange([nextMin, max]);
  };

  const updateMax = (rawValue: string): void => {
    const nextMax = rawValue.length === 0 ? undefined : Number(rawValue);

    if (nextMax !== undefined && !Number.isFinite(nextMax)) {
      return;
    }

    if (min === undefined && nextMax === undefined) {
      onClear();

      return;
    }

    onChange([min, nextMax]);
  };

  return (
    <Root ownerState={{ ...props, size }} direction="row" spacing={1}>
      <TextField
        fullWidth
        size={size}
        type="number"
        label={`${label} minimum`}
        value={min ?? ""}
        onChange={(event) => {
          updateMin(event.target.value);
        }}
      />

      <TextField
        fullWidth
        size={size}
        type="number"
        label={`${label} maximum`}
        value={max ?? ""}
        onChange={(event) => {
          updateMax(event.target.value);
        }}
      />
    </Root>
  );
}

```

### src/components/DataTable/mui/components/filtering/DataTableBooleanFilter.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/filtering/DataTableBooleanFilter.tsx

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  useThemeProps,
} from "@mui/material";
import { useId } from "react";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

type BooleanSelectValue = "" | "true" | "false";

export interface DataTableBooleanFilterProps {
  readonly value: boolean | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly onChange: (value: boolean) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.booleanFilter;

const Root = styled(FormControl, {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{ ownerState: DataTableBooleanFilterProps }>(() => ({
  width: "100%",
  minWidth: 0,

  "& .MuiInputBase-root": {
    minWidth: 0,
  },
}));

/**
 * Boolean filter editor.
 *
 * UI representation:
 *
 *   ""      -> no filter
 *   "true"  -> true values only
 *   "false" -> false values only
 *
 * The component translates that UI representation back into the
 * boolean value expected by the filter state.
 */
export function DataTableBooleanFilter(inProps: DataTableBooleanFilterProps) {
  const props = useThemeProps({
    props: inProps,
    name: COMPONENT_NAME,
  });

  const { value, label, size = "small", onChange, onClear } = props;

  const labelId = useId();

  const selectValue: BooleanSelectValue =
    value === undefined ? "" : value ? "true" : "false";

  return (
    <Root ownerState={{ ...props, size }} fullWidth size={size}>
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select<BooleanSelectValue>
        labelId={labelId}
        label={label}
        value={selectValue}
        onChange={(event) => {
          const nextValue = event.target.value;

          if (nextValue === "") {
            onClear();

            return;
          }

          onChange(nextValue === "true");
        }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Yes</MenuItem>
        <MenuItem value="false">No</MenuItem>
      </Select>
    </Root>
  );
}

```

### src/components/DataTable/mui/components/filtering/DataTableSelectFilter.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/filtering/DataTableSelectFilter.tsx

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  useThemeProps,
} from "@mui/material";
import { useId } from "react";
import type { MuiDataTableFilterOption } from "../../meta";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";
import {
  decodeDataTableSelectFilterValue,
  encodeDataTableSelectFilterValue,
} from "./selectFilterValue";
import type { DataTableSelectFilterValue } from "./selectFilterValue";

export interface DataTableSelectFilterProps {
  readonly value: DataTableSelectFilterValue | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly options: readonly MuiDataTableFilterOption[];
  readonly onChange: (value: DataTableSelectFilterValue) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.selectFilter;

const Root = styled(FormControl, {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{ ownerState: DataTableSelectFilterProps }>(() => ({
  width: "100%",
  minWidth: 0,

  "& .MuiInputBase-root": {
    minWidth: 0,
  },
}));

/**
 * Exact scalar-value select filter.
 *
 * DataTable filter state may contain:
 *
 * - string
 * - number
 * - boolean
 *
 * while MUI Select receives the stable encoded string representation
 * supplied by selectFilterValue.ts.
 */
export function DataTableSelectFilter(inProps: DataTableSelectFilterProps) {
  const props = useThemeProps({
    props: inProps,
    name: COMPONENT_NAME,
  });

  const { value, label, size = "small", options, onChange, onClear } = props;

  const labelId = useId();

  const selectedValue =
    value === undefined ? "" : encodeDataTableSelectFilterValue(value);

  return (
    <Root ownerState={{ ...props, size }} fullWidth size={size}>
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select
        labelId={labelId}
        label={label}
        value={selectedValue}
        onChange={(event) => {
          const encoded = event.target.value;

          if (encoded === "") {
            onClear();

            return;
          }

          onChange(decodeDataTableSelectFilterValue(encoded));
        }}
      >
        <MenuItem value="">All</MenuItem>

        {options.map((option) => {
          const encodedValue = encodeDataTableSelectFilterValue(option.value);

          return (
            <MenuItem key={encodedValue} value={encodedValue}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </Root>
  );
}

```

### src/components/DataTable/mui/components/filtering/filterTheme.spec.tsx

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableBooleanFilter } from "./DataTableBooleanFilter";
import { DataTableNumberFilter } from "./DataTableNumberFilter";
import { DataTableNumberRangeFilter } from "./DataTableNumberRangeFilter";
import { DataTableSelectFilter } from "./DataTableSelectFilter";
import { DataTableTextFilter } from "./DataTableTextFilter";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

const callbacks = { onChange: jest.fn(), onClear: jest.fn() };
const cases = [
  { name: DATA_TABLE_THEME_COMPONENT_NAMES.textFilter, render: (size?: "small" | "medium") => <DataTableTextFilter {...callbacks} label="Filter" value="" size={size} /> },
  { name: DATA_TABLE_THEME_COMPONENT_NAMES.numberFilter, render: (size?: "small" | "medium") => <DataTableNumberFilter {...callbacks} label="Filter" value={undefined} size={size} /> },
  { name: DATA_TABLE_THEME_COMPONENT_NAMES.numberRangeFilter, render: (size?: "small" | "medium") => <DataTableNumberRangeFilter {...callbacks} label="Filter" value={[undefined, undefined]} size={size} /> },
  { name: DATA_TABLE_THEME_COMPONENT_NAMES.booleanFilter, render: (size?: "small" | "medium") => <DataTableBooleanFilter {...callbacks} label="Filter" value={undefined} size={size} /> },
  { name: DATA_TABLE_THEME_COMPONENT_NAMES.selectFilter, render: (size?: "small" | "medium") => <DataTableSelectFilter {...callbacks} label="Filter" value={undefined} options={[]} size={size} /> },
];

describe.each(cases)("$name theme integration", (control) => {
  const theme = createTheme({
    components: {
      [control.name]: {
        defaultProps: { size: "medium" },
        styleOverrides: { root: { paddingTop: "7px" } },
        variants: [{ props: { size: "medium" }, style: () => ({ paddingBottom: "11px" }) }],
      },
    },
  });

  it("applies theme defaults, root overrides, and size variants", () => {
    const { container } = render(<ThemeProvider theme={theme}>{control.render()}</ThemeProvider>);
    expect(container.firstChild).toHaveStyle({ paddingTop: "7px", paddingBottom: "11px" });
    const inputs = container.querySelectorAll(".MuiInputBase-root");
    expect(inputs.length).toBeGreaterThan(0);
    inputs.forEach((input) => expect(input).not.toHaveClass("MuiInputBase-sizeSmall"));
    expect(container.firstChild).not.toHaveAttribute("ownerState");
  });

  it("lets explicit caller size override the theme default", () => {
    const { container } = render(<ThemeProvider theme={theme}>{control.render("small")}</ThemeProvider>);
    container.querySelectorAll(".MuiInputBase-root").forEach((input) => expect(input).toHaveClass("MuiInputBase-sizeSmall"));
    expect(container.firstChild).not.toHaveStyle({ paddingBottom: "11px" });
  });
});

describe("number range editing", () => {
  it("preserves the other endpoint when clearing one bound", () => {
    render(<DataTableNumberRangeFilter {...callbacks} label="Price" value={[1, 10]} />);
    fireEvent.change(screen.getByLabelText("Price minimum"), { target: { value: "" } });
    expect(callbacks.onChange).toHaveBeenCalledWith([undefined, 10]);
    expect(callbacks.onClear).not.toHaveBeenCalled();
  });

  it("clears the filter when its last bound is removed", () => {
    render(<DataTableNumberRangeFilter {...callbacks} label="Price" value={[undefined, 10]} />);
    fireEvent.change(screen.getByLabelText("Price maximum"), { target: { value: "" } });
    expect(callbacks.onClear).toHaveBeenCalledTimes(1);
    expect(callbacks.onChange).not.toHaveBeenCalled();
  });
});

```
