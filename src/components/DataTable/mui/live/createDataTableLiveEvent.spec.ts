import {
  createDataTableLiveEvent,
  getDataTableLiveEventDeduplicationKey,
} from "./createDataTableLiveEvent";

interface Row {
  readonly id: number;
  readonly name: string;
}

describe("DataTable live-event contract", () => {
  it("normalizes transport identities without leaking transport semantics", () => {
    const event = createDataTableLiveEvent<Row>({
      type: "updated",
      eventId: 101,
      resource: " documents ",
      recordId: 42,
      record: {
        id: 42,
        name: "Updated",
      },
      revision: 7,
      occurredAt: "2026-09-27T11:00:00.000Z",
    });

    expect(event).toEqual({
      type: "updated",
      eventId: "101",
      resource: "documents",
      recordId: "42",
      record: {
        id: 42,
        name: "Updated",
      },
      revision: 7,
      occurredAt: "2026-09-27T11:00:00.000Z",
    });

    expect(
      getDataTableLiveEventDeduplicationKey(event),
    ).toBe("documents:101");
  });

  it("supports resource-wide invalidation without a record payload", () => {
    expect(
      createDataTableLiveEvent<Row>({
        type: "invalidate",
        eventId: "evt-1",
        resource: "documents",
      }),
    ).toEqual({
      type: "invalidate",
      eventId: "evt-1",
      resource: "documents",
    });
  });

  it.each(["created", "updated", "deleted"] as const)(
    "requires record identity for %s events",
    (type) => {
      expect(() =>
        createDataTableLiveEvent<Row>({
          type,
          eventId: "evt-1",
          resource: "documents",
        }),
      ).toThrow(
        `DataTable live ${type} event requires recordId.`,
      );
    },
  );

  it("rejects blank stable identities at the transport boundary", () => {
    expect(() =>
      createDataTableLiveEvent<Row>({
        type: "invalidate",
        eventId: " ",
        resource: "documents",
      }),
    ).toThrow("DataTable live eventId must not be empty.");

    expect(() =>
      createDataTableLiveEvent<Row>({
        type: "deleted",
        eventId: "evt-1",
        resource: " ",
        recordId: 1,
      }),
    ).toThrow("DataTable live resource must not be empty.");
  });
});
