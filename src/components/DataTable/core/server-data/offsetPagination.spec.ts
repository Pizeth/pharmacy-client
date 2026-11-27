import {
  createDataTableOffsetPaginationRequest,
} from "./offsetPagination";

describe(
  "createDataTableOffsetPaginationRequest",
  () => {
    it(
      "passes safe pagination through unchanged",
      () => {
        expect(
          createDataTableOffsetPaginationRequest({
            pagination: {
              pageIndex:
                2,
              pageSize:
                50,
            },
          }),
        ).toEqual({
          page:
            3,
          pageSize:
            50,
        });
      },
    );

    it(
      "contains unsafe programmatic pagination before transport",
      () => {
        expect(
          createDataTableOffsetPaginationRequest({
            pagination: {
              pageIndex:
                Number.MAX_SAFE_INTEGER,
              pageSize:
                1_000_000,
            },
          }),
        ).toEqual({
          page:
            1,
          pageSize:
            200,
        });
      },
    );

    it(
      "honors an exact resource page-size allow-list",
      () => {
        expect(
          createDataTableOffsetPaginationRequest(
            {
              pagination: {
                pageIndex:
                  4,
                pageSize:
                  999,
              },
            },
            {
              pageSizes: [
                10,
                25,
                50,
              ],
              defaultPageSize:
                25,
              maxPage:
                3,
            },
          ),
        ).toEqual({
          page:
            3,
          pageSize:
            25,
        });
      },
    );
  },
);
