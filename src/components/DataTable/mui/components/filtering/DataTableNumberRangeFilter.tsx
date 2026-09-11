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
})(() => ({
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
    <Root direction="row" spacing={1}>
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
        size="small"
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
