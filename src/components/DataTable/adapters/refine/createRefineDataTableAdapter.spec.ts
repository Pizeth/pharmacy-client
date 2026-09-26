import {
  createDataTableServerQueryMapper,
  createDataTableTextServerFilter,
} from "../../mui/server-query";
import { createRefineDataTableAdapter } from "./createRefineDataTableAdapter";

type Row = {
  readonly id: number;
  readonly name: string;
};

describe("createRefineDataTableAdapter", () => {
  it("composes semantic request mapping and Refine response normalization", () => {
    const adapter = createRefineDataTableAdapter<Row>({
      semanticAdapter: createDataTableServerQueryMapper({
        sorting: {
          name: "name",
        },
        filtering: {
          name: createDataTableTextServerFilter("name"),
        },
      }),

      resource: "users",
    });

    const query = {
      pagination: {
        pageIndex: 1,
        pageSize: 10,
      },
      sorting: [
        {
          id: "name",
          desc: false,
        },
      ],
      columnFilters: [
        {
          id: "name",
          value: "alpha",
        },
      ],
      globalFilter: "",
    } as const;

    expect(adapter.createRequest(query)).toEqual({
      resource: "users",
      pagination: {
        currentPage: 2,
        pageSize: 10,
        mode: "server",
      },
      sorters: [
        {
          field: "name",
          order: "asc",
        },
      ],
      filters: [
        {
          field: "name",
          operator: "contains",
          value: "alpha",
        },
      ],
    });

    expect(
      adapter.readResponse(
        {
          data: [
            {
              id: 11,
              name: "Alpha",
            },
          ],
          total: 11,
        },
        query,
      ),
    ).toEqual({
      rows: [
        {
          id: 11,
          name: "Alpha",
        },
      ],
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        rowCount: 11,
        pageCount: 2,
        hasPreviousPage: true,
        hasNextPage: false,
      },
    });
  });
});
