"use client";

import { TextField } from "@mui/material";

export interface DataTableTextFilterProps {
  readonly value: string;
  readonly label: string;
  readonly onChange: (value: string) => void;
  readonly onClear: () => void;
}

/**
 * Standard text filter input.
 *
 * This component owns only MUI editing behavior.
 *
 * TanStack state is supplied by the parent.
 */
export function DataTableTextFilter(props: DataTableTextFilterProps) {
  const { value, label, onChange, onClear } = props;

  return (
    <TextField
      fullWidth
      size="small"
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
        },
      }}
    />
  );
}
