import {
  rowSelectionFeature,
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnVisibilityFeature,
  columnPinningFeature,
  columnSizingFeature,
  type RowData,
  type TableFeature,
  TableFeatures,
} from "@tanstack/react-table";
import type { DataTableFeatureConfig, ResolvedTableFeatures } from "./types";

export function resolveDataTableFeatures(
  config: DataTableFeatureConfig = {},
): Partial<TableFeatures> {
  // const features: TableFeature[] = [];
  const features: Partial<TableFeatures> = {};

  if (config.sorting) {
    features.rowSortingFeature = rowSortingFeature;
  }

  if (config.filtering) {
    features.columnFilteringFeature = columnFilteringFeature;
  }

  if (config.globalFiltering) {
    features.globalFilteringFeature = globalFilteringFeature;
  }

  if (config.pagination) {
    features.rowPaginationFeature = rowPaginationFeature;
  }

  if (config.selection) {
    features.rowSelectionFeature = rowSelectionFeature;
  }

  if (config.visibility) {
    features.columnVisibilityFeature = columnVisibilityFeature;
  }

  if (config.pinning) {
    features.columnPinningFeature = columnPinningFeature;
  }

  if (config.sizing) {
    features.columnSizingFeature = columnSizingFeature;
  }

  return features;
}
