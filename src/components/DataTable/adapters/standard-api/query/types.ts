// src/components/DataTable/adapters/standard-api/query/types.ts

/**
 * Primitive values currently allowed by the DataTable Standard API
 * filtering protocol.
 *
 * Dates are intentionally not included yet.
 *
 * When the reserved date/date-range filtering variants are implemented,
 * we will define their wire representation explicitly rather than
 * sending JavaScript Date objects across the network.
 */
export type StandardApiDataTableFilterScalar = string | number | boolean;

/**
 * Sort direction understood by the Standard API.
 */
export type StandardApiDataTableSortDirection = "asc" | "desc";

/**
 * One server-side sorting descriptor
 * sent over the application's Standard API wire protocol.
 *
 * `field` is a PUBLIC API field identifier.
 *
 * It is NOT automatically a Prisma field.
 * It must still be validated and mapped again by NestJS before being
 * used with Prisma.
 */
export interface StandardApiDataTableSort {
  readonly field: string;
  readonly direction: StandardApiDataTableSortDirection;
}

/**
 * Exact equality.
 */
export interface StandardApiDataTableEqualsFilter {
  readonly field: string;
  readonly operator: "equals";
  readonly value: StandardApiDataTableFilterScalar;
}

/**
 * Text containment.
 */
export interface StandardApiDataTableContainsFilter {
  readonly field: string;
  readonly operator: "contains";
  readonly value: string;
}

/**
 * Numeric lower bound.
 */
export interface StandardApiDataTableGreaterThanOrEqualFilter {
  readonly field: string;
  readonly operator: "gte";
  readonly value: number;
}

/**
 * Numeric upper bound.
 */
export interface StandardApiDataTableLessThanOrEqualFilter {
  readonly field: string;
  readonly operator: "lte";
  readonly value: number;
}

/**
 * Membership filter.
 *
 * This will also become the natural representation for our reserved
 * multi-select filter variant.
 */
export interface StandardApiDataTableInFilter {
  readonly field: string;
  readonly operator: "in";
  readonly value: readonly StandardApiDataTableFilterScalar[];
}

/**
 * Complete filter union supported by the Standard API.
 *
 * `operator` is the discriminant.
 */
export type StandardApiDataTableFilter =
  | StandardApiDataTableEqualsFilter
  | StandardApiDataTableContainsFilter
  | StandardApiDataTableGreaterThanOrEqualFilter
  | StandardApiDataTableLessThanOrEqualFilter
  | StandardApiDataTableInFilter;

/**
 * Global-search wire representation.
 *
 * Searchable fields are deliberately NOT sent by the browser.
 *
 * The server determines which fields a resource allows global search
 * against.
 */
export interface StandardApiDataTableSearch {
  readonly term: string;
}

/**
 * Complete request body understood by the Standard API DataTable
 * endpoint.
 *
 * Pagination is one-based over HTTP:
 *
 *   page = 1
 *   pageSize = 100
 *
 * TanStack remains zero-based internally:
 *
 *   pageIndex = 0
 */
export interface StandardApiDataTableQueryRequest {
  readonly page: number;
  readonly pageSize: number;
  readonly sorting: readonly StandardApiDataTableSort[];
  readonly filters: readonly StandardApiDataTableFilter[];
  readonly search?: StandardApiDataTableSearch;
}
