// src/components/DataTable/mui/components/selection/DataTableBulkActions.tsx

"use client";

import { Stack } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import { DataTableBulkActionButton } from "./DataTableBulkActionButton";
import type { DataTableBulkAction, DataTableSelectionContext } from "./types";

export interface DataTableBulkActionsProps<TData extends RowData> {
  readonly actions: readonly DataTableBulkAction<TData>[];

  readonly context: DataTableSelectionContext<TData>;
}

export function DataTableBulkActions<TData extends RowData>(
  props: DataTableBulkActionsProps<TData>,
) {
  const { actions, context } = props;

  if (actions.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{
        flexWrap: "wrap",
        minWidth: 0,
      }}
    >
      {actions.map((action) => (
        <DataTableBulkActionButton<TData>
          key={action.id}
          action={action}
          context={context}
        />
      ))}
    </Stack>
  );
}
