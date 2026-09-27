import {
  act,
  renderHook,
} from "@testing-library/react";

import type {
  DataTableServerQueryState,
} from "../server-state";
import type {
  DataTableServerResultLifecycle,
} from "../server-data";
import {
  createDataTableLiveEvent,
} from "./createDataTableLiveEvent";
import {
  useDataTableLiveServerResult,
} from "./useDataTableLiveServerResult";

interface Row {
  readonly id: number;
  readonly name: string;
}

const query: DataTableServerQueryState = {
  pagination: {
    pageIndex: 0,
    pageSize: 2,
  },
  sorting: [],
  columnFilters: [],
  globalFilter: "",
};

function server(
  rows: Row[] = [
    { id: 1, name: "Alpha" },
    { id: 2, name: "Beta" },
  ],
): DataTableServerResultLifecycle<Row> {
  return {
    rows,
    pagination: {
      pageIndex: 0,
      pageSize: 2,
      rowCount: 2,
      pageCount: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    hasResult: true,
    isPreviousResult: false,
    hasRows: rows.length > 0,
    isEmpty: rows.length === 0,
    isInitialLoading: false,
    isFetching: false,
    isRefreshing: false,
    error: undefined,
    blockingError: undefined,
    refreshError: undefined,
  };
}

describe("useDataTableLiveServerResult", () => {
  it("applies a proven update locally without refetching", () => {
    const refresh = jest.fn();
    const initialServer = server();

    const { result } = renderHook(() =>
      useDataTableLiveServerResult({
        resource: "documents",
        query,
        server: initialServer,
        refresh,
        getRowId: (row: Row) => row.id,
        canReconcileUpdatedRecord: () => true,
      }),
    );

    act(() => {
      expect(
        result.current.handleEvent(
          createDataTableLiveEvent<Row>({
            type: "updated",
            eventId: "evt-1",
            resource: "documents",
            recordId: 1,
            record: {
              id: 1,
              name: "Updated",
            },
          }),
        ).status,
      ).toBe("reconciled");
    });

    expect(
      result.current.server.rows[0],
    ).toEqual({
      id: 1,
      name: "Updated",
    });

    expect(refresh).not.toHaveBeenCalled();
  });

  it("executes one refetch for a duplicate-delivered invalidation", () => {
    const refresh = jest.fn();

    const { result } = renderHook(() =>
      useDataTableLiveServerResult({
        resource: "documents",
        query,
        server: server(),
        refresh,
        getRowId: (row: Row) => row.id,
      }),
    );

    const event = createDataTableLiveEvent<Row>({
      type: "invalidate",
      eventId: "evt-1",
      resource: "documents",
    });

    let first:
      | ReturnType<typeof result.current.handleEvent>
      | undefined;
    let second:
      | ReturnType<typeof result.current.handleEvent>
      | undefined;

    act(() => {
      first = result.current.handleEvent(event);
      second = result.current.handleEvent(event);
    });

    expect(first?.status).toBe("refetch");
    expect(second).toEqual({
      status: "ignored",
      reason: "duplicate-event",
    });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("ignores events routed to another resource", () => {
    const refresh = jest.fn();

    const { result } = renderHook(() =>
      useDataTableLiveServerResult({
        resource: "documents",
        query,
        server: server(),
        refresh,
        getRowId: (row: Row) => row.id,
      }),
    );

    expect(
      result.current.handleEvent(
        createDataTableLiveEvent<Row>({
          type: "invalidate",
          eventId: "evt-1",
          resource: "other",
        }),
      ),
    ).toEqual({
      status: "ignored",
      reason: "resource-mismatch",
    });

    expect(refresh).not.toHaveBeenCalled();
  });

  it("drops a local overlay when canonical server rows are replaced", () => {
    const refresh = jest.fn();
    const initialServer = server();

    const { result, rerender } = renderHook(
      (
        props: {
          readonly server:
            DataTableServerResultLifecycle<Row>;
        },
      ) =>
        useDataTableLiveServerResult({
          resource: "documents",
          query,
          server: props.server,
          refresh,
          getRowId: (row: Row) => row.id,
          canReconcileUpdatedRecord: () => true,
        }),
      {
        initialProps: {
          server: initialServer,
        },
      },
    );

    act(() => {
      result.current.handleEvent(
        createDataTableLiveEvent<Row>({
          type: "updated",
          eventId: "evt-1",
          resource: "documents",
          recordId: 1,
          record: {
            id: 1,
            name: "Live",
          },
        }),
      );
    });

    expect(
      result.current.server.rows[0].name,
    ).toBe("Live");

    rerender({
      server: server([
        { id: 1, name: "Canonical" },
        { id: 2, name: "Beta" },
      ]),
    });

    expect(
      result.current.server.rows[0].name,
    ).toBe("Canonical");
  });
});
