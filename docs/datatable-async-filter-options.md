# Phase 1.7.10.6B.4 — Asynchronous filter options

All five leaf controls now accept `disabled?: boolean`. Select additionally
accepts `loading?: boolean` and `errorMessage?: string`. The neutral filtering
types remain the shared source for components and leaf theme registration.

## Resource-to-renderer contract

| Column metadata | Select/control prop | Meaning |
| --- | --- | --- |
| `filterDisabled` | `disabled` | Disable this editor only |
| `filterOptionsLoading` | `loading` | Initial fetch or refresh of options |
| `filterOptionsError` | `errorMessage` | Safe user-facing option error |

`DataTableColumnFilter` forwards disabled state to every implemented editor and
option lifecycle state to select. These properties do not alter TanStack's
`enableColumnFilter`, committed values, filter counts, or server query state.

Select interaction is disabled when any of these holds:

```ts
const unavailable = disabled || loading || Boolean(errorMessage);
```

Loading displays `Loading options…` in an associated status message and sets
`aria-busy`. Failure displays the caller-supplied error in an associated alert.
Loading takes presentation precedence if loading and error are both supplied.
Boolean and select inherit disabled state from their FormControl; text and numeric
inputs receive it directly, including both number-range endpoints.

## TranslationKey integration

The resource column factory accepts optional `categoryFilterOptionsFetching` and
`categoryFilterOptionsError`. Only Category receives the derived metadata:

```ts
filterOptions: categoryFilterOptions,
filterOptionsLoading: categoryFilterOptionsFetching,
filterDisabled: categoryFilterOptionsError != null,
filterOptionsError: categoryFilterOptionsError != null
  ? "Category options could not be loaded."
  : undefined,
```

The resource controller passes `filterOptions.fetching` and `filterOptions.error`
into that factory and includes both in its memo dependencies. Raw errors stay at
the resource boundary; DataTable receives presentation text. Locale and the other
columns receive no Category lifecycle flags. Row fetching remains independent.

The option hook starts with `fetching = true`, so the first render does not expose
an enabled empty Category select before the effect starts. The existing refresh
action clears errors and retries, and cleanup aborts obsolete requests. The
existing resource Retry action remains the recovery entry point.

## Committed-value preservation

An active selected value can exist before its option arrives, or survive an option
being removed. The select renders a disabled fallback MenuItem with the same
encoded value and its scalar text. This keeps the MUI value representable without
mutating TanStack state. Once the option exists again, its label replaces the
fallback. No duplicated local filter state or cached label state is introduced.

Scalar encoding remains type-sensitive: numeric `2` and string `"2"` are distinct.
The empty menu value remains reserved for All, so choosing All after recovery calls
`onClear`, not `onChange`. While disabled, that select cannot be opened to choose
All; the table's existing clear-all action remains independent of editor state.

## Verification

`npm run typecheck` passed, including TanStack feature synchronization.
`npm run test:datatable -- --runInBand` passed **68 tests across 11 suites**.

New checks cover:

- Pure column metadata for fetching, failure, and recovery; other columns remain independent.
- Accessible disabled state for all five editors, including both range inputs.
- Select value preservation through loading/failure/recovery and All clearing afterward.
- Busy state on the first option-hook render, failure recovery, and retry cancellation.

The UI checks use accessible roles/labels rather than generated MUI classes.
Browser acceptance, combined query interaction, and remaining filter polish belong
to 6B.5–6B.6; they were not performed in this phase.

## Complete implementation source

The following snapshot includes all files modified or added for 6B.4.

### src/components/DataTable/mui/components/filtering/types.ts

```tsx
// src/components/DataTable/mui/components/filtering/types.ts

import { SxProps, Theme } from "@mui/material/styles";
import type {
  MuiDataTableFilterOption,
  MuiDataTableFilterVariant,
} from "../../meta";
import type { DataTableSelectFilterValue } from "./selectFilterValue";

/**
 * Number-range value used by our MUI filter controls.
 *
 * `undefined` means that edge of the range is not constrained.
 *
 * Examples:
 *
 *   [18, 65]
 *   [18, undefined]
 *   [undefined, 65]
 */
export type DataTableNumberRangeValue = readonly [
  min: number | undefined,
  max: number | undefined,
];

/**
 * Boolean filter state.
 *
 * undefined:
 *   no filter
 *
 * true:
 *   true values only
 *
 * false:
 *   false values only
 */
export type DataTableBooleanFilterValue = boolean | undefined;

/**
 * Generic description of a DataTable column filter UI.
 *
 * This is a renderer concern only.
 */
export interface DataTableColumnFilterUiConfig {
  readonly variant: MuiDataTableFilterVariant;
  readonly label: string;
  readonly options?: readonly MuiDataTableFilterOption[];
}

/**
 * Shared leaf-control contracts.
 *
 * Components and theme registration import these types directly from this
 * module, so the theme contract does not depend on React implementations.
 */
export interface DataTableTextFilterProps {
  readonly value: string;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: string) => void;
  readonly onClear: () => void;
}

export interface DataTableSelectFilterProps {
  readonly loading?: boolean;
  /** Safe presentation text supplied by the caller; never a raw transport error. */
  readonly errorMessage?: string;
  readonly value: DataTableSelectFilterValue | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly options: readonly MuiDataTableFilterOption[];
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: DataTableSelectFilterValue) => void;
  readonly onClear: () => void;
}

export interface DataTableBooleanFilterProps {
  readonly value: boolean | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: boolean) => void;
  readonly onClear: () => void;
}

export interface DataTableNumberFilterProps {
  readonly value: number | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: number) => void;
  readonly onClear: () => void;
}

export interface DataTableNumberRangeFilterProps {
  readonly value: DataTableNumberRangeValue;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly disabled?: boolean;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
  readonly onChange: (value: DataTableNumberRangeValue) => void;
  readonly onClear: () => void;
}

export interface DataTableFilterIndicatorProps {
  readonly active: boolean;
  readonly component?: React.ElementType | undefined;
  readonly className?: string;
  readonly sx?: SxProps<Theme>;
}

```

### src/components/DataTable/mui/meta/columnMeta.ts

