"use client";

// src/components/DataTable/mui/components/global-filtering/DataTableGlobalFilter.tsx

import {
  IconButton,
  InputAdornment,
  SxProps,
  TextField,
  Theme,
  Tooltip,
  alpha,
  styled,
} from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import { SearchInput, SearchLabel } from "@/components/Search/SearchInput";
import { useRef, useState } from "react";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { normalizeDataTableGlobalFilter } from "../../utils/globalFilter";
import { useDataTableDebouncedTextInput } from "../../hooks";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { DataTableGlobalFilterConfig } from "./types";

export interface DataTableGlobalFilterProps<
  TData extends RowData,
> extends DataTableGlobalFilterConfig {
  readonly table: MuiDataTableInstance<TData>;

  /**
   * When true, the search field consumes the available horizontal space.
   *
   * Default: false
   */
  readonly fullWidth?: boolean;

  /**
   * Size of the search field.
   *
   * Default: "small"
   */
  readonly size?: "small" | "medium";

  /**
   * Optional caller class.
   *
   * Stable internal DataTable utility classes are applied separately.
   */
  readonly className?: string;

  /**
   * Optional caller style.
   *
   * Stable internal DataTable utility classes are applied separately.
   */
  readonly sx?: SxProps<Theme>;
}

interface DataTableGlobalFilterInputProps<TData extends RowData> extends Omit<
  DataTableGlobalFilterProps<TData>,
  "table"
> {
  readonly table: MuiDataTableInstance<TData>;

  /**
   * Canonical TanStack global-filter value normalized to string.
   */
  readonly committedValue: string;
}

/**
 * Named MUI DataTable slot.
 *
 * Static presentation belongs here rather than inside `sx`.
 *
 * Application theme override target:
 *
 *   components: {
 *     RazethDataTable: {
 *       styleOverrides: {
 *         globalFilter: {
 *           ...
 *         }
 *       }
 *     }
 *   }
 */
const GlobalFilterRoot = styled(TextField, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "GlobalFilter",
  overridesResolver: (_props, styles) => styles.globalFilter,
})(({ theme }) => ({
  transition: "transform 0.3s ease-in-out",
  "&:focus-within": { transform: "scale(1.025)" },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  minWidth: 220,
  maxWidth: 360,
  // Use the label notch instead of relying on glass to mask a continuous border.
  "& .MuiOutlinedInput-root, & .MuiOutlinedInput-root.Mui-focused": {
    borderColor: "transparent",
  },
  "&& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: `1px solid ${theme.alpha((theme.vars ?? theme).palette.text.primary, 0.075)}`,
    borderRadius: "inherit",
  },
  "&& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.error.main, 0.5),
  },
  [`&.${dataTableClasses.globalFilterFullWidth}`]: {
    width: "100%",
    minWidth: 0,
    maxWidth: "none",
  },
}));

const ClearButtonRoot = styled(IconButton)(({ theme }) => ({
  padding: 0,
  "&:hover": { color: (theme.vars ?? theme).palette.primary.main },
}));

/**
 * Standard text-based global search control for the MUI DataTable.
 *
 * Important:
 *
 * This component owns no duplicated filter state.
 *
 * Input changes are written directly into TanStack through:
 *
 *   table.setGlobalFilter(...)
 *
 * and rendered value comes directly from:
 *
 *   table.atoms.globalFilter
 *
 * The outer component only subscribes to canonical TanStack state.
 *
 * Client/server filtering semantics remain controlled by the table's
 * normal `manualFiltering` configuration.
 *
 * Debounced presentation state lives in the inner React component so
 * hooks are never called inside a Subscribe render callback.
 */
export function DataTableGlobalFilter<TData extends RowData>(
  props: DataTableGlobalFilterProps<TData>,
) {
  const { table } = props;

  return (
    <table.Subscribe source={table.atoms.globalFilter}>
      {(globalFilter) => (
        <DataTableGlobalFilterInput
          {...props}
          committedValue={normalizeDataTableGlobalFilter(globalFilter)}
        />
      )}
    </table.Subscribe>
  );
}

/**
 * Actual interactive input.
 *
 * Splitting this from DataTableGlobalFilter is important because
 * DataTableGlobalFilter's Subscribe child is a render callback.
 *
 * React hooks should remain inside an ordinary React component.
 */
function DataTableGlobalFilterInput<TData extends RowData>(
  props: DataTableGlobalFilterInputProps<TData>,
) {
  const {
    table,
    committedValue,
    placeholder = "Search…",
    label = "Search table",
    clearable = true,
    debounceMs = 0,
    fullWidth = false,
    size = "small",
    className,
    sx,
    ...rest
  } = props;

  const input = useDataTableDebouncedTextInput({
    value: committedValue,
    debounceMs,
    onCommit: (nextValue) => {
      /**
       * Keep empty global-search state absent from TanStack rather
       * than storing an empty string.
       */
      table.setGlobalFilter(nextValue.length > 0 ? nextValue : undefined);
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const value = input.value;
  const [focused, setFocused] = useState(false);
  const shrink = focused || value.length > 0;

  const hasValue = value.length > 0;

  const rootClassName = [
    dataTableClasses.globalFilter,
    fullWidth ? dataTableClasses.globalFilterFullWidth : undefined,
    className,
  ]
    .filter((value): value is string => value !== undefined && value.length > 0)
    .join(" ");

  return (
    <GlobalFilterRoot
      slots={{ input: SearchInput, inputLabel: SearchLabel }}
      className={rootClassName}
      size={size}
      fullWidth={fullWidth}
      inputRef={inputRef}
      value={value}
      label={placeholder}
      onFocus={() => setFocused(true)}
      aria-label={label}
      onChange={(event) => {
        input.setValue(event.target.value);
      }}
      /**
       * Enter means:
       *
       *   search now
       *
       * rather than waiting for the remaining debounce interval.
       */
      onKeyDown={(event) => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === "Escape" && clearable) {
          event.preventDefault();
          event.stopPropagation();
          input.commitValue("");
        } else if (event.key === "Enter") {
          event.preventDefault();
          input.commit();
        }
      }}
      /**
       * Leaving the field commits any pending value immediately.
       */
      onBlur={() => {
        setFocused(false);
        input.commit();
      }}
      slotProps={{
        inputLabel: { shrink },
        input: {
          notched: shrink,
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),

          endAdornment:
            clearable && hasValue ? (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <ClearButtonRoot
                    className={dataTableClasses.globalFilterClearButton}
                    size="small"
                    aria-label="Clear search"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      /**
                       * Clear should be immediate.
                       *
                       * Waiting 300ms after pressing an explicit clear
                       * action would feel broken.
                       */
                      input.commitValue("");
                      inputRef.current?.focus();
                    }}
                  >
                    <Clear fontSize="small" />
                  </ClearButtonRoot>
                </Tooltip>
              </InputAdornment>
            ) : undefined,
        },

        htmlInput: {
          "aria-label": label,
          autoComplete: "off",
          spellCheck: false,
        },
      }}
      sx={sx}
      {...rest}
    />
  );
}
