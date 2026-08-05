// src/components/DataTable/core/builder/buildTableOptions.ts

import type {
  RowData,
  TableFeatures,
  TableOptions,
} from "@tanstack/table-core";
import { resolveFeatures } from "../features/resolveFeatures";
import { DataTableFeatureConfig } from "../features/types";
import type { ResolveFeatures } from "../features/resolveFeatures.types";
import { frameworkFeatures } from "../defaults/frameworkFeatures";
import type { FrameworkFeatures } from "../defaults/frameworkFeatures";
import type { MergeFeatures } from "../types/mergeFeatures";

// import { DataTableFeatureConfig } from "../table/types";

// import type { DataTableFeatureConfig } from "../table/types";

// export interface BuildTableOptionsInput<TData extends RowData> {
//   data: TData[];
//   columns: unknown[];
//   features?: DataTableFeatureConfig;
// }

export interface BuildTableOptionsInput<
  TData extends RowData,
  TConfig extends DataTableFeatureConfig,
> {
  data: TData[];

  columns: unknown[];

  features: TConfig;
}

/**
 * Converts our public configuration
 * into TanStack TableOptions.
 */
// export function buildTableOptions<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
// >(_input: BuildTableOptionsInput<TData>): TableOptions<TFeatures, TData> {
//   throw new Error("Not implemented yet.");
// }

export function buildTableOptions<
  const TConfig extends DataTableFeatureConfig,
  TData extends RowData,
>(
  input: BuildTableOptionsInput<TData, TConfig>,
): TableOptions<
  MergeFeatures<FrameworkFeatures, ResolveFeatures<TConfig>>,
  TData
> {
  // ): TableOptions<ResolveFeatures<TConfig>, TData> {
  // const features = resolveFeatures(input.features);

  const userFeatures = resolveFeatures(input.features);

  const features = {
    ...frameworkFeatures,
    ...userFeatures,
  };

  return {
    data: input.data,
    columns: input.columns,
    features,
  } as unknown as TableOptions<
    MergeFeatures<FrameworkFeatures, ResolveFeatures<TConfig>>,
    TData
  >;
}

type User = {
  id: number;
  name: string;
};

const options = buildTableOptions({
  data: [
    {
      id: 1,
      name: "John",
    },
  ],

  columns: [],

  features: {
    sorting: true,
    pagination: true,
  },
});

console.log(options.features);
