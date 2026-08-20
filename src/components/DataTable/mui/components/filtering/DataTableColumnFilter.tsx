"use client";

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
