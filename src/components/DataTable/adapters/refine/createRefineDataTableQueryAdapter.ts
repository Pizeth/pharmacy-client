import type {
  CrudFilter,
  CrudSort,
  GetListParams,
  LogicalFilter,
} from "@refinedev/core";

import type { DataTableServerQueryAdapter } from "../../mui/server-data";
import type {
  DataTableSemanticServerQueryAdapter,
  DataTableServerFilterDescriptor,
  DataTableServerSearchDescriptor,
  DataTableServerSortDescriptor,
} from "../../mui/server-query";
import type {
  CreateRefineDataTableQueryAdapterOptions,
  RefineDataTableSearchFilterMapper,
} from "./types";

/**
 * Convert one backend-independent semantic sort into Refine's public
 * CrudSort contract.
 */
function createRefineSort(
  sort: DataTableServerSortDescriptor,
): CrudSort {
  return {
    field: sort.field,
    order: sort.direction,
  };
}

/**
 * Convert one semantic DataTable filter into Refine's logical filter
 * representation.
 *
 * The operator translation is intentionally explicit:
 *
 *   equals   -> eq
 *   contains -> contains
 *   gte      -> gte
 *   lte      -> lte
 *   in       -> in
 *
 * No database-specific expression is created here.
 */
function createRefineFilter(
  filter: DataTableServerFilterDescriptor,
): LogicalFilter {
  switch (filter.operator) {
    case "equals":
      return {
        field: filter.field,
        operator: "eq",
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
 * Standard helper for Refine data providers that support conditional
 * OR filters.
 *
 * A semantic search:
 *
 *   term: "login"
 *   fields: ["key", "description"]
 *
 * becomes:
 *
 *   {
 *     operator: "or",
 *     value: [
 *       { field: "key", operator: "contains", value: "login" },
 *       { field: "description", operator: "contains", value: "login" },
 *     ],
 *   }
 *
 * The fields originate from the resource semantic mapper, not directly
 * from browser input.
 */
export const createRefineOrContainsSearchFilters: RefineDataTableSearchFilterMapper =
  (search: DataTableServerSearchDescriptor): readonly CrudFilter[] => {
    if (search.fields.length === 0) {
      return [];
    }

    return [
      {
        operator: "or",
        value: search.fields.map((field) => ({
          field,
          operator: "contains" as const,
          value: search.term,
        })),
      },
    ];
  };

/**
 * Convert a resource's semantic DataTable query into Refine GetListParams.
 *
 * Pipeline:
 *
 *   DataTableServerQueryState
 *              ↓
 *   resource semantic mapper
 *              ↓
 *   DataTableServerSemanticQuery
 *              ↓
 *   Refine adapter
 *              ↓
 *   GetListParams
 *
 * Refine pagination is one-based, which matches the semantic offset request:
 *
 *   TanStack pageIndex 0
 *        ↓
 *   semantic page 1
 *        ↓
 *   Refine currentPage 1
 */
export function createRefineDataTableQueryAdapter(
  semanticAdapter: DataTableSemanticServerQueryAdapter,
  options: CreateRefineDataTableQueryAdapterOptions,
): DataTableServerQueryAdapter<GetListParams> {
  const {
    resource,
    dataProviderName,
    meta,
    createSearchFilters,
    unsupportedSearchPolicy = "throw",
  } = options;

  return {
    createRequest: (query) => {
      const semanticQuery = semanticAdapter.createRequest(query);

      const filters: CrudFilter[] =
        semanticQuery.filters.map(createRefineFilter);

      if (semanticQuery.search) {
        if (createSearchFilters) {
          filters.push(...createSearchFilters(semanticQuery.search));
        } else if (unsupportedSearchPolicy === "throw") {
          throw new Error(
            [
              `DataTable Refine adapter for resource "${resource}" received global search`,
              "but no createSearchFilters mapper was configured.",
              "Provide an explicit mapper or set unsupportedSearchPolicy to \"ignore\".",
            ].join(" "),
          );
        }
      }

      return {
        resource,

        pagination: {
          currentPage: semanticQuery.pagination.page,
          pageSize: semanticQuery.pagination.pageSize,
          mode: "server",
        },

        sorters: semanticQuery.sorting.map(createRefineSort),

        filters,

        ...(dataProviderName === undefined
          ? {}
          : {
              dataProviderName,
            }),

        ...(meta === undefined
          ? {}
          : {
              meta,
            }),
      } satisfies GetListParams;
    },
  };
}
