import type {
  DataProvider,
  LiveEvent,
  LiveProvider,
} from "@refinedev/core";
import { Refine } from "@refinedev/core";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";

import { DOCUMENT_COLUMN_IDS } from "../types";
import {
  createDocumentFixtureDataProvider,
  createDocumentFixtureLiveProvider,
  createDocumentFixtureRows,
} from "../testing";
import { useDocumentDataTable } from "./useDocumentDataTable";

function createWrapper(
  provider: DataProvider,
  liveProvider?: LiveProvider,
) {
  const theme = createTheme();

  return function Wrapper(
    props: {
      readonly children: ReactNode;
    },
  ) {
    return (
      <ThemeProvider theme={theme}>
        <Refine
          dataProvider={provider}
          liveProvider={liveProvider}
          options={{
            disableTelemetry: true,
          }}
        >
          {props.children}
        </Refine>
      </ThemeProvider>
    );
  };
}

describe("useDocumentDataTable", () => {
  it("executes the Document Refine lifecycle through the generic server binding", async () => {
    const provider = createDocumentFixtureDataProvider(
      createDocumentFixtureRows(60),
    );

    const { result } = renderHook(
      () =>
        useDocumentDataTable({
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

    expect(result.current.server.rows).toHaveLength(25);
    expect(result.current.server.pagination).toEqual({
      pageIndex: 0,
      pageSize: 25,
      rowCount: 60,
      pageCount: 3,
      hasNextPage: true,
      hasPreviousPage: false,
    });

    expect(result.current.table.options.manualPagination).toBe(true);
    expect(result.current.table.options.manualSorting).toBe(true);
    expect(result.current.table.options.manualFiltering).toBe(true);

    act(() => {
      result.current.query.onPaginationChange((previous) => ({
        ...previous,
        pageIndex: 1,
      }));
    });

    await waitFor(() => {
      expect(result.current.server.isPreviousResult).toBe(false);
      expect(result.current.server.pagination.pageIndex).toBe(1);
    });

    expect(result.current.server.rows[0]?.id).toBe(26);

    act(() => {
      result.current.query.onColumnFiltersChange([
        {
          id: DOCUMENT_COLUMN_IDS.status,
          value: "ប្រញ៉ាប់",
        },
      ]);
    });

    await waitFor(() => {
      expect(result.current.server.isPreviousResult).toBe(false);
      expect(
        result.current.server.rows.every(
          (row) => row.status === "ប្រញ៉ាប់",
        ),
      ).toBe(true);
    });

    expect(result.current.query.state.pagination.pageIndex).toBe(0);

    act(() => {
      result.current.query.onGlobalFilterChange("budget");
    });

    await waitFor(() => {
      expect(result.current.server.isPreviousResult).toBe(false);
      expect(
        result.current.server.rows.every((row) =>
          [row.documentNumber, row.title, row.description ?? ""]
            .join(" ")
            .toLocaleLowerCase()
            .includes("budget"),
        ),
      ).toBe(true);
    });
  });

  it("proves realtime create/update/delete, reconnect, deduplication, active search, and selected/pinned safety", async () => {
    const sourceRows =
      createDocumentFixtureRows(30);

    const baseProvider =
      createDocumentFixtureDataProvider(
        sourceRows,
      );

    const getList = jest.fn(
      baseProvider.getList,
    );

    const provider: DataProvider = {
      ...baseProvider,
      getList:
        getList as DataProvider["getList"],
    };

    const liveController =
      createDocumentFixtureLiveProvider();

    const { result, rerender } = renderHook(
      (
        props: {
          readonly liveEnabled: boolean;
        },
      ) =>
        useDocumentDataTable({
          liveEnabled: props.liveEnabled,
          queryOptions: {
            retry: false,
          },
        }),
      {
        initialProps: {
          liveEnabled: true,
        },
        wrapper: createWrapper(
          provider,
          liveController.liveProvider,
        ),
      },
    );

    await waitFor(() => {
      expect(
        result.current.server.hasResult,
      ).toBe(true);
    });

    expect(getList).toHaveBeenCalledTimes(1);
    expect(
      liveController.activeSubscriptionCount(),
    ).toBe(1);

    /**
     * ------------------------------------------------------------
     * Visible update: proven-safe local reconciliation
     * ------------------------------------------------------------
     */
    const updatedFirst = {
      ...sourceRows[0],
      title: "Document 1 live update",
    };

    sourceRows[0] = updatedFirst;

    const updateEvent: LiveEvent = {
      channel: "resources/documents",
      type: "updated",
      payload: {
        eventId: "evt-update-1",
        id: updatedFirst.id,
        record: updatedFirst,
      },
      date: new Date(
        "2026-09-27T13:00:00.000Z",
      ),
    };

    act(() => {
      liveController.publish(updateEvent);
    });

    expect(
      result.current.server.rows[0].title,
    ).toBe("Document 1 live update");

    /**
     * No server request was needed because the resource proof established that
     * no filter/search/sort/page semantics could change.
     */
    expect(getList).toHaveBeenCalledTimes(1);

    /**
     * Duplicate delivery is ignored.
     */
    act(() => {
      liveController.publish(updateEvent);
    });

    expect(getList).toHaveBeenCalledTimes(1);

    /**
     * ------------------------------------------------------------
     * Active search: same kind of update becomes ambiguous -> refetch
     * ------------------------------------------------------------
     */
    act(() => {
      result.current.query.onGlobalFilterChange(
        "budget",
      );
    });

    await waitFor(() => {
      expect(
        result.current.query.state.globalFilter,
      ).toBe("budget");

      expect(
        result.current.server.isPreviousResult,
      ).toBe(false);

      expect(
        result.current.server.rows.length,
      ).toBeGreaterThan(0);
    });

    const callsAfterSearch =
      getList.mock.calls.length;

    const visibleBudget =
      result.current.server.rows[0];

    const updatedBudget = {
      ...visibleBudget,
      description:
        "Budget live canonical update",
    };

    const sourceBudgetIndex =
      sourceRows.findIndex(
        (row) => row.id === visibleBudget.id,
      );

    sourceRows[sourceBudgetIndex] =
      updatedBudget;

    act(() => {
      liveController.publish({
        channel: "resources/documents",
        type: "updated",
        payload: {
          eventId: "evt-search-update",
          id: updatedBudget.id,
          record: updatedBudget,
        },
        date: new Date(
          "2026-09-27T13:01:00.000Z",
        ),
      });
    });

    await waitFor(() => {
      expect(
        getList.mock.calls.length,
      ).toBe(callsAfterSearch + 1);
    });

    expect(
      result.current.query.state.globalFilter,
    ).toBe("budget");

    /**
     * ------------------------------------------------------------
     * Create: membership/totals are ambiguous -> refetch
     * ------------------------------------------------------------
     */
    const callsBeforeCreate =
      getList.mock.calls.length;

    const created = {
      ...createDocumentFixtureRows(1)[0],
      id: 1001,
      documentNumber: "DOC-1001",
      title: "Budget created live",
      description: "Budget new live row",
      createdAt:
        "2026-09-27T13:02:00.000Z",
    };

    sourceRows.push(created);

    act(() => {
      liveController.publish({
        channel: "resources/documents",
        type: "created",
        payload: {
          eventId: "evt-create-1",
          id: created.id,
          record: created,
        },
        date: new Date(
          "2026-09-27T13:02:00.000Z",
        ),
      });
    });

    await waitFor(() => {
      expect(
        getList.mock.calls.length,
      ).toBe(callsBeforeCreate + 1);
    });

    /**
     * Replayed create event must not execute a second refetch.
     */
    act(() => {
      liveController.publish({
        channel: "resources/documents",
        type: "created",
        payload: {
          eventId: "evt-create-1",
          id: created.id,
          record: created,
        },
        date: new Date(
          "2026-09-27T13:02:00.000Z",
        ),
      });
    });

    expect(
      getList.mock.calls.length,
    ).toBe(callsBeforeCreate + 1);

    /**
     * ------------------------------------------------------------
     * Delete: stale selected/pinned ID is removed synchronously
     * ------------------------------------------------------------
     */
    const deleting =
      result.current.server.rows[0];

    const deletingId =
      String(deleting.id);

    act(() => {
      result.current.table.setRowSelection({
        [deletingId]: true,
      });

      result.current.table.setRowPinning({
        top: [deletingId],
        bottom: [],
      });
    });

    expect(
      result.current.table.state.rowSelection[
        deletingId
      ],
    ).toBe(true);

    expect(
      result.current.table.state.rowPinning.top,
    ).toContain(deletingId);

    const deleteSourceIndex =
      sourceRows.findIndex(
        (row) => row.id === deleting.id,
      );

    sourceRows.splice(deleteSourceIndex, 1);

    const callsBeforeDelete =
      getList.mock.calls.length;

    act(() => {
      liveController.publish({
        channel: "resources/documents",
        type: "deleted",
        payload: {
          eventId: "evt-delete-1",
          id: deleting.id,
        },
        date: new Date(
          "2026-09-27T13:03:00.000Z",
        ),
      });
    });

    expect(
      result.current.table.state.rowSelection[
        deletingId
      ],
    ).toBeUndefined();

    expect(
      result.current.table.state.rowPinning.top ??
        [],
    ).not.toContain(deletingId);

    await waitFor(() => {
      expect(
        getList.mock.calls.length,
      ).toBe(callsBeforeDelete + 1);
    });

    /**
     * ------------------------------------------------------------
     * Transport reconnect: unsubscribe/resubscribe, then invalidate
     * ------------------------------------------------------------
     */
    const subscribeCountBeforeReconnect =
      liveController.subscribeCount();

    rerender({
      liveEnabled: false,
    });

    expect(
      liveController.activeSubscriptionCount(),
    ).toBe(0);

    rerender({
      liveEnabled: true,
    });

    expect(
      liveController.activeSubscriptionCount(),
    ).toBe(1);

    expect(
      liveController.subscribeCount(),
    ).toBe(
      subscribeCountBeforeReconnect + 1,
    );

    const callsBeforeReconnect =
      getList.mock.calls.length;

    const reconnectEvent: LiveEvent = {
      channel: "resources/documents",
      type: "reconnected",
      payload: {
        eventId: "evt-reconnect-1",
      },
      date: new Date(
        "2026-09-27T13:04:00.000Z",
      ),
    };

    act(() => {
      liveController.publish(
        reconnectEvent,
      );
    });

    await waitFor(() => {
      expect(
        getList.mock.calls.length,
      ).toBe(callsBeforeReconnect + 1);
    });

    /**
     * Deduplication history survives the transport reconnect while the
     * resource controller stays mounted.
     */
    act(() => {
      liveController.publish(
        reconnectEvent,
      );
    });

    expect(
      getList.mock.calls.length,
    ).toBe(callsBeforeReconnect + 1);

    /**
     * Realtime never rewrites the active semantic server query.
     */
    expect(
      result.current.query.state.globalFilter,
    ).toBe("budget");
  });

});
