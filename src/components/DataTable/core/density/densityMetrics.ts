// src/components/DataTable/core/density/densityMetrics.ts

import type {
  MuiDataTableDensity,
} from "./types";

export interface DataTableDensityMetrics {
  readonly headerHeight: number;
  readonly bodyRowHeight: number;
  readonly cellPaddingInline: number;
  readonly cellPaddingBlock: number;
  readonly footerHeight: number;
  readonly footerPaddingBlock: number;
  readonly nowrap: boolean;
}

const DATA_TABLE_DENSITY_METRICS: Readonly<
  Record<
    MuiDataTableDensity,
    DataTableDensityMetrics
  >
> = {
  compact: {
    headerHeight: 36,
    bodyRowHeight: 37,
    cellPaddingInline: 0.75,
    cellPaddingBlock: 0.25,
    footerHeight: 40,
    footerPaddingBlock: 0.25,
    nowrap: true,
  },

  comfortable: {
    headerHeight: 56,
    bodyRowHeight: 58,
    cellPaddingInline: 1.5,
    cellPaddingBlock: 1,
    footerHeight: 56,
    footerPaddingBlock: 1,
    nowrap: false,
  },

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

export function getDataTableDensityMetrics(
  density: MuiDataTableDensity,
): DataTableDensityMetrics {
  return DATA_TABLE_DENSITY_METRICS[
    density
  ];
}
