"use client";

//src/components/DataTable/mui/components/filtering/DataTableTextFilter.tsx

import { styled, TextField, useThemeProps } from "@mui/material";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";

export interface DataTableTextFilterProps {
  readonly value: string;
  readonly label: string;
  readonly size?: "small" | "medium";
  readonly onChange: (value: string) => void;
  readonly onClear: () => void;
}

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.textFilter;

/**
 * ------------------------------------------------------------------
 * Root slot
 * ------------------------------------------------------------------
 *
 * This is deliberately a named MUI styled component.
 *
 * Consumers can later configure:
 *
 * theme.components.RazethDataTableTextFilter
 *
 * using:
 *
 * - defaultProps
 * - styleOverrides.root
 * - variants
 */
const Root = styled(TextField, {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})(() => ({
  width: "100%",
  minWidth: 0,

  /**
   * MUI inputs otherwise occasionally retain an intrinsic minimum
   * width that competes with narrow table columns.
   */
  "& .MuiInputBase-root": {
    minWidth: 0,
  },
}));

/**
 * Standard text filter input.
 *
 * This component owns only MUI editing behavior.
 *
 * TanStack filter state remains owned by the caller.
 */
export function DataTableTextFilter(inProps: DataTableTextFilterProps) {
  const props = useThemeProps({
    props: inProps,
    name: COMPONENT_NAME,
  });

  const { value, label, size = "small", onChange, onClear } = props;

  return (
    <Root
      fullWidth
      size={size}
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

          spellCheck: false,
        },
      }}
    />
  );
}
