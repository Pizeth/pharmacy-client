"use client";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type BooleanSelectValue = "" | "true" | "false";

export interface DataTableBooleanFilterProps {
  readonly value: boolean | undefined;
  readonly label: string;
  readonly onChange: (value: boolean) => void;
  readonly onClear: () => void;
}

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
export function DataTableBooleanFilter(props: DataTableBooleanFilterProps) {
  const { value, label, onChange, onClear } = props;

  const selectValue: BooleanSelectValue =
    value === undefined ? "" : value ? "true" : "false";

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="data-table-boolean-filter-label">{label}</InputLabel>

      <Select<BooleanSelectValue>
        labelId="data-table-boolean-filter-label"
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
    </FormControl>
  );
}
