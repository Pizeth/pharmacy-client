// src/components/DataTable/mui/query-url/createDataTableQueryUrlCodec.ts

import type {
  DataTableServerColumnFiltersState,
  DataTableServerQueryState,
  DataTableServerSortingState,
} from "../server-state";
import {
  DATA_TABLE_QUERY_URL_STATE_VERSION,
  type CreateDataTableQueryUrlCodecOptions,
  type DataTableQueryUrlCodec,
  type DataTableQueryUrlFilterFieldConfig,
  type DataTableQueryUrlFilterValue,
  type DataTableQueryUrlLimits,
} from "./types";

interface DataTableQueryUrlSortEntry {
  readonly field: string;
  readonly direction: "asc" | "desc";
}

interface DataTableQueryUrlFilterEntry {
  readonly field: string;
  readonly value: DataTableQueryUrlFilterValue;
}

interface DataTableQueryUrlEnvelope {
  readonly version:
    typeof DATA_TABLE_QUERY_URL_STATE_VERSION;
  readonly page: number;
  readonly pageSize: number;
  readonly sorting:
    readonly DataTableQueryUrlSortEntry[];
  readonly filters:
    readonly DataTableQueryUrlFilterEntry[];
  readonly search: string;
}

interface ResolvedFilterField {
  readonly columnId: string;
  readonly config: DataTableQueryUrlFilterFieldConfig;
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

interface ResolvedDataTableQueryUrlLimits {
  readonly pageSizes?: readonly number[];
  readonly maxPageSize: number;
  readonly maxPage: number;
  readonly maxSearchLength: number;
  readonly maxFilterStringLength: number;
  readonly maxFilterArrayLength: number;
}

const DEFAULT_DATA_TABLE_QUERY_URL_LIMITS:
  ResolvedDataTableQueryUrlLimits = {
    maxPageSize: 200,
    maxPage: 100_000,
    maxSearchLength: 256,
    maxFilterStringLength: 256,
    maxFilterArrayLength: 50,
  };

function resolveLimits(
  limits:
    DataTableQueryUrlLimits | undefined,
): ResolvedDataTableQueryUrlLimits {
  const pageSizes =
    limits?.pageSizes?.filter(
      (
        value,
      ) =>
        Number.isSafeInteger(
          value,
        ) &&
        value > 0,
    );

  return {
    pageSizes:
      pageSizes &&
      pageSizes.length > 0
        ? [
            ...new Set(
              pageSizes,
            ),
          ]
        : undefined,

    maxPageSize:
      Number.isSafeInteger(
        limits?.maxPageSize,
      ) &&
      (
        limits?.maxPageSize ??
        0
      ) > 0
        ? limits!.maxPageSize!
        : DEFAULT_DATA_TABLE_QUERY_URL_LIMITS.maxPageSize,

    maxPage:
      Number.isSafeInteger(
        limits?.maxPage,
      ) &&
      (
        limits?.maxPage ??
        0
      ) > 0
        ? limits!.maxPage!
        : DEFAULT_DATA_TABLE_QUERY_URL_LIMITS.maxPage,

    maxSearchLength:
      Number.isSafeInteger(
        limits?.maxSearchLength,
      ) &&
      (
        limits?.maxSearchLength ??
        -1
      ) >= 0
        ? limits!.maxSearchLength!
        : DEFAULT_DATA_TABLE_QUERY_URL_LIMITS.maxSearchLength,

    maxFilterStringLength:
      Number.isSafeInteger(
        limits?.maxFilterStringLength,
      ) &&
      (
        limits?.maxFilterStringLength ??
        -1
      ) >= 0
        ? limits!.maxFilterStringLength!
        : DEFAULT_DATA_TABLE_QUERY_URL_LIMITS.maxFilterStringLength,

    maxFilterArrayLength:
      Number.isSafeInteger(
        limits?.maxFilterArrayLength,
      ) &&
      (
        limits?.maxFilterArrayLength ??
        -1
      ) >= 0
        ? limits!.maxFilterArrayLength!
        : DEFAULT_DATA_TABLE_QUERY_URL_LIMITS.maxFilterArrayLength,
  };
}

function isBoundedPositiveInteger(
  value: unknown,
  max: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= max
  );
}

