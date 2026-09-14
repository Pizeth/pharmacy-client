// src/components/DataTable/mui/components/toolbar/DataTableToolbarFilterStatus.tsx

"use client";

import { Chip } from "@mui/material";
import { FilterAltOffOutlined } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";

export interface DataTableToolbarFilterStatusProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Compact status surface for active column filters.
 *
 * This does not include global search because globalFilter is a
 * separate TanStack state slice with its own UI.
 */
export function DataTableToolbarFilterStatus<TData extends RowData>(
  props: DataTableToolbarFilterStatusProps<TData>,
) {
  const { table } = props;

  return (
    <table.Subscribe selector={(state) => state.columnFilters}>
      {(columnFilters) => {
        const activeCount = columnFilters.length;

        if (activeCount === 0) {
          return null;
        }

        const clearFilters = (): void => {
          // One update clears even stale column IDs without changing search.
          table.setColumnFilters([]);
        };

        return (
          <Chip
            size="small"
            variant="outlined"
            label={activeCount === 1 ? "1 filter" : `${activeCount} filters`}
            aria-label={`Clear all column filters (${activeCount} active)`}
            onClick={clearFilters}
            deleteIcon={<FilterAltOffOutlined fontSize="small" />}
            onDelete={clearFilters}
            sx={{
              flexShrink: 0,
            }}
          />
        );
      }}
    </table.Subscribe>
  );
}
