"use client";

import { Box, Stack, Typography } from "@mui/material";
import type { Column, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnManagerItem } from "./DataTableColumnManagerItem";
import type { DataTableColumnRegion } from "./ordering";

export interface DataTableColumnManagerSectionProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly region: DataTableColumnRegion;
  readonly columns: readonly Column<MuiDataTableFeatures, TData, unknown>[];
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

const REGION_LABELS: Readonly<Record<DataTableColumnRegion, string>> = {
  start: "Pinned start",
  center: "Columns",
  end: "Pinned end",
};

export function DataTableColumnManagerSection<TData extends RowData>(
  props: DataTableColumnManagerSectionProps<TData>,
) {
  const {
    table,
    region,
    columns,

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

  if (columns.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{
          display: "block",
          px: 1,
          py: 0.5,
          lineHeight: 1.5,
        }}
      >
        {REGION_LABELS[region]}
      </Typography>

      <Stack spacing={0.25}>
        {columns.map((column) => (
          <DataTableColumnManagerItem
            key={column.id}
            table={table}
            column={column}
            enableOrdering={enableOrdering}
            enableVisibility={enableVisibility}
            enablePinning={enablePinning}
            draggingColumnId={draggingColumnId}
            dropTargetColumnId={dropTargetColumnId}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </Stack>
    </Box>
  );
}
