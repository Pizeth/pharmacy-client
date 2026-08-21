"use client";

import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { Close, SearchOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import type { DataTableGlobalFilterConfig } from "./types";
import { normalizeDataTableGlobalFilter } from "../../utils/globalFilter";

export interface DataTableGlobalFilterProps<
  TData extends RowData,
> extends DataTableGlobalFilterConfig {
  readonly table: MuiDataTableInstance<TData>;

  /**
   * When true the control takes the full available width.
   *
   * Default: false
   */
  readonly fullWidth?: boolean;
}

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
 * Client/server filtering semantics remain controlled by the table's
 * normal `manualFiltering` configuration.
 */
export function DataTableGlobalFilter<TData extends RowData>(
  props: DataTableGlobalFilterProps<TData>,
) {
  const {
    table,
    placeholder = "Search…",
    label = "Search table",
    clearable = true,
    fullWidth = false,
  } = props;

  return (
    <table.Subscribe source={table.atoms.globalFilter}>
      {(globalFilter) => {
        const value = normalizeDataTableGlobalFilter(globalFilter);

        const hasValue = value.length > 0;

        return (
          <TextField
            size="small"
            fullWidth={fullWidth}
            value={value}
            placeholder={placeholder}
            aria-label={label}
            onChange={(event) => {
              const nextValue = event.target.value;

              /**
               * Empty search state is normalized to undefined rather
               * than keeping an empty string in the filter state.
               *
               * This lets TanStack treat the global filter as absent.
               */
              table.setGlobalFilter(
                nextValue.length > 0 ? nextValue : undefined,
              );
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined fontSize="small" color="action" />
                  </InputAdornment>
                ),

                endAdornment:
                  clearable && hasValue ? (
                    <InputAdornment position="end">
                      <Tooltip title="Clear search">
                        <IconButton
                          size="small"
                          aria-label="Clear search"
                          edge="end"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            table.setGlobalFilter(undefined);
                          }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : undefined,
              },

              htmlInput: {
                autoComplete: "off",
                spellCheck: false,
              },
            }}
            sx={{
              minWidth: fullWidth ? undefined : 220,
              maxWidth: fullWidth ? undefined : 360,
            }}
          />
        );
      }}
    </table.Subscribe>
  );
}
