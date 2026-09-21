"use client";

import { IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { RowData } from "@tanstack/table-core";
import { DATA_TABLE_COMPONENT_NAME, dataTableClasses } from "../../styles";
import type { ResolvedDataTableRowAction } from "./resolvedTypes";

const RowActionButtonRoot = styled(IconButton, {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "RowActionButton",
  overridesResolver: (_props, styles) => styles.rowActionButton,
})(({ theme }) => ({
  width: 28,
  height: 28,
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

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
        <RowActionButtonRoot
          className={dataTableClasses.rowActionButton}
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
        >
          {icon}
        </RowActionButtonRoot>
      </span>
    </Tooltip>
  );
}
