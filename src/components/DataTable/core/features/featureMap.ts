// import type { TableFeature } from "@tanstack/table-core";

// import { rowSortingFeature } from "./sorting";

// import { rowPaginationFeature } from "./pagination";

// import { columnFilteringFeature, globalFilteringFeature } from "./filtering";

// import { rowSelectionFeature } from "./selection";

// import { columnVisibilityFeature } from "./visibility";

// import { columnPinningFeature } from "./pinning";

// import { columnSizingFeature } from "./sizing";

// /**
//  * Public DataTable feature name
//  * -> TanStack feature slot
//  */
// export const featureMap = {
//   sorting: {
//     key: "rowSortingFeature",
//     feature: rowSortingFeature,
//   },

//   filtering: {
//     key: "columnFilteringFeature",
//     feature: columnFilteringFeature,
//   },

//   globalFiltering: {
//     key: "globalFilteringFeature",
//     feature: globalFilteringFeature,
//   },

//   pagination: {
//     key: "rowPaginationFeature",
//     feature: rowPaginationFeature,
//   },

//   selection: {
//     key: "rowSelectionFeature",
//     feature: rowSelectionFeature,
//   },

//   visibility: {
//     key: "columnVisibilityFeature",
//     feature: columnVisibilityFeature,
//   },

//   pinning: {
//     key: "columnPinningFeature",
//     feature: columnPinningFeature,
//   },

//   sizing: {
//     key: "columnSizingFeature",
//     feature: columnSizingFeature,
//   },
// } as const;

// export type FeatureMap = typeof featureMap;

import type { TableFeature } from "@tanstack/table-core";

import { rowSortingFeature } from "./sorting";

import { rowPaginationFeature } from "./pagination";

import { columnFilteringFeature, globalFilteringFeature } from "./filtering";

import { rowSelectionFeature } from "./selection";

import { columnVisibilityFeature } from "./visibility";

import { columnPinningFeature } from "./pinning";

import { columnSizingFeature } from "./sizing";

export const featureMap = {
  sorting: {
    slot: "rowSortingFeature",
    feature: rowSortingFeature,
  },

  filtering: {
    slot: "columnFilteringFeature",
    feature: columnFilteringFeature,
  },

  globalFiltering: {
    slot: "globalFilteringFeature",
    feature: globalFilteringFeature,
  },

  pagination: {
    slot: "rowPaginationFeature",
    feature: rowPaginationFeature,
  },

  selection: {
    slot: "rowSelectionFeature",
    feature: rowSelectionFeature,
  },

  visibility: {
    slot: "columnVisibilityFeature",
    feature: columnVisibilityFeature,
  },

  pinning: {
    slot: "columnPinningFeature",
    feature: columnPinningFeature,
  },

  sizing: {
    slot: "columnSizingFeature",
    feature: columnSizingFeature,
  },
} as const;

export type FeatureMap = typeof featureMap;