```tsx
// src/components/DataTable/mui/meta/columnMeta.ts

/**
 * Logical horizontal alignment used by the MUI DataTable renderer.
 *
 * We deliberately use logical `start` / `end` instead of physical
 * `left` / `right` so the rendering layer can map alignment correctly
 * in both LTR and RTL layouts.
 */
export type MuiDataTableAlignment = "start" | "center" | "end";

/**
 * Rendering hint for the default filtering UI associated with a column.
 *
 * This does NOT control TanStack filtering behavior itself.
 *
 * Actual filtering behavior remains defined through TanStack options such as:
 *
 * - enableColumnFilter
 * - filterFn
 * - enableFilters
 * - enableColumnFilters
 */
export type MuiDataTableFilterVariant =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "multi-select"
  | "date"
  | "date-range"
  | "number-range";

/**
 * One option rendered by select-style filters.
 *
 * TValue is intentionally restricted to primitive values suitable for
 * HTML/MUI selection controls.
 */
export interface MuiDataTableFilterOption<
  TValue extends string | number | boolean = string | number | boolean,
> {
  readonly label: string;
  readonly value: TValue;
}

/**
 * MUI-specific column presentation metadata.
 *
 * TanStack behavioral options such as:
 *
 * - enableSorting
 * - enableColumnFilter
 * - filterFn
 * - enablePinning
 * - enableResizing
 *
 * remain directly on ColumnDef.
 */
export interface MuiDataTableColumnMeta {
  /**
   * Logical alignment for body cells.
   *
   * Defaults to `start`.
   */
  readonly align?: MuiDataTableAlignment;

  /**
   * Logical alignment for the column header.
   *
   * When omitted, the renderer may fall back to `align`.
   */
  readonly headerAlign?: MuiDataTableAlignment;

  /**
   * Controls which MUI editor is used for this column's filter UI.
   *
   * This does not enable filtering by itself.
   *
   * TanStack's `enableColumnFilter` / `enableFilters` remain the
   * behavioral source of truth.
   */
  readonly filterVariant?: MuiDataTableFilterVariant;

  /**
   * Options for select and multi-select filter variants.
   */
  readonly filterOptions?: readonly MuiDataTableFilterOption[];

  /** Disable this editor without changing TanStack filter capability or state. */
  readonly filterDisabled?: boolean;
  /** Select options are being fetched, including background refreshes. */
  readonly filterOptionsLoading?: boolean;
  /** Safe user-facing option error; only the select editor is disabled. */
  readonly filterOptionsError?: string;

  /**
   * Optional UI label override for the filter input.
   *
   * Useful when the rendered header is not a simple string.
   */
  readonly filterLabel?: string;

  /**
   * Whether the standard DataTable column menu should be available.
   *
   * Defaults to true.
   *
   * Useful for internal utility columns such as:
   *
   * - selection
   * - row actions
   * - expander
   */
  readonly enableColumnMenu?: boolean;

  /**
   * Whether this column can be reordered through the MUI DataTable
   * column-management UI.
   *
   * TanStack's columnOrderingFeature does not provide a per-column
   * ordering capability flag, so this is intentionally MUI-layer
   * policy.
   *
   * Default: true.
   *
   * Internal utility columns such as selection/actions/expanders may
   * set this to false.
   */
  readonly enableColumnOrdering?: boolean;

  /**
   * Human-readable column label used outside the rendered header.
   *
   * Useful for:
   *
   * - column manager
   * - toolbar controls
   * - accessibility labels
   * - future export/preferences UI
   *
   * This is intentionally separate from `header`, because `header`
   * may be a React renderer rather than plain text.
   */
  readonly label?: string;
}

```

### src/components/DataTable/mui/components/filtering/DataTableColumnFilter.tsx

```tsx
"use client";

// src/components/DataTable/mui/components/filtering/DataTableColumnFilter.tsx

import { Alert } from "@mui/material";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import { DataTableBooleanFilter } from "./DataTableBooleanFilter";
import { DataTableNumberFilter } from "./DataTableNumberFilter";
import { DataTableNumberRangeFilter } from "./DataTableNumberRangeFilter";
import { DataTableSelectFilter } from "./DataTableSelectFilter";
import { DataTableTextFilter } from "./DataTableTextFilter";
import type { DataTableNumberRangeValue } from "./types";

export interface DataTableColumnFilterProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;
}

/**
 * Render the configured MUI filtering editor for one TanStack column.
 *
 * TanStack remains responsible for:
 *
 * - filter state
 * - filterFn execution
 * - client/manual filtering
 * - state updates
 *
 * This component only translates between MUI controls and
 * `column.setFilterValue()`.
 */
export function DataTableColumnFilter<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnFilterProps<TData, TValue>) {
  const { column } = props;

  const meta = column.columnDef.meta;

  const variant = meta?.filterVariant ?? "text";

  const label = meta?.filterLabel ?? column.id;

  const clearFilter = (): void => {
    column.setFilterValue(undefined);
  };

  switch (variant) {
    case "text": {
      const value = column.getFilterValue();

      return (
        <DataTableTextFilter
          disabled={meta?.filterDisabled}
          label={label}
          value={typeof value === "string" ? value : ""}
          onChange={(nextValue) => {
            column.setFilterValue(nextValue);
          }}
          onClear={clearFilter}
        />
      );
    }

    case "number": {
      const value = column.getFilterValue();

      return (
        <DataTableNumberFilter
          disabled={meta?.filterDisabled}
          label={label}
          value={typeof value === "number" ? value : undefined}
          onChange={(nextValue) => {
            column.setFilterValue(nextValue);
          }}
          onClear={clearFilter}
        />
      );
    }

    case "number-range": {
      const value = column.getFilterValue();

      const range = isNumberRangeValue(value)
        ? value
        : ([undefined, undefined] as const);

      return (
        <DataTableNumberRangeFilter
          disabled={meta?.filterDisabled}
          label={label}
          value={range}
          onChange={(nextValue) => {
            column.setFilterValue(nextValue);
          }}
          onClear={clearFilter}
        />
      );
    }

    case "boolean": {
      const value = column.getFilterValue();

      return (
        <DataTableBooleanFilter
          disabled={meta?.filterDisabled}
          label={label}
          value={typeof value === "boolean" ? value : undefined}
          onChange={(nextValue) => {
            column.setFilterValue(nextValue);
          }}
          onClear={clearFilter}
        />
      );
    }

    case "select": {
      const value = column.getFilterValue();

      const options = meta?.filterOptions ?? [];

      const normalizedValue = isSelectFilterValue(value) ? value : undefined;

      return (
        <DataTableSelectFilter
          disabled={meta?.filterDisabled}
          loading={meta?.filterOptionsLoading}
          errorMessage={meta?.filterOptionsError}
          label={label}
          value={normalizedValue}
          options={options}
          onChange={(nextValue) => {
            column.setFilterValue(nextValue);
          }}
          onClear={clearFilter}
        />
      );
    }

    /**
     * We deliberately reserve these variants now, but don't silently
     * fake their semantics.
     *
     * Date filtering needs to be integrated with the exact MUI
     * DatePicker representation we choose.
     *
     * Multi-select needs a filterFn whose expected value is an array
     * rather than the scalar arrIncludes behavior.
     */
    case "multi-select":
    case "date":
    case "date-range":
      return (
        <Alert severity="info">
          Filter variant <strong>{variant}</strong> is reserved but not
          implemented yet.
        </Alert>
      );
  }
}

/**
 * Runtime guard for the value shape used by inNumberRange.
 *
 * `column.getFilterValue()` is intentionally broad at the generic
 * filtering boundary, so this is a legitimate runtime check.
 */
function isNumberRangeValue(
  value: unknown,
): value is DataTableNumberRangeValue {
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }

  const [min, max] = value;

  const validMin = min === undefined || typeof min === "number";

  const validMax = max === undefined || typeof max === "number";

  return validMin && validMax;
}

/**
 * Runtime guard for select-compatible filter values.
 */
function isSelectFilterValue(
  value: unknown,
): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

```

