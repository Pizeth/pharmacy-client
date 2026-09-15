"use client";

import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../../styles";

// src/components/DataTable/mui/components/toolbar/actions/DataTableFilterToggleButton.tsx

import { styled, Badge, IconButton, Tooltip } from "@mui/material";
import { FilterAltOutlined, FilterListOffOutlined } from "@mui/icons-material";
import { useDataTableFilterDisplay } from "../../../filter-display";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../../table";
import { useDataTableAccessibility } from "../../../accessibility";

const FilterToggleButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "FilterToggleButton",
  overridesResolver: (_props, styles) => styles.filterToggleButton,
})(({ theme }) => ({
  "&:focus-visible, &.Mui-focusVisible": {
    outline: `2px solid ${(theme.vars ?? theme).palette.primary.main}`,
    outlineOffset: 2,
  },
}));

export interface DataTableFilterToggleButtonProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Shows/hides the subheader filter row.
 *
 * This button changes presentation only.
 *
 * Existing TanStack columnFilters remain active when the row is hidden.
 */
export function DataTableFilterToggleButton<TData extends RowData>(
  props: DataTableFilterToggleButtonProps<TData>,
) {
  const { table } = props;

  const { filterRowId } = useDataTableAccessibility();

  const { columnFilterDisplayMode, showColumnFilters, toggleColumnFilters } =
    useDataTableFilterDisplay();

  /**
   * A row toggle is only meaningful in subheader mode.
   */
  if (columnFilterDisplayMode !== "subheader") {
    return null;
  }

  return (
    <table.Subscribe selector={(state) => state.columnFilters}>
      {(columnFilters) => {
        const activeFilterCount = columnFilters.length;

        const Icon = showColumnFilters
          ? FilterListOffOutlined
          : FilterAltOutlined;

        return (
          <Tooltip title={showColumnFilters ? "Hide filters" : "Show filters"}>
            <FilterToggleButtonRoot
              className={dataTableClasses.filterToggleButton}
              size="small"
              aria-label={
                showColumnFilters
                  ? "Hide column filters"
                  : "Show column filters"
              }
              //   aria-pressed={showColumnFilters}
              aria-expanded={showColumnFilters}
              aria-controls={showColumnFilters ? filterRowId : undefined}
              onClick={toggleColumnFilters}
            >
              <Badge
                color="primary"
                badgeContent={activeFilterCount}
                invisible={activeFilterCount === 0}
                max={99}
              >
                <Icon fontSize="small" />
              </Badge>
            </FilterToggleButtonRoot>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}
