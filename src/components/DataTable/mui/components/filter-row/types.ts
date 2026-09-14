import type { CSSProperties } from "react";

/** Runtime measurements only; permanent presentation belongs to styled slots. */
export interface DataTableFilterCellStyle extends CSSProperties {
  "--DataTable-column-size": `${number}px`;
  "--DataTable-filter-sticky-top": `${number}px`;
  "--DataTable-filter-cell-height": `${number}px`;
  "--DataTable-column-pinned-offset"?: `${number}px`;
}