function isAllowedPageSize(
  value: unknown,
  limits:
    ResolvedDataTableQueryUrlLimits,
): value is number {
  if (
    typeof value !==
      "number" ||
    !Number.isSafeInteger(
      value,
    ) ||
    value <= 0
  ) {
    return false;
  }

  if (
    limits.pageSizes
  ) {
    return limits.pageSizes.includes(
      value,
    );
  }

  return (
    value <=
    limits.maxPageSize
  );
}

function isBoundedFilterScalar(
  value: unknown,
  limits:
    ResolvedDataTableQueryUrlLimits,
): value is
  | string
  | number
  | boolean {
  if (
    typeof value ===
    "string"
  ) {
    return (
      value.length <=
      limits.maxFilterStringLength
    );
  }

  return (
    typeof value ===
      "boolean" ||
    (
      typeof value ===
        "number" &&
      Number.isFinite(
        value,
      )
    )
  );
}

function isBoundedFilterValue(
  value: unknown,
  limits:
    ResolvedDataTableQueryUrlLimits,
): value is DataTableQueryUrlFilterValue {
  if (
    isBoundedFilterScalar(
      value,
      limits,
    )
  ) {
    return true;
  }

  return (
    Array.isArray(value) &&
    value.length <=
      limits.maxFilterArrayLength &&
    value.every(
      (
        item,
      ) =>
        isBoundedFilterScalar(
          item,
          limits,
        ),
    )
  );
}

function safeCall<T>(
  callback: () =>
    T | undefined,
): T | undefined {
  try {
    return callback();
  } catch {
    return undefined;
  }
}

function cloneFilterValue(
  value: DataTableQueryUrlFilterValue,
): DataTableQueryUrlFilterValue {
  return Array.isArray(value)
    ? [...value]
    : value;
}

function cloneState(
  state: DataTableServerQueryState,
): DataTableServerQueryState {
  return {
    pagination: {
      ...state.pagination,
    },
    sorting: state.sorting.map(
      (sort) => ({
        ...sort,
      }),
    ),
    columnFilters:
      state.columnFilters.map(
        (filter) => ({
          ...filter,
        }),
      ),
    globalFilter:
      state.globalFilter,
  };
}

function resolveFilterField(
  value: string | DataTableQueryUrlFilterFieldConfig,
): DataTableQueryUrlFilterFieldConfig {
  return typeof value === "string"
    ? {
        field: value,
      }
    : value;
}

function createReverseMap(
  map: Readonly<Record<string, string>>,
  kind: "sorting" | "filtering",
): ReadonlyMap<string, string> {
  const reverse =
    new Map<string, string>();

  for (
    const [
      columnId,
      publicField,
    ] of Object.entries(map)
  ) {
    if (publicField.length === 0) {
      throw new Error(
        `DataTable query URL ${kind} field for column "${columnId}" cannot be empty.`,
      );
    }

    const existing =
      reverse.get(publicField);

    if (
      existing !== undefined &&
      existing !== columnId
    ) {
      throw new Error(
        `DataTable query URL ${kind} field "${publicField}" is mapped by multiple columns.`,
      );
    }

    reverse.set(
      publicField,
      columnId,
    );
  }

  return reverse;
}

