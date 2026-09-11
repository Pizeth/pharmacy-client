import type { DataTableServerQueryState } from "@/components/DataTable";

import { translationKeyStandardQueryAdapter } from "./translationKeyServerQueryAdapter";

import { TRANSLATION_KEY_COLUMN_IDS } from "./translationKeyServerFields";

describe("TranslationKey server query adapter", () => {
  it("maps TranslationKey query state into the Standard API contract", () => {
    const query: DataTableServerQueryState = {
      pagination: {
        pageIndex: 1,
        pageSize: 25,
      },

      sorting: [
        {
          id: TRANSLATION_KEY_COLUMN_IDS.category,
          desc: true,
        },
        {
          id: TRANSLATION_KEY_COLUMN_IDS.key,
          desc: false,
        },
      ],

      columnFilters: [
        {
          id: TRANSLATION_KEY_COLUMN_IDS.key,
          value: "auth",
        },
        {
          id: TRANSLATION_KEY_COLUMN_IDS.description,
          value: "login",
        },
        {
          /**
           * Most important regression:
           *
           * Category's UI column stores the numeric category ID.
           */
          id: TRANSLATION_KEY_COLUMN_IDS.category,
          value: 2,
        },
        {
          id: TRANSLATION_KEY_COLUMN_IDS.locale,
          value: "km",
        },
      ],

      globalFilter: "  Save  ",
    };

    const request = translationKeyStandardQueryAdapter.createRequest(query);

    expect(request).toEqual({
      /**
       * TanStack pageIndex 1
       *
       * becomes API page 2.
       */
      page: 2,
      pageSize: 25,
      sorting: [
        {
          field: "category",
          direction: "desc",
        },
        {
          field: "key",
          direction: "asc",
        },
      ],

      filters: [
        {
          field: "key",
          operator: "contains",
          value: "auth",
        },
        {
          field: "description",
          operator: "contains",
          value: "login",
        },
        {
          field: "categoryId",
          operator: "equals",
          value: 2,
        },
        {
          field: "locale",
          operator: "equals",
          value: "km",
        },
      ],

      /**
       * Semantic search.fields MUST NOT cross the HTTP boundary.
       */
      search: {
        term: "Save",
      },
    });
  });

  it("does not expose the presentation-only row-number column", () => {
    const query: DataTableServerQueryState = {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },

      sorting: [],
      columnFilters: [],
      globalFilter: "",
    };

    const request = translationKeyStandardQueryAdapter.createRequest(query);

    expect(request).toEqual({
      page: 1,
      pageSize: 25,
      sorting: [],
      filters: [],
    });
  });

  it("keeps category sorting and category filtering intentionally asymmetric", () => {
    const query: DataTableServerQueryState = {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },

      sorting: [
        {
          id: TRANSLATION_KEY_COLUMN_IDS.category,
          desc: false,
        },
      ],

      columnFilters: [
        {
          id: TRANSLATION_KEY_COLUMN_IDS.category,
          value: 4,
        },
      ],

      globalFilter: "",
    };

    const request = translationKeyStandardQueryAdapter.createRequest(query);

    expect(request.sorting).toEqual([
      {
        field: "category",
        direction: "asc",
      },
    ]);

    expect(request.filters).toEqual([
      {
        field: "categoryId",
        operator: "equals",
        value: 4,
      },
    ]);
  });
});
