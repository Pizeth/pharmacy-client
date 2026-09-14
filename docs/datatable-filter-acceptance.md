# Phase 1.7.10.6B.6 — Acceptance evidence

## Result

Core live filter interactions passed on `http://localhost:8080/admin/i18n` after
the user signed in. Automated validation passed 73 tests across 13 suites, and
the full typecheck (including feature synchronization) passed.

This is not a claim that every browser acceptance case is complete. Slow/failed
Category-option requests and retry were not induced in the live browser. The
available browser-control surface does not provide request throttling or
interception. Those scenarios have automated component/hook coverage; their live
browser acceptance remains pending. No authentication bypass or production
failure switch was added.

## Live browser observations

| Scenario | Observed result |
| --- | --- |
| Navigate to protected resource | Redirected to login; user signed in; table loaded |
| Initial table | Filters hidden, empty search, page 1 of 2 |
| Next page | Page 2 of 2 displayed |
| Show filters | Category and Locale editors became available |
| Category options | All, auth, common, navigation, profile, translation, validation |
| Category auth from page 2 | Page reset to 1; settled result contained auth rows; one active filter |
| Add Locale Khmer | Two active filters, Category auth and Locale Khmer retained |
| Search login with both filters | Settled result was auth_login, page 1 of 1 |
| Hide filter row | Two active filters and search remained active |
| Clear-all while hidden | Filter status removed; search remained login |
| Reopen row | Category and Locale selections empty |
| Clear search | Search input empty |
| Category common, then All | Category cleared and active-filter status removed |
| Settled final result | auth_email visible again, page 1 of 2 |
| Restore presentation | Row hidden; empty search and no column filters |

A screenshot was visually inspected with the filter row open. Physical RTL,
sticky scrolling, and pinning were not systematically exercised in this browser
pass; their state/style contracts have automated coverage from 6B.3.

## Request-contract integration tests

Added `translationKeyFilterAcceptance.spec.tsx`. These tests connect the real
feature-bound TanStack table, `useDataTableServerState`, resource column factory,
and `translationKeyStandardQueryAdapter.createRequest`.

The first test starts on zero-based page 3, then updates Category, Locale, and
global search in one React act. It checks that updates are not lost and that the
API request is:

```json
{
  "page": 1,
  "pageSize": 25,
  "sorting": [],
  "filters": [
    { "field": "categoryId", "operator": "equals", "value": 2 },
    { "field": "locale", "operator": "equals", "value": "km" }
  ],
  "search": { "term": "Save" }
}
```

It then advances the page and clears Category, verifying another page reset with
Locale and search preserved. The second test verifies that clear-all resets the
page but keeps search, and that clearing search removes it from the request.

These are request-object assertions, not captured HTTP traffic. The live browser
results independently confirm successful real-data interactions; exact wire
payload inspection was not performed.

## Remaining live acceptance

1. Delay only the Category-option request, open the filter row, and verify loading
   feedback and disabled Category while Locale remains usable.
2. Fail only that request, verify the error and independent table operation, then
   use the existing Retry action and verify recovery.
3. Repeat while a Category value is active and its menu is open; verify value
   preservation and menu closure.
4. Verify sticky/pinned filter geometry while scrolling, including RTL if used.

No application data was created, edited, or deleted during this acceptance pass.

## Full added test source

```tsx
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

```
