import { act, renderHook, waitFor } from "@testing-library/react";

import type { DataTableServerResult } from "@/components/DataTable";

import type { TranslationKey } from "../schemas";

import { useTranslationKeyDataTable } from "./useTranslationKeyDataTable";
import { useTranslationKeyDataTableRequest } from "./useTranslationKeyDataTableRequest";
import { useTranslationKeyFilterOptions } from "./useTranslationKeyFilterOptions";

jest.mock("./useTranslationKeyDataTableRequest", () => ({
  useTranslationKeyDataTableRequest: jest.fn(),
}));

jest.mock("./useTranslationKeyFilterOptions", () => ({
  useTranslationKeyFilterOptions: jest.fn(),
}));

const requestHook = useTranslationKeyDataTableRequest as jest.MockedFunction<
  typeof useTranslationKeyDataTableRequest
>;

const filterOptionsHook = useTranslationKeyFilterOptions as jest.MockedFunction<
  typeof useTranslationKeyFilterOptions
>;

const refresh = jest.fn();
const refreshFilterOptions = jest.fn();

const record: TranslationKey = {
  id: 31,
  key: "detail_panel_test",
  description: "Detail panel fixture",
  categoryId: 1,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  translationCategory: {
    id: 1,
    name: "common",
    description: null,
  },
  translations: [
    {
      id: 301,
      keyId: 31,
      locale: "en",
      value: "Detail value",
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    },
  ],
};

function createResult(
  rows: TranslationKey[],
): DataTableServerResult<TranslationKey> {
  return {
    rows,
    pagination: {
      pageIndex: 0,
      pageSize: 25,
      rowCount: 60,
      pageCount: 3,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  };
}

let currentResult = createResult([record]);

beforeEach(() => {
  jest.resetAllMocks();

  currentResult = createResult([record]);

  requestHook.mockImplementation(() => ({
    result: currentResult,
    loading: false,
    fetching: false,
    error: undefined,
    refresh,
  }));

  filterOptionsHook.mockReturnValue({
    categoryOptions: [
      {
        label: "common",
        value: 1,
      },
    ],
    localeOptions: [
      {
        label: "English",
        value: "en",
      },
      {
        label: "Khmer",
        value: "km",
      },
    ],
    loading: false,
    fetching: false,
    error: undefined,
    refresh: refreshFilterOptions,
  });
});

describe("TranslationKey DataTable expansion continuity", () => {
  it("preserves an expanded row when the same server query result is replaced", () => {
    const { result, rerender } = renderHook(() =>
      useTranslationKeyDataTable({
        enableTranslationDetails: true,
      }),
    );

    act(() => {
      result.current.table.setExpanded({
        [String(record.id)]: true,
      });
    });

    expect(result.current.table.state.expanded).toEqual({
      [String(record.id)]: true,
    });

    currentResult = createResult([
      {
        ...record,
        translations: [
          ...record.translations,
          {
            id: 302,
            keyId: record.id,
            locale: "km",
            value: "Khmer detail value",
            createdAt: "2026-09-24T00:00:00.000Z",
            updatedAt: "2026-09-24T00:00:00.000Z",
          },
        ],
      },
    ]);

    rerender();

    expect(result.current.table.state.expanded).toEqual({
      [String(record.id)]: true,
    });
  });

  it("resets expansion when the semantic table query changes", async () => {
    const { result } = renderHook(() =>
      useTranslationKeyDataTable({
        enableTranslationDetails: true,
      }),
    );

    const expandRecord = () => {
      act(() => {
        result.current.table.setExpanded({
          [String(record.id)]: true,
        });
      });

      expect(result.current.table.state.expanded).toEqual({
        [String(record.id)]: true,
      });
    };

    expandRecord();

    act(() => {
      result.current.query.onGlobalFilterChange("auth");
    });

    await waitFor(() => {
      expect(result.current.table.state.expanded).toEqual({});
    });

    expandRecord();

    act(() => {
      result.current.query.onColumnFiltersChange([
        {
          id: "category",
          value: 1,
        },
      ]);
    });

    await waitFor(() => {
      expect(result.current.table.state.expanded).toEqual({});
    });

    expandRecord();

    act(() => {
      result.current.query.onSortingChange([
        {
          id: "key",
          desc: true,
        },
      ]);
    });

    await waitFor(() => {
      expect(result.current.table.state.expanded).toEqual({});
    });

    expandRecord();

    act(() => {
      result.current.query.onPaginationChange((previous) => ({
        ...previous,
        pageSize: 10,
      }));
    });

    await waitFor(() => {
      expect(result.current.table.state.expanded).toEqual({});
    });
  });
});
