"use client";

// src/components/DataTable/mui/components/filtering/DataTableSelectFilter.tsx

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { MuiDataTableFilterOption } from "../../meta";
import {
  decodeDataTableSelectFilterValue,
  encodeDataTableSelectFilterValue,
} from "./selectFilterValue";
import type { DataTableSelectFilterValue } from "./selectFilterValue";

export interface DataTableSelectFilterProps {
  readonly value: DataTableSelectFilterValue | undefined;

  readonly label: string;

  readonly options: readonly MuiDataTableFilterOption[];

  readonly onChange: (value: DataTableSelectFilterValue) => void;

  readonly onClear: () => void;
}

/**
 * Exact scalar-value select filter.
 *
 * Supports:
 *
 *   string
 *   number
 *   boolean
 *
 * while MUI Select itself receives a stable encoded string.
 */
export function DataTableSelectFilter(props: DataTableSelectFilterProps) {
  const { value, label, options, onChange, onClear } = props;

  const selectedValue =
    value === undefined ? "" : encodeDataTableSelectFilterValue(value);

  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>

      <Select
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
    </FormControl>
  );
}
