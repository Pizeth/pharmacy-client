"use client";

import { IconButton, Tooltip } from "@mui/material";
import type { RowData } from "@tanstack/table-core";
import type { ResolvedDataTableRowAction } from "./resolvedTypes";

export interface DataTableRowActionButtonProps<TData extends RowData> {
  readonly action: ResolvedDataTableRowAction<TData>;
}

/**
 * One direct row-action button.
 */
export function DataTableRowActionButton<TData extends RowData>(
  props: DataTableRowActionButtonProps<TData>,
) {
  const { action } = props;

  const { definition, context, icon, color, disabled } = action;

  return (
    <Tooltip title={definition.label}>
      {/**
       * MUI Tooltip requires a non-disabled event target, so the span
       * remains present even when the IconButton is disabled.
       */}
      <span>
        <IconButton
          size="small"
          color={color}
          disabled={disabled}
          aria-label={`${definition.label} for row ${context.row.id}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (disabled) {
              return;
            }

            definition.onClick(context);
          }}
          sx={{
            width: 28,
            height: 28,

            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}
