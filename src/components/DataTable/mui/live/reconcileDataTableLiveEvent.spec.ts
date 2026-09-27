import type {
  DataTableServerQueryState,
} from "../server-state";
import type {
  DataTableServerResult,
} from "../server-data";

import {
  createDataTableLiveEvent,
} from "./createDataTableLiveEvent";
import {
  reconcileDataTableLiveEvent,
} from "./reconcileDataTableLiveEvent";

interface Row {
  readonly id: number;
  readonly name: string;
  readonly status: "active" | "inactive";
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

function createResult(
  rows: Row[] = [
    {
      id: 1,
      name: "Alpha",
      status: "active",
    },
    {
      id: 2,
      name: "Beta",
      status: "active",
    },
  ],
): DataTableServerResult<Row> {
  return {
    rows,
    pagination: {
      pageIndex: 0,
      pageSize: 2,
      rowCount: 5,
      pageCount: 3,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  };
}

const getRowId = (row: Row): number => row.id;

describe("reconcileDataTableLiveEvent", () => {
  it("refetches when there is no canonical current result", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
      record: {
        id: 1,
        name: "Updated Alpha",
        status: "active",
      },
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result: undefined,
        event,
        getRowId,
        canReconcileUpdatedRecord: () => true,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "no-current-result",
    });
  });

  it("always refetches explicit invalidation events", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "invalidate",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result: createResult(),
        event,
        getRowId,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "invalidate-event",
    });
  });

  it("conservatively refetches created rows because membership and totals can change", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "created",
      eventId: "evt-1",
      resource: "documents",
      recordId: 3,
      record: {
        id: 3,
        name: "Gamma",
        status: "active",
      },
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result: createResult(),
        event,
        getRowId,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "created-event-affects-membership-or-pagination",
    });
  });

  it("conservatively refetches deleted rows because page fill and totals can change", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "deleted",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result: createResult(),
        event,
        getRowId,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "deleted-event-affects-membership-or-pagination",
    });
  });

  it("refetches an identity-only updated event", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result: createResult(),
        event,
        getRowId,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "missing-updated-record-payload",
    });
  });

  it("refetches when payload identity disagrees with the event envelope", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
      record: {
        id: 2,
        name: "Wrong identity",
        status: "active",
      },
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result: createResult(),
        event,
        getRowId,
        canReconcileUpdatedRecord: () => true,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "payload-record-id-mismatch",
    });
  });

  it("refetches when the updated row is not on the current page", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: 99,
      record: {
        id: 99,
        name: "Could now enter the page",
        status: "active",
      },
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result: createResult(),
        event,
        getRowId,
        canReconcileUpdatedRecord: () => true,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "record-not-on-current-page",
    });
  });

  it("refetches when the current page contains duplicate stable IDs", () => {
    const result = createResult([
      {
        id: 1,
        name: "Alpha",
        status: "active",
      },
      {
        id: 1,
        name: "Duplicate Alpha",
        status: "active",
      },
    ]);

    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
      record: {
        id: 1,
        name: "Updated Alpha",
        status: "active",
      },
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result,
        event,
        getRowId,
        canReconcileUpdatedRecord: () => true,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "duplicate-record-id-on-current-page",
    });
  });

  it("requires an explicit resource proof even for a visible updated row", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
      record: {
        id: 1,
        name: "Updated Alpha",
        status: "active",
      },
    });

    expect(
      reconcileDataTableLiveEvent({
        query,
        result: createResult(),
        event,
        getRowId,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "updated-record-stability-unproven",
    });
  });

  it("refetches when the resource proof cannot guarantee query/order stability", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
      record: {
        id: 1,
        name: "Updated Alpha",
        status: "inactive",
      },
    });

    const proof = jest.fn(() => false);

    const result = createResult();

    expect(
      reconcileDataTableLiveEvent({
        query,
        result,
        event,
        getRowId,
        canReconcileUpdatedRecord: proof,
      }),
    ).toEqual({
      strategy: "refetch",
      reason: "updated-record-stability-unproven",
    });

    expect(proof).toHaveBeenCalledWith({
      event,
      query,
      result,
      currentRow: result.rows[0],
      nextRow: event.record,
      rowIndex: 0,
    });
  });

  it("replaces exactly one visible row when the resource proves stability", () => {
    const result = createResult();

    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
      record: {
        id: 1,
        name: "Updated Alpha",
        status: "active",
      },
    });

    const decision = reconcileDataTableLiveEvent({
      query,
      result,
      event,
      getRowId,
      canReconcileUpdatedRecord: ({
        currentRow,
        nextRow,
      }) =>
        currentRow.status === nextRow.status,
    });

    expect(decision.strategy).toBe("reconcile");

    if (decision.strategy !== "reconcile") {
      throw new Error("Expected local reconciliation.");
    }

    expect(decision.reason).toBe(
      "updated-record-stability-proven",
    );
    expect(decision.recordId).toBe("1");
    expect(decision.rowIndex).toBe(0);

    expect(decision.result.rows).toEqual([
      {
        id: 1,
        name: "Updated Alpha",
        status: "active",
      },
      result.rows[1],
    ]);

    /**
     * Local reconciliation is immutable.
     */
    expect(decision.result).not.toBe(result);
    expect(decision.result.rows).not.toBe(result.rows);
    expect(result.rows[0].name).toBe("Alpha");

    /**
     * Pagination metadata remains exact and unchanged because the proof asserted
     * that membership/order/totals are stable.
     */
    expect(decision.result.pagination).toBe(
      result.pagination,
    );
  });

  it("normalizes numeric row IDs before comparing them with live event IDs", () => {
    const result = createResult();

    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: "2",
      record: {
        id: 2,
        name: "Updated Beta",
        status: "active",
      },
    });

    const decision = reconcileDataTableLiveEvent({
      query,
      result,
      event,
      getRowId,
      canReconcileUpdatedRecord: () => true,
    });

    expect(decision.strategy).toBe("reconcile");

    if (decision.strategy !== "reconcile") {
      throw new Error("Expected local reconciliation.");
    }

    expect(decision.rowIndex).toBe(1);
    expect(decision.result.rows[1].name).toBe(
      "Updated Beta",
    );
  });

  it("does not invoke the resource proof for event kinds that cannot be patched locally", () => {
    const proof = jest.fn(() => true);

    const event = createDataTableLiveEvent<Row>({
      type: "deleted",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
    });

    reconcileDataTableLiveEvent({
      query,
      result: createResult(),
      event,
      getRowId,
      canReconcileUpdatedRecord: proof,
    });

    expect(proof).not.toHaveBeenCalled();
  });
});