### src/components/DataTable/mui/components/filtering/DataTableTextFilter.tsx

```tsx
"use client";

//src/components/DataTable/mui/components/filtering/DataTableTextFilter.tsx

import { styled, TextField, useThemeProps } from "@mui/material";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";
import type { DataTableTextFilterProps } from "./types";

export type { DataTableTextFilterProps } from "./types";

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

  const {
    value,
    label,
    size = "small",
    className,
    sx,
    onChange,
    onClear,
  } = props;

  return (
    <Root
          disabled={props.disabled}
      ownerState={{ ...props, size }}
      fullWidth
      size={size}
      label={label}
      value={value}
      className={className}
      sx={sx}
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

import type { DataTableNumberFilterProps } from "./types";

export type { DataTableNumberFilterProps } from "./types";

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

  const {
    value,
    label,
    size = "small",
    className,
    sx,
    onChange,
    onClear,
  } = props;

  return (
    <Root
          disabled={props.disabled}
      ownerState={{ ...props, size }}
      fullWidth
      size={size}
      type="number"
      label={label}
      value={value ?? ""}
      className={className}
      sx={sx}
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
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";
import type { DataTableNumberRangeFilterProps } from "./types";

export type { DataTableNumberRangeFilterProps } from "./types";

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

  const {
    value,
    label,
    size = "small",
    className,
    sx,
    onChange,
    onClear,
  } = props;

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
          disabled={props.disabled}
        fullWidth
        size={size}
        type="number"
        label={`${label} minimum`}
        value={min ?? ""}
        className={className}
        sx={sx}
        onChange={(event) => {
          updateMin(event.target.value);
        }}
      />

      <TextField
          disabled={props.disabled}
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
import type { DataTableBooleanFilterProps } from "./types";

export type { DataTableBooleanFilterProps } from "./types";

type BooleanSelectValue = "" | "true" | "false";

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

  const {
    value,
    label,
    size = "small",
    className,
    sx,
    onChange,
    onClear,
  } = props;

  const labelId = useId();

  const selectValue: BooleanSelectValue =
    value === undefined ? "" : value ? "true" : "false";

  return (
    <Root
      disabled={props.disabled}
      ownerState={{ ...props, size }}
      className={className}
      fullWidth
      size={size}
      sx={sx}
    >
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
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  styled,
  useThemeProps,
} from "@mui/material";
import { useId } from "react";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";
import {
  decodeDataTableSelectFilterValue,
  encodeDataTableSelectFilterValue,
} from "./selectFilterValue";
import type { DataTableSelectFilterProps } from "./types";

export type { DataTableSelectFilterProps } from "./types";

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

  const {
    value,
    label,
    size = "small",
    disabled = false,
    loading = false,
    errorMessage,
    className,
    sx,
    options,
    onChange,
    onClear,
  } = props;

  const labelId = useId();
  const statusId = useId();
  const unavailable = disabled || loading || Boolean(errorMessage);
  const statusText = loading ? "Loading options…" : errorMessage;

  const selectedValue =
    value === undefined ? "" : encodeDataTableSelectFilterValue(value);
  // Keep committed values representable during loading and after option removal.
  // Never clear TanStack state just because its option is temporarily absent.
  const missingSelection =
    value !== undefined && !options.some(
      (option) => encodeDataTableSelectFilterValue(option.value) === selectedValue,
    );

  return (
    <Root
      ownerState={{ ...props, size, disabled: unavailable, loading }}
      fullWidth
      size={size}
      disabled={unavailable}
      error={Boolean(errorMessage) && !loading}
    >
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select
        labelId={labelId}
        label={label}
        value={selectedValue}
        inputProps={{
          "aria-describedby": statusText ? statusId : undefined,
          "aria-busy": loading,
        }}
        className={className}
        sx={sx}
        onChange={(event) => {
          if (unavailable) {
            return;
          }
          const encoded = event.target.value;

          if (encoded === "") {
            onClear();

            return;
          }

          onChange(decodeDataTableSelectFilterValue(encoded));
        }}
      >
        <MenuItem value="">All</MenuItem>
        {missingSelection && (
          <MenuItem value={selectedValue} disabled>
            {String(value)}
          </MenuItem>
        )}

        {options.map((option) => {
          const encodedValue = encodeDataTableSelectFilterValue(option.value);

          return (
            <MenuItem key={encodedValue} value={encodedValue}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
      {statusText && (
        <FormHelperText id={statusId} role={loading ? "status" : "alert"}>
          {statusText}
        </FormHelperText>
      )}
    </Root>
  );
}

```

### src/features/i18n/translation-keys/columns/translationKeyColumns.tsx

