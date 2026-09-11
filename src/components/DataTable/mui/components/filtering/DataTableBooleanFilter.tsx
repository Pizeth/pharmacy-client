"use client";

// src/components/DataTable/mui/components/filtering/DataTableBooleanFilter.tsx

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  useThemeProps,
} from "@mui/material";
import { useId } from "react";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

type BooleanSelectValue = "" | "true" | "false";

export interface DataTableBooleanFilterProps {
  readonly value: boolean | undefined;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly onChange: (value: boolean) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.booleanFilter;

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
export function DataTableBooleanFilter(inProps: DataTableBooleanFilterProps) {
  const props = useThemeProps({
    props: inProps,
    name: COMPONENT_NAME,
  });

  const { value, label, size = "small", onChange, onClear } = props;

  const labelId = useId();

  const selectValue: BooleanSelectValue =
    value === undefined ? "" : value ? "true" : "false";

  return (
    <Root fullWidth size={size}>
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select<BooleanSelectValue>
        labelId={labelId}
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
    </Root>
  );
}
