"use client";

import { Badge, IconButton, Tooltip } from "@mui/material";
import { FilterAltOutlined, FilterListOffOutlined } from "@mui/icons-material";
import { useDataTableFilterDisplay } from "../../../filter-display";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../../table";
import { useDataTableAccessibility } from "../../../accessibility";

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
            <IconButton
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
              sx={{
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                },
              }}
            >
              <Badge
                color="primary"
                badgeContent={activeFilterCount}
                invisible={activeFilterCount === 0}
                max={99}
              >
                <Icon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
        );
      }}
    </table.Subscribe>
  );
}