```tsx
"use client";

// src/features/i18n/translation-keys/columns/translationKeyColumns.tsx

import { Tooltip, Typography } from "@mui/material";
// import {
//   createMuiDataTableColumnHelper,
//   DataTableRowNumberCell,
// } from "@/components/DataTable";
import { DataTableRowNumberCell } from "@/components/DataTable/mui/components";
import { createMuiDataTableColumnHelper } from "@/components/DataTable/mui/table";
import type { TranslationKey } from "../schemas";
import type { MuiDataTableFilterOption } from "@/components/DataTable/mui/meta";
import { TRANSLATION_KEY_COLUMN_IDS } from "../server";
import {
  TranslationKeyCategoryCell,
  TranslationKeyDateTimeCell,
  TranslationKeyEmptyCell,
  TranslationKeyLocalesCell,
  TranslationKeyValuesCell,
} from "./translationKeyCells";
import { TRANSLATION_KEY_LOCALE_FILTER_OPTIONS } from "./translationKeyFilterOptions";

/**
 * ------------------------------------------------------------------
 * Dynamic TranslationKey column configuration
 * ------------------------------------------------------------------
 *
 * Category options come from the resource API and therefore cannot be
 * embedded permanently into a static column definition.
 *
 * The column factory receives resource-owned option collections while
 * keeping the generic DataTable completely unaware of TranslationKey.
 */
export interface CreateTranslationKeyColumnsOptions {
  /**
   * Category options returned by:
   *
   *   GET /api/v1/i18n/categories
   *
   * Expected shape:
   *
   *   [
   *     {
   *       label: "auth",
   *       value: 2
   *     }
   *   ]
   */
  readonly categoryFilterOptions: readonly MuiDataTableFilterOption[];
  readonly categoryFilterOptionsFetching?: boolean;
  readonly categoryFilterOptionsError?: unknown;

  /**
   * Locale options remain overridable so the application's future
   * supported-locale registry can become the source without requiring
   * another column refactor.
   */
  readonly localeFilterOptions?: readonly MuiDataTableFilterOption[];
}

/**
 * ------------------------------------------------------------------
 * MUI-family column helper
 * ------------------------------------------------------------------
 *
 * This is NOT TanStack's generic createColumnHelper().
 *
 * It comes from our configured:
 *
 *   createTableHook({
 *     features: muiDataTableFeatures,
 *     ...
 *   })
 *
 * and therefore permanently carries the MUI DataTable feature family.
 *
 * The configured DataTable MUI family gives us a column helper whose
 * feature set and registered App components are already bound.
 *
 * This is the v9 path:
 *
 *   createTableHook()
 *       ↓
 *   createMuiDataTableColumnHelper<TData>()
 *
 * rather than creating raw v8 MRT-style column definitions.
 */
const columnHelper = createMuiDataTableColumnHelper<TranslationKey>();

/**
 * Create the TranslationKey column family.
 *
 * This is deliberately a pure function.
 *
 * It:
 *
 * - performs no fetching
 * - owns no React state
 * - owns no query lifecycle
 * - knows nothing about HTTP
 *
 * Resource data required by column presentation is supplied by the
 * caller.
 */
export function createTranslationKeyColumns(
  options: CreateTranslationKeyColumnsOptions,
) {
  const {
    categoryFilterOptions,
    categoryFilterOptionsFetching = false,
    categoryFilterOptionsError,
    localeFilterOptions = TRANSLATION_KEY_LOCALE_FILTER_OPTIONS,
  } = options;

  /**
   * ------------------------------------------------------------------
   * TranslationKey column family
   * ------------------------------------------------------------------
   *
   * Server capabilities:
   *
   *                 sort    filter
   * --------------------------------
   * id               yes      yes
   * key              yes      yes
   * description       no      yes
   * category          yes      yes
   * locale            no      yes
   * translations      no       no
   * createdAt         yes       no
   * updatedAt         yes       no
   *
   * IMPORTANT:
   *
   * These capabilities deliberately mirror:
   *
   *   translationKeyServerQueryAdapter
   *
   * because unknown server mappings currently use:
   *
   *   "throw"
   */
  return columnHelper.columns([
    /**
     * ==============================================================
     * Sequential row number
     * ==============================================================
     *
     * Presentation-only.
     *
     * Never exposed to:
     *
     * - sorting
     * - filtering
     * - API
     * - Prisma
     */
    columnHelper.display({
      id: TRANSLATION_KEY_COLUMN_IDS.rowNumber,
      header: "No.",
      /**
       * This is presentation only.
       *
       * It is NOT a database/API field, so the server must never receive:
       *
       * sorting:
       *   rowNumber
       *
       * or:
       *
       * filtering:
       *   rowNumber
       */
      enableSorting: false,
      enableColumnFilter: false,

      /**
       * Structural presentation column.
       *
       * Normally users should not hide the sequential number.
       */
      enableHiding: false,

      /**
       * Keep it compact and stable.
       */
      enableResizing: false,

      /**
       * Its size is intentionally compact and stable.
       */
      size: 64,
      minSize: 56,
      maxSize: 72,
      meta: {
        align: "center",
        headerAlign: "center",

        /**
         * Presentation-only columns do not need column actions.
         */
        enableColumnMenu: false,
      },

      /**
       * Sequential position across SERVER pages.
       *
       * Current page:
       *
       *   row.index = 0..24
       *
       * pageIndex 0:
       *
       *   0 * 25 + row.index + 1
       *     ↓
       *   1..25
       *
       * pageIndex 1:
       *
       *   1 * 25 + row.index + 1
       *     ↓
       *   26..50
       */
      cell: ({ row }) => <DataTableRowNumberCell rowIndex={row.index} />,
    }),

    /**
     * ==============================================================
     * Translation key
     * ==============================================================
     *
     * Server:
     *
     * sorting:
     *   key
     *
     * filtering:
     *   key contains string
     */
    columnHelper.accessor("key", {
      id: TRANSLATION_KEY_COLUMN_IDS.key,
      header: "Key",
      enableSorting: true,
      enableColumnFilter: true,
      size: 240,
      minSize: 160,
      maxSize: 420,
      meta: {
        filterVariant: "text",
        filterLabel: "Key contains",
      },
      cell: ({ getValue }) => (
        <Tooltip title={getValue()}>
          <Typography
            component="span"
            variant="body2"
            noWrap
            sx={{
              /**
               * Existing styling retained for now.
               *
               * This moves into a resource/MUI slot during the later
               * styling audit.
               */
              fontFamily: "monospace",
              fontWeight: 600,
            }}
          >
            {getValue()}
          </Typography>
        </Tooltip>
      ),
    }),

    /**
     * ==============================================================
     * Description
     * ==============================================================
     *
     * Backend policy allows filtering but currently does NOT expose
     * description as a sorting field.
     *
     * Server:
     *
     * sorting:
     *   unsupported
     *
     * filtering:
     *   description contains string
     */
    columnHelper.accessor("description", {
      id: TRANSLATION_KEY_COLUMN_IDS.description,
      header: "Description",

      /**
       * Backend policy currently does not expose Description as a
       * sortable field.
       */
      enableSorting: false,
      enableColumnFilter: true,
      size: 280,
      minSize: 180,
      meta: {
        filterVariant: "text",
        filterLabel: "Description contains",
      },
      cell: ({ getValue }) => {
        const description = getValue();

        return description ? (
          <Typography component="span" variant="body2" noWrap>
            {description}
          </Typography>
        ) : (
          <TranslationKeyEmptyCell />
        );
      },
    }),

    /**
     * ==============================================================
     * Category
     * ==============================================================
     *
     * This column is intentionally asymmetric.
     *
     * DISPLAY
     *
     *   row.translationCategory.name
     *
     * SORT
     *
     *   column "category"
     *       ↓
     *   API field "category"
     *       ↓
     *   Nest categoryName
     *       ↓
     *   Prisma translationCategory.name
     *
     * FILTER
     *
     *   category select
     *       ↓
     *   numeric category ID
     *       ↓
     *   API field "categoryId"
     *       ↓
     *   Prisma categoryId
     *
     * Example:
     *
     *   visible:
     *     auth
     *
     *   stored filter value:
     *     2
     */
    columnHelper.accessor((row) => row.translationCategory.name, {
      id: TRANSLATION_KEY_COLUMN_IDS.category,
      header: "Category",
      enableSorting: true,
      enableColumnFilter: true,
      size: 180,
      minSize: 140,
      maxSize: 280,
      meta: {
        align: "center",

        /**
         * IMPORTANT:
         *
         * This replaces the previous incorrect:
         *
         *   filterVariant: "text"
         *
         * because the server mapper expects categoryId:number.
         */
        filterVariant: "select",

        filterLabel: "Category",
        filterOptions: categoryFilterOptions,
        filterOptionsLoading: categoryFilterOptionsFetching,
        filterDisabled: categoryFilterOptionsError != null,
        filterOptionsError: categoryFilterOptionsError != null
          ? "Category options could not be loaded."
          : undefined,
      },
      cell: ({ getValue }) => <TranslationKeyCategoryCell name={getValue()} />,
    }),

    /**
     * ==============================================================
     * Locale availability
     * ==============================================================
     *
     * One TranslationKey may contain multiple translations.
     *
     * The accessor is useful for display, but sorting is disabled
     * because there is no meaningful singular locale ordering.
     *
     * Filtering remains enabled:
     *
     *   column id "locale"
     *       ↓
     *   semantic "locale"
     *       ↓
     *   Nest translations.some.locale
     *
     * Presentation value:
     *
     *   en, km, ...
     *
     * but filtering uses an individual selected locale:
     *
     *   "km"
     *
     * which becomes:
     *
     *   locale equals "km"
     *
     * on the server.
     *
     * Display:
     *
     *   EN KM ...
     *
     * Filter value:
     *
     *   "en"
     *
     * Server:
     *
     *   locale equals "en"
     *
     * Nest:
     *
     *   translations.some.locale
     */
    columnHelper.accessor(
      (row) =>
        row.translations.map((translation) => translation.locale).join(", "),
      {
        id: TRANSLATION_KEY_COLUMN_IDS.locale,
        header: "Locales",

        /**
         * Locale is not currently a server-sortable field.
         */
        enableSorting: false,
        enableColumnFilter: true,
        size: 180,
        minSize: 140,
        maxSize: 320,
        meta: {
          align: "center",
          filterVariant: "select",
          filterLabel: "Locale",
          filterOptions: localeFilterOptions,
        },
        cell: ({ row, column }) => (
          <TranslationKeyLocalesCell
            translations={row.original.translations}
            align={column.columnDef.meta?.align}
          />
        ),
      },
    ),

    /**
     * ==============================================================
     * Translation values
     * ==============================================================
     *
     * This is a presentation-only column.
     *
     * Global search still searches translation values through the
     * server-owned global-search policy.
     *
     * That does NOT mean this individual column needs a column filter.
     *
     * It must NEVER enter sorting/filter state because the resource
     * semantic adapter intentionally has no mapping for this column.
     */
    columnHelper.accessor(
      (row) =>
        row.translations.map((translation) => translation.value).join(" | "),
      {
        id: TRANSLATION_KEY_COLUMN_IDS.translations,
        header: "Translations",
        enableSorting: false,
        enableColumnFilter: false,
        size: 420,
        minSize: 240,
        maxSize: 550,
        cell: ({ row }) => (
          <TranslationKeyValuesCell translations={row.original.translations} />
        ),
      },
    ),

    /**
     * ==============================================================
     * Created
     * ==============================================================
     *
     * Server sorting supported.
     *
     * Date filtering remains disabled until the date/date-range
     * protocol is implemented explicitly.
     */
    columnHelper.accessor("createdAt", {
      id: TRANSLATION_KEY_COLUMN_IDS.createdAt,
      header: "Created",
      enableSorting: true,
      enableColumnFilter: false,
      size: 190,
      minSize: 170,
      cell: ({ getValue }) => <TranslationKeyDateTimeCell value={getValue()} />,
    }),

    /**
     * ==============================================================
     * Updated
     * ==============================================================
     */
    columnHelper.accessor("updatedAt", {
      id: TRANSLATION_KEY_COLUMN_IDS.updatedAt,
      header: "Updated",
      enableSorting: true,
      enableColumnFilter: false,
      size: 190,
      minSize: 170,
      maxSize: 260,
      cell: ({ getValue }) => <TranslationKeyDateTimeCell value={getValue()} />,
    }),
  ]);
}

```

