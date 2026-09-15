// src/components/DataTable/mui/components/selection/DataTableBulkActionButton.tsx

"use client";

import { styled, Button, Tooltip } from "@mui/material";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { RowData } from "@tanstack/table-core";
import type { DataTableBulkAction, DataTableSelectionContext } from "./types";

const BulkActionButtonRoot = styled(Button, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "BulkActionButton",
  overridesResolver: (_props, styles) => styles.bulkActionButton,
})({ whiteSpace: "nowrap" });

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
    <BulkActionButtonRoot
      className={dataTableClasses.bulkActionButton}
      size="small"
      color={action.color ?? "primary"}
      variant={action.variant ?? "text"}
      disabled={disabled}
      aria-label={`${action.label} for ${context.selectedCount} selected ${
        context.selectedCount === 1 ? "row" : "rows"
      }`}
      startIcon={icon}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (disabled) {
          return;
        }

        action.onClick(context);
      }}
    >
      {action.label}
    </BulkActionButtonRoot>
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
