// src/components/DataTable/mui/density/densityMetrics.ts

import type { MuiDataTableDensity } from "./types";

/**
 * Physical rendering measurements associated with one DataTable
 * density.
 *
 * Heights are expressed in CSS pixels.
 *
 * Padding values are MUI spacing multipliers because they are consumed
 * through the `sx` system.
 */
export interface DataTableDensityMetrics {
  /**
   * Deterministic header-row height.
   *
   * Required for stacked sticky header offsets.
   */
  readonly headerHeight: number;

  /**
   * Minimum height of a body row/cell.
   */
  readonly bodyRowHeight: number;

  /**
   * Horizontal cell padding in MUI spacing units.
   */
  readonly cellPaddingInline: number;

  /**
   * Vertical cell padding in MUI spacing units.
   */
  readonly cellPaddingBlock: number;

  /**
   * Minimum pagination/footer height.
   */
  readonly footerHeight: number;

  /**
   * Vertical pagination/footer padding in MUI spacing units.
   */
  readonly footerPaddingBlock: number;

  /**
   * Whether normal data-cell text should remain on one line.
   *
   * Compact mode favors dense scanning.
   * Larger modes allow natural wrapping.
   */
  readonly nowrap: boolean;
}

const DATA_TABLE_DENSITY_METRICS: Readonly<
  Record<MuiDataTableDensity, DataTableDensityMetrics>
> = {
  /**
   * Closely follows MRT's compact ~37px row footprint.
   */
  compact: {
    headerHeight: 40,
    bodyRowHeight: 37,
    cellPaddingInline: 1,
    cellPaddingBlock: 0.5,
    footerHeight: 44,
    footerPaddingBlock: 0.5,
    nowrap: true,
  },

  /**
   * Balanced default.
   *
   * MRT's corresponding virtualized row estimate is ~58px.
   */
  comfortable: {
    headerHeight: 56,
    bodyRowHeight: 58,
    cellPaddingInline: 1.5,
    cellPaddingBlock: 1,
    footerHeight: 56,
    footerPaddingBlock: 1,
    nowrap: false,
  },

  /**
   * Largest visual spacing.
   *
   * MRT's corresponding virtualized row estimate is ~73px.
   */
  spacious: {
    headerHeight: 72,
    bodyRowHeight: 73,
    cellPaddingInline: 2,
    cellPaddingBlock: 1.5,
    footerHeight: 64,
    footerPaddingBlock: 1.5,
    nowrap: false,
  },
};

/**
 * Resolve the rendering measurements for one density.
 *
 * Keeping these values in one place prevents individual cells,
 * headers, pagination, and future toolbar components from inventing
 * independent density rules.
 */
export function getDataTableDensityMetrics(
  density: MuiDataTableDensity,
): DataTableDensityMetrics {
  return DATA_TABLE_DENSITY_METRICS[density];
}
