"use client";

// src/components/DataTable/mui/components/filtering/DataTableSelectFilter.tsx

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  useThemeProps,
} from "@mui/material";
import { useId } from "react";
import type { MuiDataTableFilterOption } from "../../meta";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";
import {
  decodeDataTableSelectFilterValue,
  encodeDataTableSelectFilterValue,
} from "./selectFilterValue";
import type { DataTableSelectFilterValue } from "./selectFilterValue";

export interface DataTableSelectFilterProps {
  readonly value: DataTableSelectFilterValue | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly options: readonly MuiDataTableFilterOption[];
  readonly onChange: (value: DataTableSelectFilterValue) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.selectFilter;

const Root = styled(FormControl, {
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
 * Exact scalar-value select filter.
 *
 * DataTable filter state may contain:
 *
 * - string
 * - number
 * - boolean
 *
 * while MUI Select receives the stable encoded string representation
 * supplied by selectFilterValue.ts.
 */
export function DataTableSelectFilter(inProps: DataTableSelectFilterProps) {
  const props = useThemeProps({
    props: inProps,
    name: COMPONENT_NAME,
  });

  const { value, label, size = "small", options, onChange, onClear } = props;

  const labelId = useId();

  const selectedValue =
    value === undefined ? "" : encodeDataTableSelectFilterValue(value);

  return (
    <Root fullWidth size={size}>
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select
        labelId={labelId}
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
    </Root>
  );
}