### src/features/i18n/translation-keys/table/useTranslationKeyDataTable.ts

```tsx
"use client";

import { useMemo } from "react";
import { useTheme } from "@mui/material";
import {
  createDataTableServerTableBinding,
  useDataTableServerResult,
  useDataTableServerState,
  useMuiDataTable,
} from "@/components/DataTable";
import type {
  DataTableServerResultLifecycle,
  DataTableServerStateController,
} from "@/components/DataTable";
import { createTranslationKeyColumns } from "../columns";
import type { TranslationKey } from "../schemas";
import { useTranslationKeyDataTableRequest } from "./useTranslationKeyDataTableRequest";
import { useTranslationKeyFilterOptions } from "./useTranslationKeyFilterOptions";
import type { TranslationKeyFilterOptionsState } from "./useTranslationKeyFilterOptions";

/**
 * Complete TranslationKey DataTable controller result.
 *
 * Return type of the first real TranslationKey server-backed table
 * controller.
 *
 * Keeping query/result/request alongside the table instance makes the
 * resource component able to drive:
 *
 * - loading UI
 * - progress UI
 * - refresh
 * - error UI
 * - toolbar controls
 *
 * without putting transport knowledge into the renderer.
 */
export interface UseTranslationKeyDataTableResult {
  readonly table: ReturnType<typeof useMuiDataTable<TranslationKey>>;

  /**
   * Controlled server-query state.
   */
  readonly query: DataTableServerStateController;

  /**
   * Presentation-ready server-result lifecycle.
   */
  readonly server: DataTableServerResultLifecycle<TranslationKey>;

  /**
   * Resource filter-option lifecycle.
   */
  readonly filterOptions: TranslationKeyFilterOptionsState;

  /**
   * Explicitly refresh TranslationKey rows.
   */
  readonly refresh: () => void;
}

/**
 * Complete TranslationKey server-backed DataTable controller.
 *
 * Resource orchestration:
 *
 *   category options
 *         ↓
 *   resource columns
 *
 *
 *   server query state
 *         ↓
 *   resource request
 *         ↓
 *   normalized lifecycle
 *         ↓
 *   TanStack binding
 *         ↓
 *   useMuiDataTable()
 */
export function useTranslationKeyDataTable(): UseTranslationKeyDataTableResult {
  const theme = useTheme();

  /**
   * ================================================================
   * 1. Resource filter-option data
   * ================================================================
   *
   * This currently loads TranslationCategory records.
   *
   * It deliberately does NOT belong to the main table-query request.
   */
  const filterOptions = useTranslationKeyFilterOptions();

  /**
   * ================================================================
   * 2. Build resource columns
   * ================================================================
   *
   * Column identity should remain stable while the option collections
   * themselves remain stable.
   */
  const columns = useMemo(
    () =>
      createTranslationKeyColumns({
        categoryFilterOptions: filterOptions.categoryOptions,
        categoryFilterOptionsFetching: filterOptions.fetching,
        categoryFilterOptionsError: filterOptions.error,

        localeFilterOptions: filterOptions.localeOptions,
      }),
    [filterOptions.categoryOptions, filterOptions.localeOptions, filterOptions.fetching, filterOptions.error],
  );

  /**
   * --------------------------------------------------------------
   * 3. Server query state
   * --------------------------------------------------------------
   *
   * TanStack-facing pagination is zero-based:
   *
   *   pageIndex: 0
   *
   * The Standard API adapter later converts it to:
   *
   *   page: 1
   */
  const query = useDataTableServerState({
    defaultPageSize: 25,
    defaultState: {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      sorting: [
        /**
         * Optional initial table sort.
         *
         * The backend itself already provides deterministic default
         * ordering when sorting is empty, so we do not need to
         * manufacture a client sort here.
         */
      ],
      columnFilters: [],
      globalFilter: "",
    },

    /**
     * These are already true by default, but listing them here makes
     * this resource's server behavior explicit.
     */
    resetPageOnSortingChange: true,
    resetPageOnColumnFiltersChange: true,
    resetPageOnGlobalFilterChange: true,
  });

  /**
   * --------------------------------------------------------------
   * 4. Execute TranslationKey resource query
   * --------------------------------------------------------------
   */
  const request = useTranslationKeyDataTableRequest(query.state);

  /**
   * ================================================================
   * 5. Generic server-result lifecycle
   * ================================================================
   *
   * This gives us:
   *
   *   rows
   *   pagination
   *   initial loading
   *   background refresh
   *   previous-result preservation
   *   blocking error
   *   refresh error
   */
  const server = useDataTableServerResult<TranslationKey>({
    query: query.state,
    result: request.result,
    loading: request.loading,
    fetching: request.fetching,
    error: request.error,

    /**
     * Preserve current rows while:
     *
     * - sorting
     * - filtering
     * - searching
     * - paginating
     * - refreshing
     */
    keepPreviousResult: true,
  });

  /**
   * ================================================================
   * 6. Generic server -> TanStack binding
   * ================================================================
   *
   * Produces:
   *
   *   data
   *   state
   *   onPaginationChange
   *   onSortingChange
   *   onColumnFiltersChange
   *   onGlobalFilterChange
   *
   *   manualPagination: true
   *   manualSorting: true
   *   manualFiltering: true
   *
   *   pageCount
   */
  const binding = createDataTableServerTableBinding<TranslationKey>({
    query,
    result: server,
  });

  /**
   * --------------------------------------------------------------
   * 7. Create the actual TanStack v9 MUI table
   * --------------------------------------------------------------
   *
   * No useReactTable.
   *
   * This is our configured createTableHook() family.
   */
  const table = useMuiDataTable({
    ...binding,

    columns,

    /**
     * TranslationKey.id is stable across pagination and refreshes.
     *
     * Never use the current row index as server-backed row identity.
     */
    getRowId: (row) => String(row.id),

    /**
     * ------------------------------------------------------------
     * Sorting
     * ------------------------------------------------------------
     * Resource capabilities.
     *
     * Individual columns further narrow these.
     */
    enableSorting: true,

    /**
     * Backend supports up to 10 sorting descriptors.
     *
     * Keep the client-side capability aligned with the server
     * structural validation limit.
     */
    enableMultiSort: true,

    /**
     * Keep browser capability aligned with backend validation.
     */
    maxMultiSortColCount: 10,

    /**
     * ------------------------------------------------------------
     * Global search
     * ------------------------------------------------------------
     * Global search is already safe:
     *
     * UI string
     *   ↓
     * semantic resource capability
     *   ↓
     * Standard API sends only search.term
     *   ↓
     * Nest owns actual searchable fields
     */
    enableGlobalFilter: true,

    /**
     * ------------------------------------------------------------
     * Column filtering
     * ------------------------------------------------------------
     *
     * Phase 1.7.10.5:
     *
     * The resource-aware filter mappings are now complete:
     *
     *   key
     *       text -> contains
     *
     *   description
     *       text -> contains
     *
     *   category
     *       select<number> -> categoryId equals
     *
     *   locale
     *       select<string> -> locale equals
     */
    enableColumnFilters: true,

    /**
     * ------------------------------------------------------------
     * Resizing
     * ------------------------------------------------------------
    
     * TanStack logical resize direction should agree with the MUI
     * theme.
     *
     * Your renderer explicitly notes that this belongs at table
     * creation time rather than being mutated by the renderer.
     */
    columnResizeDirection: theme.direction,

    /**
     * ------------------------------------------------------------
     * Server-owned transformations
     * ------------------------------------------------------------
     *
     * These are also supplied by binding. Keeping them explicit here
     * documents the resource's contract.
     *
     * Server-backed tables should never apply local filtering or
     * sorting to the currently loaded page.
     *
     * The binding already sets the manual flags, these options only
     * express that the UI capabilities themselves are enabled.
     */
    manualPagination: true,

    manualSorting: true,

    manualFiltering: true,
  });

  return {
    /**
     * Completed MUI-family TanStack v9 table.
     */
    table,

    /**
     * Controlled server query state.
     */
    query,

    /**
     * Presentation-ready server lifecycle.
     */
    server,

    /**
     * ------------------------------------------------------------
     * Filter options
     * ------------------------------------------------------------
     */
    filterOptions,

    /**
     * Explicit reload without changing query state.
     */
    refresh: request.refresh,
  };
}

```

