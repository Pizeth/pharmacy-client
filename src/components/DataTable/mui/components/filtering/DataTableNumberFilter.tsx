"use client";

// src/components/DataTable/mui/components/filtering/DataTableNumberFilter.tsx

import { styled, TextField, useThemeProps } from "@mui/material";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

export interface DataTableNumberFilterProps {
  readonly value: number | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly onChange: (value: number) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.numberFilter;

const Root = styled(TextField, {
  name: COMPONENT_NAME,
  slot: "Root",

  overridesResolver: (_props, styles) => styles.root,
})(() => ({
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

  const { value, label, size = "small", onChange, onClear } = props;

  return (
    <Root
      fullWidth
      size={size}
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

        if (!Number.isFinite(parsed)) {
          return;
        }

        onChange(parsed);
      }}
    />
  );
}
