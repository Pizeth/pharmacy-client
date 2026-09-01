// src/components/DataTable/adapters/standard-api/query/createStandardApiDataTableQueryAdapter.ts

import type { DataTableServerQueryAdapter } from "../../../mui/server-data";
import type {
  DataTableSemanticServerQueryAdapter,
  DataTableServerFilterDescriptor,
  DataTableServerSemanticQuery,
  DataTableServerSortDescriptor,
} from "../../../mui/server-query";
import type {
  StandardApiDataTableFilter,
  StandardApiDataTableQueryRequest,
  StandardApiDataTableSort,
} from "./types";

/**
 * Convert one semantic sorting descriptor into the public Standard API
 * wire representation.
 *
 * Keeping this conversion explicit prevents the HTTP contract from
 * being silently coupled to our internal semantic-query types.
 */
function createStandardApiSort(
  sort: DataTableServerSortDescriptor,
): StandardApiDataTableSort {
  return {
    field: sort.field,
    direction: sort.direction,
  };
}

/**
 * Convert one internal semantic filter into the Standard API wire
 * representation.
 *
 * The switch is deliberately exhaustive over the currently supported
 * operator family.
 */
function createStandardApiFilter(
  filter: DataTableServerFilterDescriptor,
): StandardApiDataTableFilter {
  switch (filter.operator) {
    case "equals":
      return {
        field: filter.field,
        operator: "equals",
        value: filter.value,
      };

    case "contains":
      return {
        field: filter.field,
        operator: "contains",
        value: filter.value,
      };

    case "gte":
      return {
        field: filter.field,
        operator: "gte",
        value: filter.value,
      };

    case "lte":
      return {
        field: filter.field,
        operator: "lte",
        value: filter.value,
      };

    case "in":
      return {
        field: filter.field,
        operator: "in",
        value: [...filter.value],
      };
  }
}

/**
 * Convert our backend-independent semantic DataTable query into the
 * application's Standard API request contract.
 *
 * The semantic layer contains:
 *
 *   pagination
 *   sorting
 *   filters
 *   search.term
 *   search.fields
 *
 * Important security boundary:
 *
 * semanticQuery.search.fields
 *
 * is deliberately NOT copied to the HTTP request.
 *
 * Searchable fields remain server-owned policy.
 */
export function createStandardApiDataTableQueryRequest(
  semanticQuery: DataTableServerSemanticQuery,
): StandardApiDataTableQueryRequest {
  const baseRequest = {
    page: semanticQuery.pagination.page,
    pageSize: semanticQuery.pagination.pageSize,

    /**
     * Copy arrays instead of returning the semantic query's readonly
     * array references directly.
     *
     * This produces a clean plain request object at the transport
     * boundary.
     */
    sorting: semanticQuery.sorting.map(createStandardApiSort),

    filters: semanticQuery.filters.map(createStandardApiFilter),

    // search: semanticQuery.search
    //   ? {
    //       term: semanticQuery.search.term,
    //     }
    //   : undefined,
  } satisfies Omit<StandardApiDataTableQueryRequest, "search">;

  /**
   * Avoid serializing:
   *
   *   search: undefined
   *
   * The property simply does not exist when no global search is active.
   */
  if (!semanticQuery.search) {
    return baseRequest;
  }

  return {
    ...baseRequest,

    search: {
      term: semanticQuery.search.term,
    },
  };
}

/**
 * Compose a resource semantic-query adapter with the Standard API
 * transport adapter.
 *
 * Result:
 *
 *   DataTableServerQueryState
 *
 *       ↓ resource semantic mapper
 *
 *   DataTableServerSemanticQuery
 *
 *       ↓ Standard API wire mapper
 *
 *   StandardApiDataTableQueryRequest
 *
 *
 * This allows application code to create one reusable request adapter
 * for a resource rather than manually invoking both transformations
 * every time.
 */
export function createStandardApiDataTableQueryAdapter(
  semanticAdapter: DataTableSemanticServerQueryAdapter,
): DataTableServerQueryAdapter<StandardApiDataTableQueryRequest> {
  return {
    createRequest: (query) => {
      const semanticQuery = semanticAdapter.createRequest(query);
      return createStandardApiDataTableQueryRequest(semanticQuery);
    },
  };
}
