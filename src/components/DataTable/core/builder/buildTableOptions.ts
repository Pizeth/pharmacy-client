// src/components/DataTable/core/builder/buildTableOptions.ts

import type { RowData, TableOptions } from "@tanstack/table-core";
import { resolveFeatures } from "../features/resolveFeatures";
import { DataTableFeatureConfig } from "../features/types";
import type { ResolveFeatures } from "../features/resolveFeatures.types";
import { BuildTableOptionsInput } from "./types";

/**
 * Final TanStack feature set produced from one
 * DataTable feature configuration.
 *
 * Today it maps directly to ResolveFeatures<TConfig>.
 * Future framework-level TanStack features may be composed
 * here if we actually introduce them.
 */
export type BuiltTableFeatures<TConfig extends DataTableFeatureConfig> =
  ResolveFeatures<TConfig>;

/**
 * Final TanStack options type produced by the builder.
 */
export type BuiltTableOptions<
  TConfig extends DataTableFeatureConfig,
  TData extends RowData,
> = TableOptions<BuiltTableFeatures<TConfig>, TData>;

/**
 * Converts the framework's public DataTable configuration
 * into TanStack Table v9 options.
 *
 * Important:
 *
 * TanStack validates the feature object using its internal
 * ValidateFeatureSlots<TFeatures> type.
 *
 * Our resolver constructs that object dynamically from
 * TConfig. TypeScript retains the exact feature-slot type
 * through ResolveFeatures<TConfig>, but cannot prove the
 * resulting generic object satisfies TanStack's internal
 * validator.
 *
 * Therefore this function is the single intentional assertion
 * boundary between:
 *
 *   our strongly typed feature resolver
 *
 * and:
 *
 *   TanStack's internal feature-slot validator.
 *
 * Do not spread this assertion elsewhere in the framework.
 */
export function buildTableOptions<
  const TConfig extends DataTableFeatureConfig,
  TData extends RowData,
>(
  input: BuildTableOptionsInput<TData, TConfig>,
): BuiltTableOptions<TConfig, TData> {
  const features = resolveFeatures(input.features);

  /**
   * TanStack's TableOptions performs additional validation
   * of the feature slots.
   *
   * Our resolver constructs those slots dynamically, so
   * TypeScript may not always be able to prove the complete
   * ValidateFeatureSlots relationship from this local object.
   *
   * Keep any assertion isolated to this framework boundary.
   */
  return {
    data: input.data,
    columns: input.columns,
    features,
  } as unknown as BuiltTableOptions<TConfig, TData>;
}
