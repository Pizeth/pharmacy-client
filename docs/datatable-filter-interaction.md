# Phase 1.7.10.6B.5 — Filter interaction polish

This phase changes two behaviors: clear-all is atomic, and a select menu closes
when its option state becomes unavailable. It preserves the existing toolbar
styling and TanStack ownership of filter values.

## Atomic clear-all

Previously, the status chip iterated over active filters, looked up each column,
and called `column.setFilterValue(undefined)`. That issued separate updates and
could leave filters for columns that no longer exist.

The action now calls:

```ts
table.setColumnFilters([]);
```

This clears the entire column-filter state in one update. It also clears orphaned
IDs, works while the row is hidden or Category is disabled, and does not alter
global search. Existing server-state pagination reset logic continues to handle
that filter change; this phase does not introduce a second reset mechanism.

The chip keeps its visible `1 filter` / `N filters` label and delete action. Its
accessible name now explicitly describes the operation:

```tsx
aria-label={`Clear all column filters (${activeCount} active)`}
onClick={clearFilters}
onDelete={clearFilters}
```

Clicking the chip performs the action; MUI's existing keyboard deletion behavior
is retained. The tests verify both click and Delete-key paths invoke one update.

## Async menu transitions

A background option refresh can start while a select menu is open. The select
now owns only menu visibility as presentation state:

```tsx
const [open, setOpen] = useState(false);

useEffect(() => {
  if (unavailable) setOpen(false);
}, [unavailable]);

// Select props:
// open={open && !unavailable}
// onOpen={() => setOpen(true)}
// onClose={() => setOpen(false)}
```

The open expression closes the menu immediately when unavailable. The effect
resets the remembered open state, so recovery does not reopen it unexpectedly.
The selected value remains controlled by the caller throughout this transition.
The existing disabled guard on selection callbacks remains in place.

## Canonical filter state

The filter toggle still changes visibility only. The status count and badge still
subscribe to `columnFilters`. Active-filter indication still reads TanStack's
`column.getIsFiltered()`. There is no duplicated filter registry or local selected
value. Loading/error state continues to affect only the Category editor, as
implemented and tested in 6B.4.

## Acceptance scope

Validation: typechecking and TanStack feature synchronization passed; all 71
tests across 12 suites passed; `git diff --check` passed.

New real-table tests combine an unavailable Category editor, active Category and
Locale filters, an orphaned column ID, global search, toggle visibility, status,
and an active indicator. They verify that hiding preserves state, clear-all sends
one update, global search survives, the status/indicator disappear, and reopening
the row leaves the still-unavailable Category disabled.

A separate select test opens the menu, begins a refresh, and recovers while
checking that no value-change or clear callback fires. Existing tests continue
to verify loading/error feedback and the All option.

Actual browser layout, HTTP request combinations, and pagination acceptance
remain for 6B.6. These are component/state tests, not browser acceptance results.

## Complete source

The following snapshot includes every source and test file changed in this phase.

### src/components/DataTable/mui/components/toolbar/DataTableToolbarFilterStatus.tsx

```tsx
// src/components/DataTable/mui/components/toolbar/DataTableToolbarFilterStatus.tsx

"use client";

import { Chip } from "@mui/material";
import { FilterAltOffOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";

export interface DataTableToolbarFilterStatusProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Compact status surface for active column filters.
 *
 * This does not include global search because globalFilter is a
 * separate TanStack state slice with its own UI.
 */
export function DataTableToolbarFilterStatus<TData extends RowData>(
  props: DataTableToolbarFilterStatusProps<TData>,
) {
  const { table } = props;

  return (
    <table.Subscribe selector={(state) => state.columnFilters}>
      {(columnFilters) => {
        const activeCount = columnFilters.length;

        if (activeCount === 0) {
          return null;
        }

        const clearFilters = (): void => {
          // One update clears even stale column IDs without changing search.
          table.setColumnFilters([]);
        };

        return (
          <Chip
            size="small"
            variant="outlined"
            label={activeCount === 1 ? "1 filter" : `${activeCount} filters`}
            aria-label={`Clear all column filters (${activeCount} active)`}
            onClick={clearFilters}
            deleteIcon={<FilterAltOffOutlined fontSize="small" />}
            onDelete={clearFilters}
            sx={{
              flexShrink: 0,
            }}
          />
        );
      }}
    </table.Subscribe>
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
import { useEffect, useId, useState } from "react";
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
  const [open, setOpen] = useState(false);

  // A background refresh may begin while the menu is open. Close it and
  // require a new user action after recovery, without changing filter state.
  useEffect(() => {
    if (unavailable) setOpen(false);
  }, [unavailable]);

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
        open={open && !unavailable}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
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

### src/components/DataTable/mui/components/filtering/filterInteraction.spec.tsx

```tsx
import { useState } from "react";
import type { ColumnFiltersState } from "@tanstack/table-core";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMuiDataTableColumnHelper, useMuiDataTable } from "../../table";
import type { MuiDataTableInstance } from "../../table";
import { DataTableAccessibilityProvider } from "../../accessibility";
import { DataTableFilterDisplayProvider, useDataTableFilterDisplay } from "../../filter-display";
import { DataTableFilterToggleButton } from "../toolbar/actions/DataTableFilterToggleButton";
import { DataTableToolbarFilterStatus } from "../toolbar/DataTableToolbarFilterStatus";
import { DataTableColumnFilter } from "./DataTableColumnFilter";
import { DataTableFilterIndicator } from "./DataTableFilterIndicator";
import { dataTableClasses } from "../../styles";

