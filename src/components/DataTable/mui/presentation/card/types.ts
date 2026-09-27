import type { ReactNode } from "react";
import type { Row, RowData } from "@tanstack/table-core";

import type { MuiDataTableFeatures } from "../../features";
import type { DataTableRowAction } from "../../columns/actions";
import type { MuiDataTableInstance } from "../../table";

export interface DataTableCardRenderContext<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
}

export type DataTableCardRenderer<TData extends RowData> = (
  context: DataTableCardRenderContext<TData>,
) => ReactNode;

/**
 * Resource-owned composition for the generic card presentation.
 *
 * DataTable owns structural wrappers and theme slots. Resources own only the
 * content that makes sense for one domain record.
 */
export interface DataTableCardConfig<TData extends RowData> {
  readonly renderHeader?: DataTableCardRenderer<TData>;

  /**
   * Required so generic DataTable never guesses how arbitrary columns should
   * become a resource card.
   */
  readonly renderBody: DataTableCardRenderer<TData>;

  readonly renderMetadata?: DataTableCardRenderer<TData>;

  /**
   * Reuse the standard row-action contract in card presentation.
   *
   * renderActions remains an escape hatch for resource-specific composition.
   */
  readonly actions?: readonly DataTableRowAction<TData>[];
  readonly maxInlineActions?: number;
  readonly renderActions?: DataTableCardRenderer<TData>;

  /**
   * Generic TanStack-backed row controls.
   *
   * Custom renderers take precedence when supplied.
   */
  readonly enableSelection?: boolean;
  readonly renderSelection?: DataTableCardRenderer<TData>;

  readonly enableExpansion?: boolean;
  readonly renderExpansion?: DataTableCardRenderer<TData>;

  /**
   * Optional card-specific detail renderer.
   * Falls back to DataTable.renderDetailPanel when omitted.
   */
  readonly renderDetail?: DataTableCardRenderer<TData>;
}
