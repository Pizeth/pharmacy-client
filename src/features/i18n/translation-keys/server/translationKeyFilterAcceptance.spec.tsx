import { act, renderHook } from "@testing-library/react";
import { useDataTableServerState } from "@/components/DataTable/mui/server-state";
import { useMuiDataTable } from "@/components/DataTable/mui/table";
import { createTranslationKeyColumns } from "../columns/translationKeyColumns";
import type { TranslationKey } from "../schemas";
import { TRANSLATION_KEY_COLUMN_IDS as ids } from "./translationKeyServerFields";
import { translationKeyStandardQueryAdapter } from "./translationKeyServerQueryAdapter";

const columns = createTranslationKeyColumns({
  categoryFilterOptions: [{ label: "Auth", value: 2 }],
  localeFilterOptions: [{ label: "Khmer", value: "km" }],
});
const data: TranslationKey[] = [];

function useAcceptanceTable() {
  const query = useDataTableServerState({
    defaultState: { pagination: { pageIndex: 3, pageSize: 25 } },
  });
  const table = useMuiDataTable({
    columns, data,
    state: query.state,
    onColumnFiltersChange: query.onColumnFiltersChange,
    onGlobalFilterChange: query.onGlobalFilterChange,
    onPaginationChange: query.onPaginationChange,
    manualFiltering: true,
    manualPagination: true,
    pageCount: 10,
  });
  return { table, query, request: translationKeyStandardQueryAdapter.createRequest(query.state) };
}

it("combines Category, Locale, and search without losing updates and resets pagination", () => {
  const { result } = renderHook(useAcceptanceTable);
  expect(result.current.request.page).toBe(4);
  act(() => {
    result.current.table.getColumn(ids.category)!.setFilterValue(2);
    result.current.table.getColumn(ids.locale)!.setFilterValue("km");
    result.current.table.setGlobalFilter("  Save  ");
  });
  expect(result.current.query.state.pagination.pageIndex).toBe(0);
  expect(result.current.request).toEqual({
    page: 1, pageSize: 25, sorting: [],
    filters: [
      { field: "categoryId", operator: "equals", value: 2 },
      { field: "locale", operator: "equals", value: "km" },
    ],
    search: { term: "Save" },
  });
  act(() => result.current.table.setPagination({ pageIndex: 2, pageSize: 25 }));
  expect(result.current.request.page).toBe(3);
  act(() => result.current.table.getColumn(ids.category)!.setFilterValue(undefined));
  expect(result.current.request).toMatchObject({
    page: 1,
    filters: [{ field: "locale", operator: "equals", value: "km" }],
    search: { term: "Save" },
  });
  expect(result.current.table.getColumn(ids.category)!.getIsFiltered()).toBe(false);
  expect(result.current.table.getColumn(ids.locale)!.getIsFiltered()).toBe(true);
});

it("clear-all resets pagination but preserves search; clearing search removes it from the request", () => {
  const { result } = renderHook(useAcceptanceTable);
  act(() => {
    result.current.table.getColumn(ids.category)!.setFilterValue(2);
    result.current.table.setGlobalFilter("Save");
  });
  act(() => result.current.table.setPagination({ pageIndex: 4, pageSize: 25 }));
  act(() => result.current.table.setColumnFilters([]));
  expect(result.current.request).toEqual({
    page: 1, pageSize: 25, sorting: [], filters: [], search: { term: "Save" },
  });
  act(() => result.current.table.setPagination({ pageIndex: 2, pageSize: 25 }));
  act(() => result.current.table.setGlobalFilter(""));
  expect(result.current.request).toEqual({ page: 1, pageSize: 25, sorting: [], filters: [] });
});
