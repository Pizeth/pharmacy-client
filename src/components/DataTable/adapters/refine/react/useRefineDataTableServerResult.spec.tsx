import type {
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import { Refine } from "@refinedev/core";
import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";

import {
  createDataTableServerQueryMapper,
} from "../../../mui/server-query";
import type {
  DataTableServerQueryState,
} from "../../../mui/server-state";
import {
  createRefineDataTableAdapter,
} from "../createRefineDataTableAdapter";
import {
  useRefineDataTableServerResult,
} from "./useRefineDataTableServerResult";

type Row = {
  readonly id: number;
  readonly name: string;
};

const semanticAdapter = createDataTableServerQueryMapper({
  sorting: {
    name: "name",
  },
});

const adapter = createRefineDataTableAdapter<Row>({
  semanticAdapter,
  resource: "users",
});

function createQuery(
  pageIndex = 0,
): DataTableServerQueryState {
  return {
    pagination: {
      pageIndex,
      pageSize: 2,
    },
    sorting: [],
    columnFilters: [],
    globalFilter: "",
  };
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

/**
 * Refine requires a complete DataProvider shape even though this acceptance
 * fixture exercises only getList().
 *
 * Unused mutation/read methods intentionally throw so an accidental lifecycle
 * dependency becomes visible immediately instead of silently succeeding.
 */
function createProvider(
  getList: (
    params: GetListParams,
  ) => Promise<GetListResponse<Row>>,
): DataProvider {
  const unsupported = async (): Promise<never> => {
    throw new Error(
      "Unexpected Refine data-provider operation in DataTable list test.",
    );
  };

  return {
    getList: getList as DataProvider["getList"],
    getOne: unsupported as DataProvider["getOne"],
    create: unsupported as DataProvider["create"],
    update: unsupported as DataProvider["update"],
    deleteOne: unsupported as DataProvider["deleteOne"],
    getApiUrl: () => "https://example.test",
  };
}

function createWrapper(
  provider: DataProvider,
) {
  return function Wrapper(
    props: {
      readonly children: ReactNode;
    },
  ) {
    return (
      <Refine
        dataProvider={provider}
        options={{
          disableTelemetry: true,
        }}
      >
        {props.children}
      </Refine>
    );
  };
}

describe("useRefineDataTableServerResult", () => {
  it("executes the adapted Refine list request and normalizes the result", async () => {
    const getList = jest.fn(
      async (
        params: GetListParams,
      ): Promise<GetListResponse<Row>> => {
        expect(params).toMatchObject({
          resource: "users",
          pagination: {
            currentPage: 1,
            pageSize: 2,
            mode: "server",
          },
          sorters: [],
          filters: [],
        });

        return {
          data: [
            {
              id: 1,
              name: "Alpha",
            },
            {
              id: 2,
              name: "Bravo",
            },
          ],
          total: 3,
        };
      },
    );

    const provider = createProvider(getList);

    const { result } = renderHook(
      () =>
        useRefineDataTableServerResult<Row>({
          query: createQuery(),
          adapter,
          queryOptions: {
            retry: false,
          },
        }),
      {
        wrapper: createWrapper(provider),
      },
    );

    await waitFor(() => {
      expect(result.current.server.hasResult).toBe(true);
    });

    expect(getList).toHaveBeenCalledTimes(1);

    expect(result.current.server.rows).toEqual([
      {
        id: 1,
        name: "Alpha",
      },
      {
        id: 2,
        name: "Bravo",
      },
    ]);

    expect(result.current.server.pagination).toEqual({
      pageIndex: 0,
      pageSize: 2,
      rowCount: 3,
      pageCount: 2,
      hasNextPage: true,
      hasPreviousPage: false,
    });

    expect(result.current.server.isInitialLoading).toBe(false);
    expect(result.current.server.isRefreshing).toBe(false);
  });

  it("delegates refresh to Refine without changing DataTable query state", async () => {
    const getList = jest.fn(
      async (): Promise<GetListResponse<Row>> => ({
        data: [
          {
            id: 1,
            name: "Alpha",
          },
        ],
        total: 1,
      }),
    );

    const provider = createProvider(getList);

    const query = createQuery();

    const { result } = renderHook(
      () =>
        useRefineDataTableServerResult<Row>({
          query,
          adapter,
          queryOptions: {
            retry: false,
          },
        }),
      {
        wrapper: createWrapper(provider),
      },
    );

    await waitFor(() => {
      expect(getList).toHaveBeenCalledTimes(1);
    });

    act(() => {
      result.current.request.refresh();
    });

    await waitFor(() => {
      expect(getList).toHaveBeenCalledTimes(2);
    });

    expect(result.current.server.pagination.pageIndex).toBe(0);
  });

  it("preserves the previous normalized result while a replacement Refine query is pending", async () => {
    const secondPage = createDeferred<GetListResponse<Row>>();

    const getList = jest.fn(
      async (
        params: GetListParams,
      ): Promise<GetListResponse<Row>> => {
        const currentPage =
          params.pagination?.currentPage ?? 1;

        if (currentPage === 1) {
          return {
            data: [
              {
                id: 1,
                name: "Alpha",
              },
              {
                id: 2,
                name: "Bravo",
              },
            ],
            total: 4,
          };
        }

        return secondPage.promise;
      },
    );

    const provider = createProvider(getList);

    const { result, rerender } = renderHook(
      (
        props: {
          readonly query: DataTableServerQueryState;
        },
      ) =>
        useRefineDataTableServerResult<Row>({
          query: props.query,
          adapter,
          queryOptions: {
            retry: false,
          },
        }),
      {
        initialProps: {
          query: createQuery(0),
        },
        wrapper: createWrapper(provider),
      },
    );

    await waitFor(() => {
      expect(result.current.server.rows).toHaveLength(2);
    });

    rerender({
      query: createQuery(1),
    });

    await waitFor(() => {
      expect(getList).toHaveBeenCalledTimes(2);
    });

    /**
     * The new Refine query has no canonical page-2 result yet.
     *
     * DataTable therefore keeps the successful page-1 result through its own
     * generic lifecycle rather than relying on Refine/React Query placeholder
     * semantics.
     */
    expect(result.current.server.isPreviousResult).toBe(true);
    expect(result.current.server.isRefreshing).toBe(true);
    expect(result.current.server.rows.map((row) => row.id)).toEqual([1, 2]);
    expect(result.current.server.pagination.pageIndex).toBe(0);

    await act(async () => {
      secondPage.resolve({
        data: [
          {
            id: 3,
            name: "Charlie",
          },
          {
            id: 4,
            name: "Delta",
          },
        ],
        total: 4,
      });

      await secondPage.promise;
    });

    await waitFor(() => {
      expect(result.current.server.isPreviousResult).toBe(false);
    });

    expect(result.current.server.rows.map((row) => row.id)).toEqual([3, 4]);
    expect(result.current.server.pagination.pageIndex).toBe(1);
  });

  it("keeps replacement failures non-blocking when a previous result exists", async () => {
    const replacement = createDeferred<GetListResponse<Row>>();

    const getList = jest.fn(
      async (
        params: GetListParams,
      ): Promise<GetListResponse<Row>> => {
        const currentPage =
          params.pagination?.currentPage ?? 1;

        if (currentPage === 1) {
          return {
            data: [
              {
                id: 1,
                name: "Alpha",
              },
            ],
            total: 3,
          };
        }

        return replacement.promise;
      },
    );

    const provider = createProvider(getList);

    const { result, rerender } = renderHook(
      (
        props: {
          readonly query: DataTableServerQueryState;
        },
      ) =>
        useRefineDataTableServerResult<Row>({
          query: props.query,
          adapter,
          queryOptions: {
            retry: false,
          },
        }),
      {
        initialProps: {
          query: createQuery(0),
        },
        wrapper: createWrapper(provider),
      },
    );

    await waitFor(() => {
      expect(result.current.server.hasResult).toBe(true);
    });

    rerender({
      query: createQuery(1),
    });

    await waitFor(() => {
      expect(getList).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      replacement.reject(
        Object.assign(
          new Error("Replacement failed"),
          {
            statusCode: 503,
          },
        ),
      );

      try {
        await replacement.promise;
      } catch {
        // The hook owns the rejected query. This await only settles the
        // test-controlled deferred promise.
      }
    });

    await waitFor(() => {
      expect(result.current.server.refreshError).toBeTruthy();
    });

    expect(result.current.server.blockingError).toBeUndefined();
    expect(result.current.server.rows.map((row) => row.id)).toEqual([1]);
  });
});