### src/features/i18n/translation-keys/table/useTranslationKeyFilterOptions.ts

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MuiDataTableFilterOption } from "@/components/DataTable/mui/meta";
import { getTranslationCategories } from "../api";
import {
  createTranslationKeyCategoryFilterOptions,
  TRANSLATION_KEY_LOCALE_FILTER_OPTIONS,
} from "../columns";
import type { TranslationCategory } from "../schemas";

/**
 * Resource-owned filter-option lifecycle.
 *
 * These options are NOT table rows and should not be mixed with the
 * main TranslationKey DataTable request lifecycle.
 */
export interface TranslationKeyFilterOptionsState {
  /**
   * Category values suitable for DataTable's generic select filter.
   *
   * Example:
   *
   *   {
   *     label: "auth",
   *     value: 2
   *   }
   */
  readonly categoryOptions: readonly MuiDataTableFilterOption[];

  /**
   * Current application TranslationKey locale options.
   */
  readonly localeOptions: readonly MuiDataTableFilterOption[];

  /**
   * Initial category-option request.
   */
  readonly loading: boolean;

  /**
   * Any category-option request currently running.
   */
  readonly fetching: boolean;

  /**
   * Non-abort request error.
   */
  readonly error: unknown;

  /**
   * Explicitly reload category options.
   */
  readonly refresh: () => void;
}

