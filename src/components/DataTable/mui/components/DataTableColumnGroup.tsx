"use client";

import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../table";

export interface DataTableColumnGroupProps<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
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
  const { table } = props;

  return (
    <table.Subscribe
      //   source={table.atoms.columnSizing}
      selector={(state) => ({
        columnSizing: state.columnSizing,
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
      })}
    >
      {() => (
        <colgroup>
          {table.getVisibleLeafColumns().map((column) => (
            <col
              key={column.id}
              data-column-id={column.id}
              data-pinned={column.getIsPinned() || undefined}
              style={{
                width: column.getSize(),
              }}
            />
          ))}
        </colgroup>
      )}
    </table.Subscribe>
  );
}