function createFilterMaps(
  filtering: Readonly<
    Record<
      string,
      string | DataTableQueryUrlFilterFieldConfig
    >
  >,
): {
  readonly byColumn:
    ReadonlyMap<
      string,
      DataTableQueryUrlFilterFieldConfig
    >;
  readonly byPublicField:
    ReadonlyMap<
      string,
      ResolvedFilterField
    >;
} {
  const byColumn =
    new Map<
      string,
      DataTableQueryUrlFilterFieldConfig
    >();

  const byPublicField =
    new Map<
      string,
      ResolvedFilterField
    >();

  for (
    const [
      columnId,
      rawConfig,
    ] of Object.entries(filtering)
  ) {
    const config =
      resolveFilterField(
        rawConfig,
      );

    if (config.field.length === 0) {
      throw new Error(
        `DataTable query URL filtering field for column "${columnId}" cannot be empty.`,
      );
    }

    const existing =
      byPublicField.get(
        config.field,
      );

    if (
      existing !== undefined &&
      existing.columnId !== columnId
    ) {
      throw new Error(
        `DataTable query URL filtering field "${config.field}" is mapped by multiple columns.`,
      );
    }

    byColumn.set(
      columnId,
      config,
    );

    byPublicField.set(
      config.field,
      {
        columnId,
        config,
      },
    );
  }

  return {
    byColumn,
    byPublicField,
  };
}

