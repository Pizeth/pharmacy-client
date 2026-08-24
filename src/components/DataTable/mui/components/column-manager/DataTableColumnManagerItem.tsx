// mui/components/column-manager/DataTableColumnManagerItem.tsx

"use client";

import { Box, Switch, Typography } from "@mui/material";
import type { CellData, Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnOrderHandle } from "./DataTableColumnOrderHandle";
import { DataTableColumnPinControls } from "./DataTableColumnPinControls";
import { getColumnManagerLabel } from "./getColumnManagerLabel";

export interface DataTableColumnManagerItemProps<
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  readonly table: MuiDataTableInstance<TData>;
  readonly column: Column<MuiDataTableFeatures, TData, TValue>;
  readonly enableOrdering: boolean;
  readonly enableVisibility: boolean;
  readonly enablePinning: boolean;
  readonly draggingColumnId: string | null;
  readonly dropTargetColumnId: string | null;
  readonly onDragStart: (columnId: string) => void;
  readonly onDragEnd: () => void;
  readonly onDragOver: (columnId: string) => void;
  readonly onDrop: (columnId: string) => void;
}

/**
 * One leaf-column row inside the manager.
 */
export function DataTableColumnManagerItem<
  TData extends RowData,
  TValue extends CellData = CellData,
>(props: DataTableColumnManagerItemProps<TData, TValue>) {
  const {
    table,
    column,
    enableOrdering,
    enableVisibility,
    enablePinning,
    draggingColumnId,
    dropTargetColumnId,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
  } = props;

  const meta = column.columnDef.meta;

  const label = getColumnManagerLabel(column);

  const canHide = column.getCanHide();

  const visible = column.getIsVisible();

  const canOrder = enableOrdering && (meta?.enableColumnOrdering ?? true);

  const dragging = draggingColumnId === column.id;

  const dropTarget = dropTargetColumnId === column.id && !dragging;

  return (
    <Box
      data-column-id={column.id}
      data-dragging={dragging ? "true" : undefined}
      data-drop-target={dropTarget ? "true" : undefined}
      onDragOver={(event) => {
        if (!canOrder || draggingColumnId === null) {
          return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

        onDragOver(column.id);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (canOrder) {
          onDrop(column.id);
        }
      }}
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "auto minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 1,
        minHeight: 44,
        px: 1,
        py: 0.25,
        borderRadius: 1,
        opacity: dragging ? 0.45 : 1,
        transition: (theme) =>
          theme.transitions.create(["background-color", "opacity"], {
            duration: theme.transitions.duration.shortest,
          }),
        "&:hover": {
          backgroundColor: "action.hover",
        },
        ...(dropTarget
          ? {
              "&::before": {
                content: '""',
                position: "absolute",
                insetInline: 4,
                top: 0,
                height: 2,
                borderRadius: 1,
                backgroundColor: "primary.main",
              },
            }
          : {}),
      }}
    >
      {/**
       * Ordering handle.
       */}
      <Box
        sx={{
          width: 28,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {canOrder && (
          <DataTableColumnOrderHandle
            table={table}
            column={column}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        )}
      </Box>

      {/**
       * Logical pin controls.
       */}
      <Box
        sx={{
          width: 56,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {enablePinning && <DataTableColumnPinControls column={column} />}
      </Box>

      {/**
       * Human-readable column identity.
       */}
      <Typography
        variant="body2"
        title={label}
        sx={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: visible ? "text.primary" : "text.disabled",
        }}
      >
        {label}
      </Typography>

      {/**
       * Visibility belongs to TanStack's visibility feature.
       */}
      {enableVisibility && (
        <Switch
          size="small"
          checked={visible}
          disabled={!canHide}
          inputProps={{
            "aria-label": `${visible ? "Hide" : "Show"} ${label}`,
          }}
          onChange={(event) => {
            column.toggleVisibility(event.target.checked);
          }}
        />
      )}
    </Box>
  );
}