/**
 * Browser AbortController cancellation is normal lifecycle behavior,
 * not a user-visible error.
 */
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * Load resource-owned values needed by TranslationKey column filters.
 *
 * Current remote option source:
 *
 *   TranslationCategory[]
 *
 * Locale options are currently application-static and can later be
 * replaced by the application's canonical locale registry without
 * changing the DataTable layer.
 */
export function useTranslationKeyFilterOptions(): TranslationKeyFilterOptionsState {
  const [categories, setCategories] = useState<readonly TranslationCategory[]>(
    [],
  );

  // The initial render must not expose an enabled empty Category select.
  const [fetching, setFetching] = useState(true);

  const [error, setError] = useState<unknown>(undefined);

  /**
   * Distinguish:
   *
   *   first load
   *
   * from:
   *
   *   later refresh
   */
  const hasLoadedRef = useRef(false);

  /**
   * Prevent an obsolete request from committing even if a future
   * transport implementation ever ignores AbortSignal.
   */
  const requestIdRef = useRef(0);

  const [refreshRevision, setRefreshRevision] = useState(0);

  const refresh = useCallback((): void => {
    setRefreshRevision((revision) => revision + 1);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;

    setFetching(true);
    setError(undefined);

    void getTranslationCategories(abortController.signal)
      .then((response) => {
        if (
          abortController.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setCategories(response.data);

        hasLoadedRef.current = true;
      })
      .catch((requestError: unknown) => {
        if (
          abortController.signal.aborted ||
          isAbortError(requestError) ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setError(requestError);
      })
      .finally(() => {
        if (
          abortController.signal.aborted ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setFetching(false);
      });

    return () => {
      abortController.abort();
    };
  }, [refreshRevision]);

  /**
   * Keep option identity stable until the category resource actually
   * changes.
   *
   * This is useful because the result becomes part of our memoized
   * column definition.
   */
  const categoryOptions = useMemo(
    () => createTranslationKeyCategoryFilterOptions(categories),
    [categories],
  );

  const loading = fetching && !hasLoadedRef.current;

  return {
    categoryOptions,
    localeOptions: TRANSLATION_KEY_LOCALE_FILTER_OPTIONS,
    loading,
    fetching,
    error,
    refresh,
  };
}

```

### src/features/i18n/translation-keys/columns/translationKeyColumns.spec.tsx

```tsx
import { createTranslationKeyColumns } from "./translationKeyColumns";

import { TRANSLATION_KEY_COLUMN_IDS } from "../server";

describe("TranslationKey columns", () => {
  const categoryFilterOptions = [
    {
      label: "auth",
      value: 2,
    },
    {
      label: "common",
      value: 1,
    },
  ] as const;

  const localeFilterOptions = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Khmer",
      value: "km",
    },
  ] as const;

  const columns = createTranslationKeyColumns({
    categoryFilterOptions,
    localeFilterOptions,
  });

  function getColumn(id: string) {
    const column = columns.find((candidate) => candidate.id === id);

    if (!column) {
      throw new Error(`TranslationKey column "${id}" was not found.`);
    }

    return column;
  }

  it("defines the presentation-only row-number column", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.rowNumber);

    expect(column.enableSorting).toBe(false);

    expect(column.enableColumnFilter).toBe(false);

    expect(column.enableHiding).toBe(false);

    expect(column.enableResizing).toBe(false);

    expect(column.meta?.enableColumnMenu).toBe(false);

    expect(column.meta?.align).toBe("center");

    expect(column.meta?.headerAlign).toBe("center");
  });

  it("configures Key as sortable text filtering", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.key);

    expect(column.enableSorting).toBe(true);

    expect(column.enableColumnFilter).toBe(true);

    expect(column.meta?.filterVariant).toBe("text");

    expect(column.meta?.filterLabel).toBe("Key contains");
  });

  it("configures Description as filterable but not sortable", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.description);

    expect(column.enableSorting).toBe(false);

    expect(column.enableColumnFilter).toBe(true);

    expect(column.meta?.filterVariant).toBe("text");
  });

  it("configures Category as a numeric-value select filter", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.category);

    expect(column.enableSorting).toBe(true);

    expect(column.enableColumnFilter).toBe(true);

    expect(column.meta?.filterVariant).toBe("select");

    expect(column.meta?.filterOptions).toEqual(categoryFilterOptions);

    /**
     * This is the important part:
     *
     * labels are category names,
     * values are category IDs.
     */
    expect(column.meta?.filterOptions).toContainEqual({
      label: "auth",
      value: 2,
    });
  });

  it("configures Locale as an exact scalar select filter", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.locale);

    expect(column.enableSorting).toBe(false);

    expect(column.enableColumnFilter).toBe(true);

    expect(column.meta?.filterVariant).toBe("select");

    expect(column.meta?.filterOptions).toEqual(localeFilterOptions);
  });

  it.each([
    { fetching: true, error: undefined, disabled: false, message: undefined },
    { fetching: false, error: new Error("private transport details"), disabled: true, message: "Category options could not be loaded." },
    { fetching: false, error: undefined, disabled: false, message: undefined },
  ])("keeps option lifecycle local to Category ($fetching, $disabled)", ({ fetching, error, disabled, message }) => {
    const current = createTranslationKeyColumns({
      categoryFilterOptions,
      localeFilterOptions,
      categoryFilterOptionsFetching: fetching,
      categoryFilterOptionsError: error,
    });
    const category = current.find((column) => column.id === TRANSLATION_KEY_COLUMN_IDS.category)!;
    expect(category.meta).toMatchObject({
      filterOptionsLoading: fetching,
      filterDisabled: disabled,
      filterOptionsError: message,
      filterOptions: categoryFilterOptions,
    });
    expect(category.enableColumnFilter).toBe(true);
    for (const column of current.filter((column) => column.id !== TRANSLATION_KEY_COLUMN_IDS.category)) {
      expect(column.meta?.filterDisabled).toBeUndefined();
      expect(column.meta?.filterOptionsLoading).toBeUndefined();
      expect(column.meta?.filterOptionsError).toBeUndefined();
    }
  });

  it("keeps the Translations preview presentation-only", () => {
    const column = getColumn(TRANSLATION_KEY_COLUMN_IDS.translations);

    expect(column.enableSorting).toBe(false);

    expect(column.enableColumnFilter).toBe(false);
  });

  it.each([
    TRANSLATION_KEY_COLUMN_IDS.createdAt,
    TRANSLATION_KEY_COLUMN_IDS.updatedAt,
  ])("allows server sorting but not date filtering for %s", (columnId) => {
    const column = getColumn(columnId);

    expect(column.enableSorting).toBe(true);

    expect(column.enableColumnFilter).toBe(false);
  });
});

