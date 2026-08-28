// src/components/DataTable/mui/server-query/types.ts

import type {
  DataTableOffsetPaginationRequest,
  DataTableServerQueryAdapter,
} from "../server-data";

/**
 * Scalar values supported by the generic semantic filter protocol.
 *
 * Dates can later be represented as ISO strings without coupling the
 * query layer to a particular date library.
 */
export type DataTableServerFilterScalar = string | number | boolean;

/**
 * Server-side sort direction.
 */
export type DataTableServerSortDirection = "asc" | "desc";

/**
 * Backend-independent sorting instruction.
 */
export interface DataTableServerSortDescriptor {
  /**
   * Backend/API field understood by the eventual transport adapter.
   *
   * This does NOT have to equal the TanStack column id.
   */
  readonly field: string;
  readonly direction: DataTableServerSortDirection;
}

/**
 * Exact scalar comparison.
 */
export interface DataTableServerEqualsFilter {
  readonly field: string;
  readonly operator: "equals";
  readonly value: DataTableServerFilterScalar;
}

/**
 * Text contains operation.
 */
export interface DataTableServerContainsFilter {
  readonly field: string;
  readonly operator: "contains";
  readonly value: string;
}

/**
 * Numeric lower-bound operation.
 */
export interface DataTableServerGreaterThanOrEqualFilter {
  readonly field: string;
  readonly operator: "gte";
  readonly value: number;
}

/**
 * Numeric upper-bound operation.
 */
export interface DataTableServerLessThanOrEqualFilter {
  readonly field: string;
  readonly operator: "lte";
  readonly value: number;
}

/**
 * Multi-value membership filter.
 *
 * This is useful later for the reserved multi-select variant.
 */
export interface DataTableServerInFilter {
  readonly field: string;
  readonly operator: "in";
  readonly value: readonly DataTableServerFilterScalar[];
}

/**
 * Generic semantic filter understood by DataTable's query layer.
 *
 * This deliberately does NOT contain Prisma-specific concepts.
 */
export type DataTableServerFilterDescriptor =
  | DataTableServerEqualsFilter
  | DataTableServerContainsFilter
  | DataTableServerGreaterThanOrEqualFilter
  | DataTableServerLessThanOrEqualFilter
  | DataTableServerInFilter;

/**
 * Global-search request.
 */
export interface DataTableServerSearchDescriptor {
  readonly term: string;

  /**
   * API/backend fields that participate in global search.
   */
  readonly fields: readonly string[];
}

/**
 * Complete backend-independent semantic server query.
 *
 * Offset pagination is intentionally used for the current table/server
 * implementation.
 */
export interface DataTableServerSemanticQuery {
  readonly pagination: DataTableOffsetPaginationRequest;
  readonly sorting: readonly DataTableServerSortDescriptor[];
  readonly filters: readonly DataTableServerFilterDescriptor[];
  readonly search?: DataTableServerSearchDescriptor;
}

/**
 * Filter-value boundary.
 *
 * TanStack columnFilters intentionally stores erased filter values.
 *
 * The mapper is the correct place to validate those values and turn
 * them into safe semantic descriptors.
 */
export type DataTableServerFilterMapper = (
  value: unknown,
) => readonly DataTableServerFilterDescriptor[];

/**
 * What should happen if query state references a column that has no
 * server mapping.
 *
 * "throw"
 *   Makes configuration mistakes immediately visible.
 *
 * "ignore"
 *   Useful when restoring old/persisted query state after a column was
 *   removed.
 */
export type DataTableUnknownServerColumnPolicy = "throw" | "ignore";

/**
 * Per-resource mapping configuration.
 */
export interface DataTableServerQueryMapperConfig {
  /**
   * Map TanStack column IDs to safe backend/API sorting fields.
   *
   * Example:
   *
   *   {
   *     documentTitle: "title",
   *     officeName: "office.name",
   *   }
   */
  readonly sorting?: Readonly<Record<string, string>>;

  /**
   * Map TanStack column IDs to value-aware server filter encoders.
   */
  readonly filtering?: Readonly<Record<string, DataTableServerFilterMapper>>;

  /**
   * Backend/API fields participating in global search.
   */
  readonly globalSearchFields?: readonly string[];

  /**
   * Policy for an active sorting column with no mapping.
   *
   * Default: "throw".
   */
  readonly unknownSortingColumnPolicy?: DataTableUnknownServerColumnPolicy;

  /**
   * Policy for an active column filter with no mapping.
   *
   * Default: "throw".
   */
  readonly unknownFilterColumnPolicy?: DataTableUnknownServerColumnPolicy;
}

/**
 * Strongly typed semantic query adapter.
 */
export type DataTableSemanticServerQueryAdapter =
  DataTableServerQueryAdapter<DataTableServerSemanticQuery>;
