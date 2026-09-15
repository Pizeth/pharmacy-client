// src/components/DataTable/mui/components/toolbar/actions/DataTableSearchToggleButton.tsx

"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../../styles";

import { styled, Badge, IconButton, Tooltip } from "@mui/material";
import { SearchOffOutlined, SearchOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../../table";
import { normalizeDataTableGlobalFilter } from "../../../utils/globalFilter";
import { useDataTableAccessibility } from "../../../accessibility";

const SearchToggleButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "SearchToggleButton",
  overridesResolver: (_props, styles) => styles.searchToggleButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export interface DataTableSearchToggleButtonProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly open: boolean;
  readonly onToggle: () => void;
}

/**
 * Toggles only the visibility of the global-search control.
 *
 * Existing globalFilter state remains active when the input is hidden.
 */
export function DataTableSearchToggleButton<TData extends RowData>(
  props: DataTableSearchToggleButtonProps<TData>,
) {
  const { table, open, onToggle } = props;

  const { globalSearchId } = useDataTableAccessibility();

  return (
    <table.Subscribe selector={(state) => state.globalFilter}>
      {(globalFilter) => {
        const normalizedFilter = normalizeDataTableGlobalFilter(globalFilter);

        const active = normalizedFilter.length > 0;

        return (
          <Tooltip title={open ? "Hide search" : "Show search"}>
            <SearchToggleButtonRoot
              className={dataTableClasses.searchToggleButton}
              size="small"
              aria-label={open ? "Hide global search" : "Show global search"}
              //   aria-expanded={open}
              //   aria-pressed={open}
              aria-expanded={open}
              aria-controls={open ? globalSearchId : undefined}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                onToggle();
              }}
            >
              <Badge color="primary" variant="dot" invisible={!active}>
                {open ? (
                  <SearchOffOutlined fontSize="small" />
                ) : (
                  <SearchOutlined fontSize="small" />
                )}
              </Badge>
            </SearchToggleButtonRoot>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}
