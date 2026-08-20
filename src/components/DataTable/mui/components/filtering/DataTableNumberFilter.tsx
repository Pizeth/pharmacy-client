"use client";

import { TextField } from "@mui/material";

export interface DataTableNumberFilterProps {
  readonly value: number | undefined;
  readonly label: string;
  readonly onChange: (value: number) => void;
  readonly onClear: () => void;
}

/**
 * Single numeric-value filter editor.
 *
 * Empty input removes the filter.
 */
export function DataTableNumberFilter(props: DataTableNumberFilterProps) {
  const { value, label, onChange, onClear } = props;

  return (
    <TextField
      fullWidth
      size="small"
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

        if (Number.isNaN(parsed)) {
          return;
        }

        onChange(parsed);
      }}
    />
  );
}
