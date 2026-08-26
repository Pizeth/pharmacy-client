"use client";

import { Stack, TextField } from "@mui/material";
import type { DataTableNumberRangeValue } from "./types";

export interface DataTableNumberRangeFilterProps {
  readonly value: DataTableNumberRangeValue;
  readonly label: string;
  readonly onChange: (value: DataTableNumberRangeValue) => void;
  readonly onClear: () => void;
}

export function DataTableNumberRangeFilter(
  props: DataTableNumberRangeFilterProps,
) {
  const { value, label, onChange, onClear } = props;

  const [min, max] = value;

  const updateMin = (rawValue: string): void => {
    const nextMin = rawValue.length === 0 ? undefined : Number(rawValue);

    if (nextMin !== undefined && Number.isNaN(nextMin)) {
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

    if (nextMax !== undefined && Number.isNaN(nextMax)) {
      return;
    }

    if (min === undefined && nextMax === undefined) {
      onClear();

      return;
    }

    onChange([min, nextMax]);
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        width: "100%",
        minWidth: 0,

        "& .MuiTextField-root": {
          minWidth: 0,
        },

        "& .MuiInputBase-root": {
          minWidth: 0,
        },
      }}
    >
      <TextField
        fullWidth
        size="small"
        type="number"
        label={`${label} minimum`}
        value={min ?? ""}
        onChange={(event) => {
          updateMin(event.target.value);
        }}
      />

      <TextField
        fullWidth
        size="small"
        type="number"
        label={`${label} maximum`}
        value={max ?? ""}
        onChange={(event) => {
          updateMax(event.target.value);
        }}
      />
    </Stack>
  );
}
