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

      const globalFilter = normalizeDataTableGlobalFilter(query.globalFilter);

      const search =
        globalFilter.length > 0 && globalSearchFields.length > 0
          ? {
              term: globalFilter,
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
