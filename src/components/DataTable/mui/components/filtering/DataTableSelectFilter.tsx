"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { MuiDataTableFilterOption } from "../../meta";
export type DataTableSelectFilterValue = string | number | boolean;

export interface DataTableSelectFilterProps {
  readonly value: DataTableSelectFilterValue | undefined;
  readonly label: string;
  readonly options: readonly MuiDataTableFilterOption[];
  readonly onChange: (value: DataTableSelectFilterValue) => void;
  readonly onClear: () => void;
}

/**
 * Exact-value select filter.
 */
export function DataTableSelectFilter(props: DataTableSelectFilterProps) {
  const { value, label, options, onChange, onClear } = props;

  /**
   * MUI Select handles string/number values most naturally.
   *
   * Boolean options are encoded through a stable string representation.
   */
  const encodeValue = (candidate: DataTableSelectFilterValue): string => {
    if (typeof candidate === "boolean") {
      return candidate ? "boolean:true" : "boolean:false";
    }

    if (typeof candidate === "number") {
      return `number:${candidate}`;
    }

    return `string:${candidate}`;
  };

  const decodeValue = (candidate: string): DataTableSelectFilterValue => {
    if (candidate.startsWith("boolean:")) {
      return candidate === "boolean:true";
    }

    if (candidate.startsWith("number:")) {
      return Number(candidate.slice("number:".length));
    }

    return candidate.slice("string:".length);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>

      <Select
        label={label}
        value={value === undefined ? "" : encodeValue(value)}
        onChange={(event) => {
          const encoded = event.target.value;

          if (encoded === "") {
            onClear();

            return;
          }

          onChange(decodeValue(encoded));
        }}
      >
        <MenuItem value="">All</MenuItem>

        {options.map((option) => (
          <MenuItem
            key={encodeValue(option.value)}
            value={encodeValue(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