```

### src/components/DataTable/mui/components/filtering/filterAsyncState.spec.tsx

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { DataTableSelectFilter } from "./DataTableSelectFilter";
import { DataTableTextFilter } from "./DataTableTextFilter";
import { DataTableNumberFilter } from "./DataTableNumberFilter";
import { DataTableNumberRangeFilter } from "./DataTableNumberRangeFilter";
import { DataTableBooleanFilter } from "./DataTableBooleanFilter";

it("preserves a missing committed value across loading, failure, and recovery; All clears", () => {
  const onChange = jest.fn();
  const onClear = jest.fn();
  const props = { label: "Category", value: 2, onChange, onClear };
  const { rerender } = render(<DataTableSelectFilter {...props} options={[]} loading />);
  expect(screen.getByRole("combobox", { name: "Category" })).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("status")).toHaveTextContent("Loading options");
  expect(screen.getByRole("combobox")).toHaveTextContent("2");
  rerender(<DataTableSelectFilter {...props} options={[]} errorMessage="Options unavailable" />);
  expect(screen.getByRole("alert")).toHaveTextContent("Options unavailable");
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-disabled", "true");
  expect(onClear).not.toHaveBeenCalled();
  expect(onChange).not.toHaveBeenCalled();
  rerender(<DataTableSelectFilter {...props} options={[{ label: "Auth", value: 2 }]} />);
  expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("combobox")).toHaveTextContent("Auth");
  fireEvent.mouseDown(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "All" }));
  expect(onClear).toHaveBeenCalledTimes(1);
  expect(onChange).not.toHaveBeenCalled();
});

it("disables all leaf editor inputs while leaving an independent select enabled", () => {
  const callbacks = { onChange: jest.fn(), onClear: jest.fn() };
  render(<>
    <DataTableTextFilter {...callbacks} disabled label="Text" value="" />
    <DataTableNumberFilter {...callbacks} disabled label="Number" value={undefined} />
    <DataTableNumberRangeFilter {...callbacks} disabled label="Range" value={[undefined, undefined]} />
    <DataTableBooleanFilter {...callbacks} disabled label="Boolean" value={undefined} />
    <DataTableSelectFilter {...callbacks} label="Locale" value={undefined} options={[]} />
  </>);
  for (const label of ["Text", "Number", "Range minimum", "Range maximum"]) {
    expect(screen.getByLabelText(label)).toBeDisabled();
  }
  expect(screen.getByRole("combobox", { name: "Boolean" })).toHaveAttribute("aria-disabled", "true");
  expect(screen.getByRole("combobox", { name: "Locale" })).not.toHaveAttribute("aria-disabled", "true");
});

```

### src/features/i18n/translation-keys/table/useTranslationKeyFilterOptions.spec.tsx

```tsx
import { act, renderHook, waitFor } from "@testing-library/react";
import { getTranslationCategories } from "../api";
import { useTranslationKeyFilterOptions } from "./useTranslationKeyFilterOptions";

jest.mock("../api", () => ({ getTranslationCategories: jest.fn() }));

it("starts busy on the first render and clears a failed option request when retrying", async () => {
  const error = new Error("Category request failed");
  const request = jest.mocked(getTranslationCategories);
  request.mockRejectedValueOnce(error);
  request.mockImplementation(() => new Promise(() => {}));
  const renders: boolean[] = [];
  const { result, unmount } = renderHook(() => {
    const state = useTranslationKeyFilterOptions();
    renders.push(state.fetching);
    return state;
  });
  expect(renders[0]).toBe(true);
  await waitFor(() => expect(result.current.error).toBe(error));
  expect(result.current.fetching).toBe(false);
  act(() => result.current.refresh());
  await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
  expect(result.current.fetching).toBe(true);
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBeUndefined();
  const signal = request.mock.calls[1][0];
  unmount();
  expect(signal?.aborted).toBe(true);
});

```
