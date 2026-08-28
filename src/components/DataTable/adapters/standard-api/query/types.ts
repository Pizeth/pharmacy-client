// src/components/DataTable/adapters/standard-api/query/types.ts

import type {
  DataTableServerFilterDescriptor,
  DataTableServerSortDescriptor,
} from "../../../mui/server-query";

/**
 * Sort descriptor sent over the application's Standard API wire
 * protocol.
 *
 * The field is a PUBLIC API field/key.
 *
 * It must still be validated and mapped again by NestJS before being
 * used with Prisma.
 */
export type StandardApiDataTableSort = DataTableServerSortDescriptor;

/**
 * Filter descriptor sent over the application's Standard API wire
 * protocol.
 */
export type StandardApiDataTableFilter = DataTableServerFilterDescriptor;

/**
 * Global-search wire representation.
 *
 * Searchable fields are deliberately NOT sent by the browser.
 *
 * The NestJS resource decides which server/database fields participate
 * in global search.
 */
export interface StandardApiDataTableSearch {
  readonly term: string;
}

/**
 * Actual request contract sent to a server endpoint.
 *
 * Pagination is one-based because that matches the current DBHelper
 * API:
 *
 *   page = 1
 *   pageSize = 100
 *
 * rather than TanStack:
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
