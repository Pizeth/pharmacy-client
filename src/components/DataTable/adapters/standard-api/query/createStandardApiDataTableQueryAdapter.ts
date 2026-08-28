// src/components/DataTable/adapters/standard-api/query/createStandardApiDataTableQueryAdapter.ts

import type { DataTableServerQueryAdapter } from "../../../mui/server-data";
import type {
  DataTableSemanticServerQueryAdapter,
  DataTableServerSemanticQuery,
} from "../../../mui/server-query";
import type { StandardApiDataTableQueryRequest } from "./types";

/**
 * Convert our backend-independent semantic query into the application's
 * Standard API wire contract.
 *
 * The semantic layer contains:
 *
 *   pagination
 *   sorting
 *   filters
 *   search.term
 *   search.fields
 *
 * The Standard API deliberately strips search.fields because searchable
 * fields are server-owned policy.
 */
export function createStandardApiDataTableQueryRequest(
  query: DataTableServerSemanticQuery,
): StandardApiDataTableQueryRequest {
  return {
    page: query.pagination.page,
    pageSize: query.pagination.pageSize,

    /**
     * Copy arrays instead of returning the semantic query's readonly
     * array references directly.
     *
     * This produces a clean plain request object at the transport
     * boundary.
     */
    sorting: [...query.sorting],

    filters: [...query.filters],
    search: query.search
      ? {
          term: query.search.term,
        }
      : undefined,
  };
}

/**
 * Compose:
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
