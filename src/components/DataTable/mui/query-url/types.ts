// src/components/DataTable/mui/query-url/types.ts

import type {
  DataTableServerQueryState,
} from "../server-state";

/**
 * Version of the shareable DataTable server-query URL format.
 *
 * This version belongs to the browser/shareable-query contract only. It is
 * deliberately independent from:
 *
 * - the saved visual-preference schema,
 * - TanStack internal state versions,
 * - backend transport payload versions.
 */
export const DATA_TABLE_QUERY_URL_STATE_VERSION = 1 as const;

export type DataTableQueryUrlStateVersion =
  typeof DATA_TABLE_QUERY_URL_STATE_VERSION;

export type DataTableQueryUrlHistoryMode =
  | "replace"
  | "push";

export type DataTableQueryUrlFilterScalar =
  | string
  | number
  | boolean;

export type DataTableQueryUrlFilterValue =
  | DataTableQueryUrlFilterScalar
  | readonly DataTableQueryUrlFilterScalar[];

export interface DataTableQueryUrlFilterFieldConfig {
  /**
   * Public semantic field identifier written to the URL.
   *
   * This must not be a private database/backend path.
   */
  readonly field: string;

  /**
   * Optional resource-owned conversion from TanStack's erased filter value to
   * the safe shareable URL value family.
   */
  readonly encode?: (
    value: unknown,
  ) => DataTableQueryUrlFilterValue | undefined;

  /**
   * Optional inverse conversion back into the TanStack column-filter value.
   */
  readonly decode?: (
    value: DataTableQueryUrlFilterValue,
  ) => unknown | undefined;
}

export type DataTableQueryUrlFilterField =
  | string
  | DataTableQueryUrlFilterFieldConfig;

export interface DataTableQueryUrlFieldMap {
  /**
   * TanStack/UI column ID -> public semantic sort field.
   */
  readonly sorting?: Readonly<
    Record<string, string>
  >;

  /**
   * TanStack/UI column ID -> public semantic filter field.
   */
  readonly filtering?: Readonly<
    Record<
      string,
      DataTableQueryUrlFilterField
    >
  >;
}

export interface DataTableQueryUrlLimits {
  /**
   * Optional exact page-size allow-list.
   *
   * When present this takes precedence over maxPageSize.
   */
  readonly pageSizes?: readonly number[];

  /**
   * Maximum page size accepted when no exact allow-list is supplied.
   *
   * Default: 200.
   */
  readonly maxPageSize?: number;

  /**
   * Maximum one-based page number accepted from the URL.
   *
   * Default: 100_000.
   */
  readonly maxPage?: number;

  /**
   * Maximum global-search string length.
   *
   * Default: 256.
   */
  readonly maxSearchLength?: number;

  /**
   * Maximum string length for one scalar filter value.
   *
   * Default: 256.
   */
  readonly maxFilterStringLength?: number;

  /**
   * Maximum number of scalar values in one array filter.
   *
   * Default: 50.
   */
  readonly maxFilterArrayLength?: number;

  /**
   * Maximum decoded character length of one JSON-backed URL parameter before
   * JSON.parse() is attempted.
   *
   * Applies independently to sorting and filter parameters.
   *
   * Default: 16_384.
   */
  readonly maxJsonParameterLength?: number;
}

export interface CreateDataTableQueryUrlCodecOptions {
  /**
   * Query-parameter namespace.
   *
   * Default: "dt".
   *
   * Multiple tables on one page can use different namespaces.
   */
  readonly namespace?: string;

  /**
   * Canonical query state used when no supported DataTable URL state exists.
   */
  readonly defaultState: DataTableServerQueryState;

  /**
   * Explicit resource mapping between UI/TanStack column IDs and public
   * semantic field IDs.
   */
  readonly fields: DataTableQueryUrlFieldMap;

  /**
   * Defensive browser-input limits.
   *
   * Invalid/out-of-range values fall back to the corresponding default-state
   * family rather than being silently clamped into a different shared query.
   */
  readonly limits?: DataTableQueryUrlLimits;
}

export interface DataTableQueryUrlCodec {
  readonly namespace: string;
  readonly defaultState: DataTableServerQueryState;

  /**
   * Parse one browser query string into a complete canonical server-query
   * state. Unknown versions and malformed values fall back safely.
   */
  readonly parse: (
    searchParams: URLSearchParams,
  ) => DataTableServerQueryState;

  /**
   * Merge one canonical DataTable query state into existing query parameters.
   *
   * Unrelated application query parameters are preserved.
   */
  readonly serialize: (
    state: DataTableServerQueryState,
    current?: URLSearchParams,
  ) => URLSearchParams;
}
