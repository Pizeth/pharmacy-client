import {
  createDataTableNumberRangeServerFilter,
  createDataTableSelectServerFilter,
  createDataTableServerQueryMapper,
  createDataTableTextServerFilter,
} from "../../mui/server-query";
import {
  createRefineDataTableQueryAdapter,
  createRefineOrContainsSearchFilters,
} from "./createRefineDataTableQueryAdapter";

const semanticAdapter = createDataTableServerQueryMapper({
  sorting: {
    name: "name",
    createdAt: "createdAt",
  },

  filtering: {
    name: createDataTableTextServerFilter("name"),
    status: createDataTableSelectServerFilter("status"),
    score: createDataTableNumberRangeServerFilter("score"),
  },

  globalSearchFields: ["name", "description"],
});

describe("createRefineDataTableQueryAdapter", () => {
  it("maps DataTable query state into Refine GetListParams", () => {
    const adapter = createRefineDataTableQueryAdapter(
      semanticAdapter,
      {
        resource: "documents",
        dataProviderName: "primary",
        meta: {
          include: ["owner"],
        },
        createSearchFilters: createRefineOrContainsSearchFilters,
      },
    );

    const request = adapter.createRequest({
      pagination: {
        pageIndex: 2,
        pageSize: 25,
      },

      sorting: [
        {
          id: "createdAt",
          desc: true,
        },
        {
          id: "name",
          desc: false,
        },
      ],

      columnFilters: [
        {
          id: "name",
          value: "  report  ",
        },
        {
          id: "status",
          value: "open",
        },
        {
          id: "score",
          value: [10, 20],
        },
      ],

      globalFilter: "  urgent  ",
    });

    expect(request).toEqual({
      resource: "documents",

      pagination: {
        currentPage: 3,
        pageSize: 25,
        mode: "server",
      },

      sorters: [
        {
          field: "createdAt",
          order: "desc",
        },
        {
          field: "name",
          order: "asc",
        },
      ],

      filters: [
        {
          field: "name",
          operator: "contains",
          value: "report",
        },
        {
          field: "status",
          operator: "eq",
          value: "open",
        },
        {
          field: "score",
          operator: "gte",
          value: 10,
        },
        {
          field: "score",
          operator: "lte",
          value: 20,
        },
        {
          operator: "or",
          value: [
            {
              field: "name",
              operator: "contains",
              value: "urgent",
            },
            {
              field: "description",
              operator: "contains",
              value: "urgent",
            },
          ],
        },
      ],

      dataProviderName: "primary",

      meta: {
        include: ["owner"],
      },
    });
  });

  it("omits optional Refine properties when they are not configured", () => {
    const adapter = createRefineDataTableQueryAdapter(
      createDataTableServerQueryMapper({
        sorting: {
          name: "name",
        },
      }),
      {
        resource: "documents",
      },
    );

    const request = adapter.createRequest({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      sorting: [],
      columnFilters: [],
      globalFilter: "",
    });

    expect(request).toEqual({
      resource: "documents",
      pagination: {
        currentPage: 1,
        pageSize: 10,
        mode: "server",
      },
      sorters: [],
      filters: [],
    });

    expect(request).not.toHaveProperty("dataProviderName");
    expect(request).not.toHaveProperty("meta");
  });

  it("fails loudly when global search would otherwise be silently dropped", () => {
    const adapter = createRefineDataTableQueryAdapter(
      semanticAdapter,
      {
        resource: "documents",
      },
    );

    expect(() =>
      adapter.createRequest({
        pagination: {
          pageIndex: 0,
          pageSize: 25,
        },
        sorting: [],
        columnFilters: [],
        globalFilter: "login",
      }),
    ).toThrow(
      'DataTable Refine adapter for resource "documents" received global search',
    );
  });

  it("can explicitly ignore semantic global search when a provider does not support it", () => {
    const adapter = createRefineDataTableQueryAdapter(
      semanticAdapter,
      {
        resource: "documents",
        unsupportedSearchPolicy: "ignore",
      },
    );

    expect(
      adapter.createRequest({
        pagination: {
          pageIndex: 0,
          pageSize: 25,
        },
        sorting: [],
        columnFilters: [],
        globalFilter: "login",
      }),
    ).toEqual({
      resource: "documents",
      pagination: {
        currentPage: 1,
        pageSize: 25,
        mode: "server",
      },
      sorters: [],
      filters: [],
    });
  });
});
