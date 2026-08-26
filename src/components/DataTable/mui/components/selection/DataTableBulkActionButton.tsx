// src/components/DataTable/mui/components/selection/DataTableBulkActionButton.tsx

"use client";

import { Button, Tooltip } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import type { DataTableBulkAction, DataTableSelectionContext } from "./types";

export interface DataTableBulkActionButtonProps<TData extends RowData> {
  readonly action: DataTableBulkAction<TData>;
  readonly context: DataTableSelectionContext<TData>;
}

export function DataTableBulkActionButton<TData extends RowData>(
  props: DataTableBulkActionButtonProps<TData>,
) {
  const { action, context } = props;

  const hidden = action.isHidden?.(context) ?? false;

  if (hidden) {
    return null;
  }

  const disabled = action.isDisabled?.(context) ?? false;

  const icon = action.renderIcon?.(context);

  const button = (
    <Button
      size="small"
      color={action.color ?? "primary"}
      variant={action.variant ?? "text"}
      disabled={disabled}
      startIcon={icon}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (disabled) {
          return;
        }

        action.onClick(context);
      }}
      sx={{
        whiteSpace: "nowrap",
      }}
    >
      {action.label}
    </Button>
  );

  /**
   * Keep the label available as a tooltip on compact/narrow layouts,
   * and ensure disabled buttons still have a tooltip event target.
   */
  return (
    <Tooltip title={action.label}>
      <span>{button}</span>
    </Tooltip>
  );
}
