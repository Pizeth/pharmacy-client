"use client";

import { IconButton, Tooltip } from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import type { KeyboardEvent } from "react";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";
import { getColumnManagerLabel } from "./getColumnManagerLabel";
import { moveDataTableColumn } from "./ordering";

export interface DataTableColumnOrderHandleProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;

  readonly column: Column<MuiDataTableFeatures, TData, TValue>;

  readonly onDragStart: (columnId: string) => void;

  readonly onDragEnd: () => void;
}

export function DataTableColumnOrderHandle<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnOrderHandleProps<TData, TValue>) {
  const { table, column, onDragStart, onDragEnd } = props;

  const label = getColumnManagerLabel(column);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (!event.altKey) {
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      event.stopPropagation();

      moveDataTableColumn(table, column.id, "before");

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();

      moveDataTableColumn(table, column.id, "after");
    }
  };

  return (
    <Tooltip title="Drag to reorder. Alt + ↑/↓ to move.">
      <IconButton
        size="small"
        draggable
        aria-label={`Reorder ${label}`}
        onKeyDown={handleKeyDown}
        onDragStart={(event) => {
          event.stopPropagation();

          /**
           * Required by some browsers before drag operations become
           * active.
           */
          event.dataTransfer.effectAllowed = "move";

          event.dataTransfer.setData("text/plain", column.id);

          onDragStart(column.id);
        }}
        onDragEnd={() => {
          onDragEnd();
        }}
        sx={{
          cursor: "grab",

          width: 28,

          height: 28,

          color: "text.secondary",

          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        <DragIndicator fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
