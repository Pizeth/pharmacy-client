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
          /**
           * Clear only currently active column filters.
           *
           * We deliberately use the active filter IDs rather than
           * maintaining another filter registry.
           */
          for (const filter of columnFilters) {
            const column = table.getColumn(filter.id);

            column?.setFilterValue(undefined);
          }
        };

        return (
          <Chip
            size="small"
            variant="outlined"
            label={activeCount === 1 ? "1 filter" : `${activeCount} filters`}
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
