"use client";

// src/components/DataTable/mui/components/filtering/DataTableSelectFilter.tsx

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  styled,
  useThemeProps,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useId, useState } from "react";
import { DATA_TABLE_THEME_COMPONENT_NAMES } from "../../theme";
import {
  decodeDataTableSelectFilterValue,
  encodeDataTableSelectFilterValue,
} from "./selectFilterValue";
import type { DataTableSelectFilterProps } from "./types";

export type { DataTableSelectFilterProps } from "./types";

const COMPONENT_NAME = DATA_TABLE_THEME_COMPONENT_NAMES.selectFilter;

const Root = styled(FormControl, {
  name: COMPONENT_NAME,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<{ ownerState: DataTableSelectFilterProps }>(() => ({
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

  const { direction } = useTheme();

  const {
    value,
    label,
    size = "small",
    disabled = false,
    loading = false,
    errorMessage,
    className,
    sx,
    options,
    onChange,
    onClear,
  } = props;

  const labelId = useId();
  const statusId = useId();
  const unavailable = disabled || loading || Boolean(errorMessage);
  const statusText = loading ? "Loading options…" : errorMessage;
  const [open, setOpen] = useState(false);

  // A background refresh may begin while the menu is open. Close it and
  // require a new user action after recovery, without changing filter state.
  useEffect(() => {
    if (unavailable) setOpen(false);
  }, [unavailable]);

  const selectedValue =
    value === undefined ? "" : encodeDataTableSelectFilterValue(value);
  // Keep committed values representable during loading and after option removal.
  // Never clear TanStack state just because its option is temporarily absent.
  const missingSelection =
    value !== undefined &&
    !options.some(
      (option) =>
        encodeDataTableSelectFilterValue(option.value) === selectedValue,
    );

  return (
    <Root
      ownerState={{ ...props, size, disabled: unavailable, loading }}
      fullWidth
      size={size}
      disabled={unavailable}
      error={Boolean(errorMessage) && !loading}
    >
      <InputLabel id={labelId}>{label}</InputLabel>

      <Select
        open={open && !unavailable}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        labelId={labelId}
        label={label}
        value={selectedValue}
        MenuProps={{
          /**
           * MUI Select's listbox is portaled outside the DataTable root.
           */
          dir: direction,
        }}
        inputProps={{
          "aria-describedby": statusText ? statusId : undefined,
          "aria-busy": loading,
        }}
        className={className}
        sx={sx}
        onChange={(event) => {
          if (unavailable) {
            return;
          }
          const encoded = event.target.value;

          if (encoded === "") {
            onClear();

            return;
          }

          onChange(decodeDataTableSelectFilterValue(encoded));
        }}
      >
        <MenuItem value="">All</MenuItem>
        {missingSelection && (
          <MenuItem value={selectedValue} disabled>
            {String(value)}
          </MenuItem>
        )}

        {options.map((option) => {
          const encodedValue = encodeDataTableSelectFilterValue(option.value);

          return (
            <MenuItem key={encodedValue} value={encodedValue}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
      {statusText && (
        <FormHelperText id={statusId} role={loading ? "status" : "alert"}>
          {statusText}
        </FormHelperText>
      )}
    </Root>
  );
}
