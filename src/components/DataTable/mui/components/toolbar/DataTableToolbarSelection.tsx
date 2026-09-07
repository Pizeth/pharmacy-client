"use client";

// src/components/DataTable/mui/components/toolbar/DataTableToolbarSelection.tsx

import { Chip } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";

export interface DataTableToolbarSelectionProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Lightweight selected-row indicator.
 *
 * We intentionally count the rowSelection state itself rather than
 * requiring an additional selected-row model.
 */
export function DataTableToolbarSelection<TData extends RowData>(
  props: DataTableToolbarSelectionProps<TData>,
) {
  const { table } = props;

  return (
    <table.Subscribe source={table.atoms.rowSelection}>
      {(rowSelection) => {
        const selectedCount =
          Object.values(rowSelection).filter(Boolean).length;

        if (selectedCount === 0) {
          return null;
        }

        return (
          <Chip
            size="small"
            icon={<CheckCircleOutline />}
            label={`${selectedCount} selected`}
            color="primary"
            variant="outlined"
          />
        );
      }}
    </table.Subscribe>
  );
}