type Row = { category: number; locale: string };
const helper = createMuiDataTableColumnHelper<Row>();
const columns = helper.columns([
  helper.accessor("category", { meta: { filterVariant: "select", filterLabel: "Category", filterOptionsError: "Options unavailable", filterOptions: [] } }),
  helper.accessor("locale", { meta: { filterVariant: "select", filterLabel: "Locale", filterOptions: [{ label: "English", value: "en" }] } }),
]);
const data = [{ category: 2, locale: "en" }];

function FilterSurface({ table }: { table: MuiDataTableInstance<Row> }) {
  const { showColumnFilters } = useDataTableFilterDisplay();
  const category = table.getColumn("category");
  if (!category) throw new Error("Missing fixture Category column");
  return <>
    <DataTableFilterToggleButton table={table} />
    <DataTableToolbarFilterStatus table={table} />
    <table.Subscribe selector={(state) => ({ filters: state.columnFilters, search: state.globalFilter })}>
      {(state) => <>
        <DataTableFilterIndicator active={category.getIsFiltered()} />
        {showColumnFilters && <DataTableColumnFilter column={category} />}
        <output aria-label="Query state">{JSON.stringify(state)}</output>
      </>}
    </table.Subscribe>
  </>;
}

it.each(["click", "keyboard"])("clears all filters atomically via %s while hidden and unavailable", (method) => {
  const onUpdate = jest.fn();
  function Fixture() {
    const [filters, setFilters] = useState<ColumnFiltersState>([
      { id: "category", value: 2 }, { id: "locale", value: "en" },
      { id: "removed-column", value: "old" },
    ]);
    const table = useMuiDataTable({
      columns, data, state: { columnFilters: filters, globalFilter: "hello" },
      onColumnFiltersChange: (updater) => { onUpdate(); setFilters(updater); },
    });
    return <DataTableAccessibilityProvider>
      <DataTableFilterDisplayProvider defaultColumnFilterDisplayMode="subheader" defaultShowColumnFilters>
        <FilterSurface table={table} />
      </DataTableFilterDisplayProvider>
    </DataTableAccessibilityProvider>;
  }
  const { container } = render(<Fixture />);
  expect(screen.getByRole("combobox", { name: "Category" })).toHaveAttribute("aria-disabled", "true");
  expect(container.querySelector(`.${dataTableClasses.filterIndicator}`)).not.toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Hide column filters" }));
  expect(screen.queryByRole("combobox")).toBeNull();
  expect(onUpdate).not.toHaveBeenCalled();
  const clear = screen.getByRole("button", { name: "Clear all column filters (3 active)" });
  if (method === "click") fireEvent.click(clear);
  else {
    clear.focus();
    fireEvent.keyDown(clear, { key: "Delete" });
    fireEvent.keyUp(clear, { key: "Delete" });
  }
  expect(onUpdate).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText("Query state")).toHaveTextContent('{"filters":[],"search":"hello"}');
  expect(screen.queryByRole("button", { name: /Clear all column filters/ })).toBeNull();
  expect(container.querySelector(`.${dataTableClasses.filterIndicator}`)).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show column filters" }));
  expect(screen.getByRole("button", { name: "Hide column filters" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("combobox", { name: "Category" })).toHaveAttribute("aria-disabled", "true");
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

it("closes an open menu during refresh and keeps it closed after recovery", () => {
  const props = {
    label: "Category", value: 2, options: [{ label: "Auth", value: 2 }],
    onChange: jest.fn(), onClear: jest.fn(),
  };
  const { rerender } = render(<DataTableSelectFilter {...props} />);
  fireEvent.mouseDown(screen.getByRole("combobox"));
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  rerender(<DataTableSelectFilter {...props} loading />);
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  rerender(<DataTableSelectFilter {...props} />);
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  expect(props.onChange).not.toHaveBeenCalled();
  expect(props.onClear).not.toHaveBeenCalled();
});

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