function parseJson(
  value: string | null,
): unknown {
  if (value === null) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function parseSorting(
  value: string | null,
  reverseSorting:
    ReadonlyMap<string, string>,
):
  | DataTableServerSortingState
  | undefined {
  const parsed =
    parseJson(value);

  if (!Array.isArray(parsed)) {
    return undefined;
  }

  const seen =
    new Set<string>();

  const sorting:
    DataTableServerSortingState =
    [];

  for (const entry of parsed) {
    if (
      !isRecord(entry) ||
      typeof entry.field !==
        "string" ||
      (
        entry.direction !==
          "asc" &&
        entry.direction !==
          "desc"
      )
    ) {
      continue;
    }

    const columnId =
      reverseSorting.get(
        entry.field,
      );

    if (
      columnId === undefined ||
      seen.has(columnId)
    ) {
      continue;
    }

    seen.add(columnId);

    sorting.push({
      id:
        columnId,
      desc:
        entry.direction ===
        "desc",
    });
  }

  return sorting;
}

function parseFilters(
  value: string | null,
  reverseFiltering:
    ReadonlyMap<
      string,
      ResolvedFilterField
    >,
  limits:
    ResolvedDataTableQueryUrlLimits,
):
  | DataTableServerColumnFiltersState
  | undefined {
  const parsed =
    parseJson(value);

  if (!Array.isArray(parsed)) {
    return undefined;
  }

  const seen =
    new Set<string>();

  const filters:
    DataTableServerColumnFiltersState =
    [];

  for (const entry of parsed) {
    if (
      !isRecord(entry) ||
      typeof entry.field !==
        "string" ||
      !isBoundedFilterValue(
        entry.value,
        limits,
      )
    ) {
      continue;
    }

    const resolved =
      reverseFiltering.get(
        entry.field,
      );

    if (
      resolved === undefined ||
      seen.has(
        resolved.columnId,
      )
    ) {
      continue;
    }

    const decoded =
      resolved.config.decode
        ? safeCall(
            () =>
              resolved.config.decode!(
                cloneFilterValue(
                  entry.value,
                ),
              ),
          )
        : cloneFilterValue(
            entry.value,
          );

    if (decoded === undefined) {
      continue;
    }

    seen.add(
      resolved.columnId,
    );

    filters.push({
      id:
        resolved.columnId,
      value:
        decoded,
    });
  }

  return filters;
}

function serializeSorting(
  sorting:
    DataTableServerSortingState,
  sortingMap:
    Readonly<Record<string, string>>,
): readonly DataTableQueryUrlSortEntry[] {
  const serialized:
    DataTableQueryUrlSortEntry[] =
    [];

  for (const sort of sorting) {
    const field =
      sortingMap[sort.id];

    /**
     * Never expose private/internal column IDs merely because a stale state
     * slice references one.
     */
    if (field === undefined) {
      continue;
    }

    serialized.push({
      field,
      direction:
        sort.desc
          ? "desc"
          : "asc",
    });
  }

  return serialized;
}

function serializeFilters(
  filters:
    DataTableServerColumnFiltersState,
  filteringMap:
    ReadonlyMap<
      string,
      DataTableQueryUrlFilterFieldConfig
    >,
  limits:
    ResolvedDataTableQueryUrlLimits,
): readonly DataTableQueryUrlFilterEntry[] {
  const serialized:
    DataTableQueryUrlFilterEntry[] =
    [];

  for (const filter of filters) {
    const config =
      filteringMap.get(
        filter.id,
      );

    if (config === undefined) {
      continue;
    }

    const encoded =
      config.encode
        ? safeCall(
            () =>
              config.encode!(
                filter.value,
              ),
          )
        : isBoundedFilterValue(
              filter.value,
              limits,
            )
          ? cloneFilterValue(
              filter.value,
            )
          : undefined;

    if (
      encoded === undefined ||
      !isBoundedFilterValue(
        encoded,
        limits,
      )
    ) {
      continue;
    }

    serialized.push({
      field:
        config.field,
      value:
        cloneFilterValue(
          encoded,
        ),
    });
  }

  return serialized;
}

function canonicalizeSearchFallback(
  _value: string,
  _limits:
    ResolvedDataTableQueryUrlLimits,
): string {
  /**
   * Serialization must never emit an oversized search term. Returning an empty
   * string keeps this pure helper resource-agnostic; resource defaults are
   * handled by the envelope/default comparison at the codec boundary.
   */
  return "";
}

function createEnvelope(
  state:
    DataTableServerQueryState,
  sortingMap:
    Readonly<Record<string, string>>,
  filteringMap:
    ReadonlyMap<
      string,
      DataTableQueryUrlFilterFieldConfig
    >,
  limits:
    ResolvedDataTableQueryUrlLimits,
): DataTableQueryUrlEnvelope {
  return {
    version:
      DATA_TABLE_QUERY_URL_STATE_VERSION,
    page:
      state.pagination
        .pageIndex +
      1,
    pageSize:
      state.pagination
        .pageSize,
    sorting:
      serializeSorting(
        state.sorting,
        sortingMap,
      ),
    filters:
      serializeFilters(
        state.columnFilters,
        filteringMap,
        limits,
      ),
    search:
      state.globalFilter.length <=
      limits.maxSearchLength
        ? state.globalFilter
        : canonicalizeSearchFallback(
            state.globalFilter,
            limits,
          ),
  };
}

function envelopesEqual(
  left:
    DataTableQueryUrlEnvelope,
  right:
    DataTableQueryUrlEnvelope,
): boolean {
  return (
    JSON.stringify(left) ===
    JSON.stringify(right)
  );
}

/**
 * Create the transport-independent shareable query-state codec.
 *
 * URL state deliberately contains public semantic field IDs instead of
 * TanStack column IDs or backend/private paths.
 */
export function createDataTableQueryUrlCodec(
  options:
    CreateDataTableQueryUrlCodecOptions,
): DataTableQueryUrlCodec {
  const {
    namespace =
      "dt",
    defaultState,
    fields,
    limits:
      configuredLimits,
  } = options;

  const limits =
    resolveLimits(
      configuredLimits,
    );

  if (
    namespace.length ===
    0
  ) {
    throw new Error(
      "DataTable query URL namespace cannot be empty.",
    );
  }

  const sortingMap =
    fields.sorting ?? {};

  const filtering =
    fields.filtering ?? {};

  const reverseSorting =
    createReverseMap(
      sortingMap,
      "sorting",
    );

  const {
    byColumn:
      filteringByColumn,
    byPublicField:
      filteringByPublicField,
  } =
    createFilterMaps(
      filtering,
    );

  const keys = {
    version:
      `${namespace}.v`,
    page:
      `${namespace}.page`,
    pageSize:
      `${namespace}.pageSize`,
    sorting:
      `${namespace}.sort`,
    filters:
      `${namespace}.filters`,
    search:
      `${namespace}.search`,
  } as const;

  const managedKeys =
    Object.values(keys);

  const canonicalDefault =
    cloneState(
      defaultState,
    );

  const defaultEnvelope =
    createEnvelope(
      canonicalDefault,
      sortingMap,
      filteringByColumn,
      limits,
    );

  const parse = (
    searchParams:
      URLSearchParams,
  ):
    DataTableServerQueryState => {
    if (
      searchParams.get(
        keys.version,
      ) !==
      String(
        DATA_TABLE_QUERY_URL_STATE_VERSION,
      )
    ) {
      return cloneState(
        canonicalDefault,
      );
    }

    const parsedPage =
      Number(
        searchParams.get(
          keys.page,
        ),
      );

    const parsedPageSize =
      Number(
        searchParams.get(
          keys.pageSize,
        ),
      );

    const sorting =
      parseSorting(
        searchParams.get(
          keys.sorting,
        ),
        reverseSorting,
      );

    const filters =
      parseFilters(
        searchParams.get(
          keys.filters,
        ),
        filteringByPublicField,
        limits,
      );

    const search =
      searchParams.get(
        keys.search,
      );

    return {
      pagination: {
        pageIndex:
          isBoundedPositiveInteger(
            parsedPage,
            limits.maxPage,
          )
            ? parsedPage -
              1
            : canonicalDefault
                .pagination
                .pageIndex,

        pageSize:
          isAllowedPageSize(
            parsedPageSize,
            limits,
          )
            ? parsedPageSize
            : canonicalDefault
                .pagination
                .pageSize,
      },

      sorting:
        sorting ??
        canonicalDefault.sorting.map(
          (sort) => ({
            ...sort,
          }),
        ),

      columnFilters:
        filters ??
        canonicalDefault.columnFilters.map(
          (filter) => ({
            ...filter,
          }),
        ),

      globalFilter:
        search !== null &&
        search.length <=
          limits.maxSearchLength
          ? search
          : canonicalDefault.globalFilter,
    };
  };

  const serialize = (
    state:
      DataTableServerQueryState,
    current =
      new URLSearchParams(),
  ): URLSearchParams => {
    const next =
      new URLSearchParams(
        current.toString(),
      );

    for (
      const key of
      managedKeys
    ) {
      next.delete(key);
    }

    const envelope =
      createEnvelope(
        state,
        sortingMap,
        filteringByColumn,
        limits,
      );

    /**
     * Keep pristine/default routes clean.
     */
    if (
      envelopesEqual(
        envelope,
        defaultEnvelope,
      )
    ) {
      return next;
    }

    next.set(
      keys.version,
      String(
        envelope.version,
      ),
    );

    next.set(
      keys.page,
      String(
        envelope.page,
      ),
    );

    next.set(
      keys.pageSize,
      String(
        envelope.pageSize,
      ),
    );

    next.set(
      keys.sorting,
      JSON.stringify(
        envelope.sorting,
      ),
    );

    next.set(
      keys.filters,
      JSON.stringify(
        envelope.filters,
      ),
    );

    next.set(
      keys.search,
      envelope.search,
    );

    return next;
  };

  return {
    namespace,
    defaultState:
      cloneState(
        canonicalDefault,
      ),
    parse,
    serialize,
  };
}

/**
 * Compare the canonical server-query families used by the URL integration.
 *
 * Filter values are intentionally compared structurally because URL decoding
 * creates fresh scalar-array instances.
 */
export function areDataTableServerQueryStatesEqual(
  left:
    DataTableServerQueryState,
  right:
    DataTableServerQueryState,
): boolean {
  return (
    left.pagination.pageIndex ===
      right.pagination.pageIndex &&
    left.pagination.pageSize ===
      right.pagination.pageSize &&
    left.globalFilter ===
      right.globalFilter &&
    JSON.stringify(
      left.sorting,
    ) ===
      JSON.stringify(
        right.sorting,
      ) &&
    JSON.stringify(
      left.columnFilters,
    ) ===
      JSON.stringify(
        right.columnFilters,
      )
  );
}
