import { createDataTableServerQueryMapper } from "./createDataTableServerQueryMapper";

describe("createDataTableServerQueryMapper", () => {
  const adapter = createDataTableServerQueryMapper({
    globalSearchFields: ["name", "description"],
  });

  it("trims the semantic global-search term", () => {
    const result = adapter.createRequest({
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      sorting: [],
      columnFilters: [],
      globalFilter: "  Save  ",
    });

    expect(result.search).toEqual({
      term: "Save",

      fields: ["name", "description"],
    });
  });

  it("omits search for a whitespace-only global filter", () => {
    const result = adapter.createRequest({
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      sorting: [],
      columnFilters: [],
      globalFilter: "     ",
    });

    expect(result.search).toBeUndefined();
  });

  it("omits search when no global-search fields are configured", () => {
    const withoutSearchFields = createDataTableServerQueryMapper({});

    const result = withoutSearchFields.createRequest({
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      sorting: [],
      columnFilters: [],
      globalFilter: "Save",
    });

    expect(result.search).toBeUndefined();
  });
});
