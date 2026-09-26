import { adaptRefineGetListResponse } from "./adaptRefineGetListResponse";

type Row = {
  readonly id: number;
  readonly name: string;
};

describe("adaptRefineGetListResponse", () => {
  it("normalizes Refine data and total using the active DataTable page", () => {
    const result = adaptRefineGetListResponse<Row>(
      {
        data: [
          {
            id: 51,
            name: "Alpha",
          },
          {
            id: 52,
            name: "Bravo",
          },
        ],
        total: 53,
      },
      {
        pagination: {
          pageIndex: 2,
          pageSize: 25,
        },
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      },
    );

    expect(result).toEqual({
      rows: [
        {
          id: 51,
          name: "Alpha",
        },
        {
          id: 52,
          name: "Bravo",
        },
      ],

      pagination: {
        pageIndex: 2,
        pageSize: 25,
        rowCount: 53,
        pageCount: 3,
        hasPreviousPage: true,
        hasNextPage: false,
      },
    });
  });

  it("derives first-page navigation metadata", () => {
    const result = adaptRefineGetListResponse<Row>(
      {
        data: [
          {
            id: 1,
            name: "Alpha",
          },
        ],
        total: 26,
      },
      {
        pagination: {
          pageIndex: 0,
          pageSize: 25,
        },
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      },
    );

    expect(result.pagination).toEqual({
      pageIndex: 0,
      pageSize: 25,
      rowCount: 26,
      pageCount: 2,
      hasPreviousPage: false,
      hasNextPage: true,
    });
  });

  it("returns zero pages for an empty Refine result", () => {
    const result = adaptRefineGetListResponse<Row>(
      {
        data: [],
        total: 0,
      },
      {
        pagination: {
          pageIndex: 0,
          pageSize: 25,
        },
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      },
    );

    expect(result.pagination).toEqual({
      pageIndex: 0,
      pageSize: 25,
      rowCount: 0,
      pageCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });
});
