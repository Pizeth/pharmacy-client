// src/components/DataTable/mui/server-data/offsetPagination.ts

import type {
  DataTableServerQueryState,
} from "../server-state";

/**
 * Generic one-based offset-pagination request.
 *
 * This matches APIs using:
 *
 *   page = 1
 *   pageSize = 25
 *
 * rather than TanStack's:
 *
 *   pageIndex = 0
 */
export interface DataTableOffsetPaginationRequest {
  readonly page: number;
  readonly pageSize: number;
}

export interface DataTableOffsetPaginationLimits {
  /**
   * Optional exact page-size allow-list.
   */
  readonly pageSizes?: readonly number[];

  /**
   * Fallback maximum page size when no allow-list is supplied.
   *
   * Default: 200.
   */
  readonly maxPageSize?: number;

  /**
   * Maximum one-based page that can cross the server-query boundary.
   *
   * Default: 100_000.
   */
  readonly maxPage?: number;

  /**
   * Safe page size used when state contains an invalid value.
   *
   * Default: 25.
   */
  readonly defaultPageSize?: number;
}

function resolvePositiveSafeInteger(
  value: number | undefined,
  fallback: number,
): number {
  return (
    Number.isSafeInteger(
      value,
    ) &&
    (
      value ??
      0
    ) > 0
  )
    ? (value as number)
    : fallback;
}

function resolveAllowedPageSize(
  pageSize: number,
  limits:
    DataTableOffsetPaginationLimits,
): number {
  const configuredDefault =
    resolvePositiveSafeInteger(
      limits.defaultPageSize,
      25,
    );

  const pageSizes =
    limits.pageSizes?.filter(
      (
        value,
      ) =>
        Number.isSafeInteger(
          value,
        ) &&
        value > 0,
    );

  if (
    pageSizes &&
    pageSizes.length > 0
  ) {
    if (
      pageSizes.includes(
        pageSize,
      )
    ) {
      return pageSize;
    }

    return pageSizes.includes(
      configuredDefault,
    )
      ? configuredDefault
      : pageSizes[0]!;
  }

  const maxPageSize =
    resolvePositiveSafeInteger(
      limits.maxPageSize,
      200,
    );

  return (
    Number.isSafeInteger(
      pageSize,
    ) &&
    pageSize > 0
  )
    ? Math.min(
        pageSize,
        maxPageSize,
      )
    : Math.min(
        configuredDefault,
        maxPageSize,
      );
}

/**
 * Convert TanStack's zero-based pagination state into a conventional
 * one-based API request.
 *
 * This is also the last generic safety boundary before an offset-pagination
 * request crosses into a transport adapter. It therefore contains unsafe
 * programmatic state even when that state did not originate from a URL.
 */
export function createDataTableOffsetPaginationRequest(
  query:
    Pick<
      DataTableServerQueryState,
      "pagination"
    >,
  limits:
    DataTableOffsetPaginationLimits = {},
): DataTableOffsetPaginationRequest {
  const maxPage =
    resolvePositiveSafeInteger(
      limits.maxPage,
      100_000,
    );

  const requestedPage =
    query.pagination.pageIndex +
    1;

  const page =
    Number.isSafeInteger(
      requestedPage,
    ) &&
    requestedPage > 0
      ? Math.min(
          requestedPage,
          maxPage,
        )
      : 1;

  return {
    page,
    pageSize:
      resolveAllowedPageSize(
        query.pagination.pageSize,
        limits,
      ),
  };
}
