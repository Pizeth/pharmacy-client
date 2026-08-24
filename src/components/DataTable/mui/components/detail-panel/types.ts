// mui/components/detail-panel/types.ts

import type { ReactNode } from "react";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

export interface DataTableDetailPanelContext<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
}

/**
 * Detail-panel renderer executed beneath an expanded data row.
 */
export type DataTableDetailPanelRenderer<TData extends RowData> = (
  context: DataTableDetailPanelContext<TData>,
) => ReactNode;
