import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../table";

/** Match the physical table grid rendered by pinned headers and body cells. */
export function getDataTableVisibleColumnsInRenderOrder<TData extends RowData>(
  table: MuiDataTableInstance<TData>,
) {
  return [
    ...table.getStartVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getEndVisibleLeafColumns(),
  ];
}
