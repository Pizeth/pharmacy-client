"use client";

import type { RowData } from "@tanstack/table-core";
import { DATA_TABLE_ACTIONS_COLUMN_ID } from "../columns/actions/types";
import type { MuiDataTableInstance } from "../table";
import { getDataTableVisibleColumnsInRenderOrder } from "./visibleColumnOrder";

export interface DataTableColumnGroupProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly fillContainer?: boolean;
}

/**
 * Native HTML column sizing bridge.
 *
 * TanStack remains the source of truth for resolved widths:
 *
 *   column.getSize()
 *
 * The <colgroup> communicates those resolved pixel widths to the browser's
 * native table layout algorithm.
 *
 * Hidden columns are omitted because getVisibleLeafColumns() already applies
 * column visibility state.
 *
 * The column sequence must track:
 *
 * - visibility
 * - pinning
 *
 * while each width tracks:
 *
 * - committed column sizing
 */
export function DataTableColumnGroup<TData extends RowData>(
  props: DataTableColumnGroupProps<TData>,
) {
  const { table, fillContainer } = props;

  return (
    <table.Subscribe
      //   source={table.atoms.columnSizing}
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        columnOrder: state.columnOrder,
      })}
    >
      {() => {
        const columns = getDataTableVisibleColumnsInRenderOrder(table);
        const hasActions = columns.some(column => column.id === DATA_TABLE_ACTIONS_COLUMN_ID);
        const fillColumn = fillContainer && hasActions
          ? columns.findLast(column => !column.getIsPinned() && column.id !== DATA_TABLE_ACTIONS_COLUMN_ID && column.columnDef.enableResizing !== false)
          : undefined;

        return (
          <colgroup>
            {columns.map(column => {
              const size = column.getSize();
              // Give the spare width to an unpinned content column so sticky offsets stay valid.
              const width = column === fillColumn
                ? `max(${size}px, calc(100cqw - ${table.getTotalSize() - size}px))`
                : size;

              return (
                <col key={column.id} data-column-id={column.id}
                  data-pinned={column.getIsPinned() || undefined} style={{ width }} />
              );
            })}
          </colgroup>
        );
      }}
    </table.Subscribe>
  );
}
