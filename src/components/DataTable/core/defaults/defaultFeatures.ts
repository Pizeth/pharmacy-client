// import { coreFeatures } from "@tanstack/table-core";

// export const defaultFeatures = {
//   ...coreFeatures,
// } as const;

import {
  rowPaginationFeature,
  rowSortingFeature,
  columnVisibilityFeature,
} from "@tanstack/table-core";

export const defaultFeatures = {
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
} as const;
