"use client";

import { TableRow } from "@mui/material";
import type { HeaderGroup, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableHeaderCell } from "./DataTableHeaderCell";

export interface DataTableHeaderRowProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly headerGroup: HeaderGroup<MuiDataTableFeatures, TData>;

  /**
   * Zero-based visual header row position.
   *
   * Used to calculate vertical sticky offsets.
   */
  readonly headerRowIndex: number;
}

/**
 * Renders one TanStack header group.
 */
export function DataTableHeaderRow<TData extends RowData>(
  props: DataTableHeaderRowProps<TData>,
) {
  const { table, headerGroup, headerRowIndex } = props;

  return (
    <TableRow
      data-header-group-id={headerGroup.id}
      data-header-row-index={headerRowIndex}
    >
      {headerGroup.headers.map((header) => (
        <DataTableHeaderCell
          key={header.id}
          table={table}
          header={header}
          headerRowIndex={headerRowIndex}
        />
      ))}
    </TableRow>
  );
}
