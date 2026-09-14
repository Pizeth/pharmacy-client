"use client";

// src/components/DataTable/mui/components/filtering/DataTableNumberFilter.tsx

import { styled, TextField, useThemeProps } from "@mui/material";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

import type { DataTableNumberFilterProps } from "./types";

export type { DataTableNumberFilterProps } from "./types";

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.numberFilter;

const Root = styled(TextField, {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{ ownerState: DataTableNumberFilterProps }>(() => ({
  width: "100%",
  minWidth: 0,

  "& .MuiInputBase-root": {
    minWidth: 0,
  },
}));

/**
 * Single numeric-value filter editor.
 *
 * Empty input removes the corresponding TanStack filter.
 */
export function DataTableNumberFilter(inProps: DataTableNumberFilterProps) {
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

  return (
    <Root
          disabled={props.disabled}
      ownerState={{ ...props, size }}
      fullWidth
      size={size}
      type="number"
      label={label}
      value={value ?? ""}
      className={className}
      sx={sx}
      onChange={(event) => {
        const rawValue = event.target.value;

        if (rawValue.length === 0) {
          onClear();

          return;
        }

        const parsed = Number(rawValue);

        if (!Number.isFinite(parsed)) {
          return;
        }

        onChange(parsed);
      }}
    />
  );
}
