// export const DATA_TABLE_FEATURES = {
//   sorting: "sorting",
//   filtering: "filtering",
//   globalFiltering: "globalFiltering",
//   pagination: "pagination",
//   selection: "selection",
//   visibility: "visibility",
//   pinning: "pinning",
//   sizing: "sizing",
// } as const;

// export type DataTableFeatureName = keyof typeof DATA_TABLE_FEATURES;

import type { DataTableFeatureName } from "./names";

export type DataTableFeatureConfig = Partial<
  Record<DataTableFeatureName, boolean>
>;
