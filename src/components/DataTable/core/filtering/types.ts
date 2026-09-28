// src/components/DataTable/core/filtering/types.ts

/**
 * Number-range value shared by renderer controls and transport-independent
 * server filter mappers.
 */
export type DataTableNumberRangeValue = readonly [
  min: number | undefined,
  max: number | undefined,
];
