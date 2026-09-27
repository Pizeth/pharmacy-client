import {
  createDataTableLiveEvent,
} from "./createDataTableLiveEvent";
import {
  createDataTableLiveEventDeduplicator,
} from "./createDataTableLiveEventDeduplicator";

interface Row {
  readonly id: number;
}

describe("createDataTableLiveEventDeduplicator", () => {
  it("rejects duplicate resource/event identities", () => {
    const deduplicator =
      createDataTableLiveEventDeduplicator();

    const event = createDataTableLiveEvent<Row>({
      type: "deleted",
      eventId: "evt-1",
      resource: "documents",
      recordId: 1,
    });

    expect(deduplicator.accept(event)).toBe(true);
    expect(deduplicator.accept(event)).toBe(false);
    expect(deduplicator.size()).toBe(1);
  });

  it("keeps identical event IDs isolated by resource", () => {
    const deduplicator =
      createDataTableLiveEventDeduplicator();

    expect(
      deduplicator.accept(
        createDataTableLiveEvent<Row>({
          type: "deleted",
          eventId: "evt-1",
          resource: "documents",
          recordId: 1,
        }),
      ),
    ).toBe(true);

    expect(
      deduplicator.accept(
        createDataTableLiveEvent<Row>({
          type: "deleted",
          eventId: "evt-1",
          resource: "translationKeys",
          recordId: 1,
        }),
      ),
    ).toBe(true);
  });

  it("evicts oldest keys from a bounded history", () => {
    const deduplicator =
      createDataTableLiveEventDeduplicator({
        maxEntries: 2,
      });

    const event = (eventId: string) =>
      createDataTableLiveEvent<Row>({
        type: "invalidate",
        eventId,
        resource: "documents",
      });

    expect(deduplicator.accept(event("1"))).toBe(true);
    expect(deduplicator.accept(event("2"))).toBe(true);
    expect(deduplicator.accept(event("3"))).toBe(true);

    expect(deduplicator.size()).toBe(2);

    /**
     * Event 1 was evicted and may be accepted again.
     */
    expect(deduplicator.accept(event("1"))).toBe(true);
  });

  it("clears event history only at an explicit session boundary", () => {
    const deduplicator =
      createDataTableLiveEventDeduplicator();

    const event = createDataTableLiveEvent<Row>({
      type: "invalidate",
      eventId: "evt-1",
      resource: "documents",
    });

    expect(deduplicator.accept(event)).toBe(true);

    deduplicator.clear();

    expect(deduplicator.size()).toBe(0);
    expect(deduplicator.accept(event)).toBe(true);
  });

  it("rejects invalid history bounds", () => {
    expect(() =>
      createDataTableLiveEventDeduplicator({
        maxEntries: 0,
      }),
    ).toThrow(
      "DataTable live deduplication maxEntries must be a positive integer.",
    );
  });
});
