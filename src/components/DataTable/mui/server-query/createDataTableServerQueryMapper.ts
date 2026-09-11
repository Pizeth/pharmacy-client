// src/components/DataTable/mui/server-query/createDataTableServerQueryMapper.ts

import { normalizeDataTableGlobalFilter } from "../utils/globalFilter";
import { createDataTableOffsetPaginationRequest } from "../server-data";
import type { DataTableServerQueryState } from "../server-state";
import type {
  DataTableSemanticServerQueryAdapter,
  DataTableServerFilterDescriptor,
  DataTableServerQueryMapperConfig,
  DataTableServerSemanticQuery,
  DataTableServerSortDescriptor,
  DataTableUnknownServerColumnPolicy,
} from "./types";

/**
 * Handle one query-state column that has no configured server mapping.
 */
function handleUnknownColumn(
  kind: "sorting" | "filter",
  columnId: string,
  policy: DataTableUnknownServerColumnPolicy,
): void {
  if (policy === "ignore") {
    return;
  }

  throw new Error(
    `DataTable server ${kind} mapping is missing for column "${columnId}".`,
  );
}

/**
 * Create a backend-independent semantic query mapper for one resource.
 *
 * This is where UI column IDs are explicitly mapped to backend/API
 * fields.
 *
 * No Prisma objects are constructed here.
 */
export function createDataTableServerQueryMapper(
  config: DataTableServerQueryMapperConfig,
): DataTableSemanticServerQueryAdapter {
  const {
    sorting = {},
    filtering = {},
    globalSearchFields = [],
    unknownSortingColumnPolicy = "throw",
    unknownFilterColumnPolicy = "throw",
  } = config;

  return {
    createRequest: (
      query: DataTableServerQueryState,
    ): DataTableServerSemanticQuery => {
      const sortingDescriptors: DataTableServerSortDescriptor[] = [];

      for (const sort of query.sorting) {
        const field = sorting[sort.id];

        if (field === undefined) {
          handleUnknownColumn(
            "sorting",

            sort.id,

            unknownSortingColumnPolicy,
          );

          continue;
        }

        sortingDescriptors.push({
          field,

          direction: sort.desc ? "desc" : "asc",
        });
      }

      const filterDescriptors: DataTableServerFilterDescriptor[] = [];

      for (const filter of query.columnFilters) {
        const mapper = filtering[filter.id];

        if (mapper === undefined) {
          handleUnknownColumn(
            "filter",

            filter.id,

            unknownFilterColumnPolicy,
          );

          continue;
        }

        filterDescriptors.push(...mapper(filter.value));
      }

      /**
       * Normalize TanStack's broad globalFilter boundary into the textual
       * contract used by DataTable.
       *
       * Do NOT trim the value in the UI/server-state layer because that
       * state also represents what the user is actively editing.
       */
      const globalFilter = normalizeDataTableGlobalFilter(query.globalFilter);

      /**
       * The semantic server boundary is where presentation input becomes
       * request intent.
       *
       * Leading/trailing whitespace has no search meaning and should never
       * cross the transport boundary.
       *
       * This also ensures a whitespace-only value:
       *
       *   "     "
       *
       * behaves exactly like an absent search rather than producing:
       *
       *   search: {
       *     term: "     "
       *   }
       *
       * UI state may preserve whitespace while a person is typing, but the
       * outgoing semantic query should never contain meaningless surrounding
       * whitespace.
       */
      const searchTerm = globalFilter.trim();

      const search =
        searchTerm.length > 0 && globalSearchFields.length > 0
          ? {
              term: searchTerm,
              fields: globalSearchFields,
            }
          : undefined;

      return {
        pagination: createDataTableOffsetPaginationRequest(query),
        sorting: sortingDescriptors,
        filters: filterDescriptors,
        search,
      };
    },
  };
}
