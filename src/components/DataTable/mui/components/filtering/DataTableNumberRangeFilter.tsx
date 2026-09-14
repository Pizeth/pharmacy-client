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
