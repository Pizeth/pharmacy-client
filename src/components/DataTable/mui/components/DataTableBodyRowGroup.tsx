"use client";

import { Fragment } from "react";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../features";
import type { MuiDataTableInstance } from "../table";
import { DataTableBodyRow } from "./DataTableBodyRow";
import type { DataTableRowClickHandler } from "./DataTableBodyRow";
import { DataTableDetailPanelRow } from "./detail-panel";
import type { DataTableDetailPanelRenderer } from "./detail-panel";

export interface DataTableBodyRowGroupProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
  readonly pinnedRowStickyTop: number;
  readonly stickyRowPinning: boolean;
  readonly dualEdgeStickyRowPinning: boolean;
  readonly stickyPinnedRowIds: readonly string[];
  readonly renderDetailPanel?: DataTableDetailPanelRenderer<TData>;
  readonly onRowClick?: DataTableRowClickHandler<TData>;
}

/**
 * Renders one logical body-row unit:
 *
 *   data row
 *
 * followed optionally by:
 *
 *   expanded detail-panel row
 */
export function DataTableBodyRowGroup<TData extends RowData>(
  props: DataTableBodyRowGroupProps<TData>,
) {
  const {
    table,
    row,
    pinnedRowStickyTop,
    stickyRowPinning,
    dualEdgeStickyRowPinning,
    stickyPinnedRowIds,
    renderDetailPanel,
    onRowClick,
  } = props;

  return (
    <Fragment>
      <DataTableBodyRow
        table={table}
        row={row}
        pinnedRowStickyTop={pinnedRowStickyTop}
        stickyRowPinning={stickyRowPinning}
        onRowClick={onRowClick}
        dualEdgeStickyRowPinning={dualEdgeStickyRowPinning}
        stickyPinnedRowIds={stickyPinnedRowIds}
      />

      {renderDetailPanel && (
        <DataTableDetailPanelRow
          table={table}
          row={row}
          renderDetailPanel={renderDetailPanel}
        />
      )}
    </Fragment>
  );
}
