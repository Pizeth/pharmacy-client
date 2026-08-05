export const DATA_TABLE_FEATURE_NAMES = [
  "sorting",
  "filtering",
  "globalFiltering",
  "pagination",
  "selection",
  "visibility",
  "pinning",
  "sizing",
] as const;

export type DataTableFeatureName = (typeof DATA_TABLE_FEATURE_NAMES)[number];
