// src/components/DataTable/mui/components/selection/DataTableBulkActions.tsx

"use client";

import { styled, Stack } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import { DataTableBulkActionButton } from "./DataTableBulkActionButton";
import type { DataTableBulkAction, DataTableSelectionContext } from "./types";

const BulkActionsRoot = styled(Stack, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BulkActions",
  overridesResolver: (_props, styles) => styles.bulkActions,
})({ flexWrap: "wrap", minWidth: 0 });

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
    <BulkActionsRoot
      className={dataTableClasses.bulkActions}
      direction="row"
      alignItems="center"
      spacing={0.5}
    >
      {actions.map((action) => (
        <DataTableBulkActionButton<TData>
          key={action.id}
          action={action}
          context={context}
        />
      ))}
    </BulkActionsRoot>
  );
}
