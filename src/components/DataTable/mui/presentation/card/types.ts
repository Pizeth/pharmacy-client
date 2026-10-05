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
 * How a card shows its detail content.
 *
 * - "inline": the detail is appended inside the card when the row is
 *   expanded (default).
 * - "flip": the card turns over and the detail is shown on its back.
 */
export type DataTableCardDetailMode = "inline" | "flip";

export interface DataTableCardFlipLabels {
  /** Front-face control. Default "Show details". */
  readonly showDetails?: string;

  /** Back-face control. Default "Back to front". */
  readonly hideDetails?: string;
}

export interface DataTableCardFlipConfig {
  /**
   * Also flip while a mouse pointer hovers the card. Default true.
   *
   * Touch and pen input never flip on hover, so on phones and tablets the
   * flip control is the only way to turn the card.
   */
  readonly flipOnHover?: boolean;

  readonly labels?: DataTableCardFlipLabels;

  /**
   * Icon of the flip control. Defaults to a circular-arrows icon.
   */
  readonly icon?: ReactNode;
}

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

  /**
   * Where the detail content appears. Default "inline".
   *
   * "flip" needs a detail renderer (renderDetail or
   * DataTable.renderDetailPanel) and expandable rows
   * (getRowCanExpand); a card without either stays a single face.
   * In flip mode the flip control replaces the expansion control, so
   * enableExpansion and renderExpansion are ignored. Expansion state still
   * drives the flip, so a flipped card stays flipped until turned back.
   */
  readonly detailMode?: DataTableCardDetailMode;

  /**
   * Options for detailMode "flip".
   */
  readonly flip?: DataTableCardFlipConfig;
}
