import type {
  DataTableServerQueryState,
  DataTableServerQueryStateInput,
} from "./types";

export function createDataTableServerQueryState(
  input:
    DataTableServerQueryStateInput = {},
  defaultPageSize:
    number = 25,
): DataTableServerQueryState {
  return {
    pagination:
      input.pagination ?? {
        pageIndex:
          0,
        pageSize:
          defaultPageSize,
      },
    sorting:
      input.sorting ?? [],
    columnFilters:
      input.columnFilters ?? [],
    globalFilter:
      input.globalFilter ?? "",
  };
}
