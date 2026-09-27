import type {
  LiveEvent,
} from "@refinedev/core";

import {
  adaptRefineDataTableLiveEvent,
  mapDefaultRefineDataTableLiveEventType,
} from "./adaptRefineDataTableLiveEvent";
import type {
  RefineDataTableLiveEventAdapter,
} from "./types";

interface Row {
  readonly id: number;
  readonly name: string;
}

function createRefineEvent(
  overrides: Partial<LiveEvent> = {},
): LiveEvent {
  return {
    channel: "resources/documents",
    type: "updated",
    payload: {
      eventId: "evt-1",
      id: 7,
      record: {
        id: 7,
        name: "Updated",
      },
    },
    date: new Date("2026-09-27T12:00:00.000Z"),
    ...overrides,
  };
}

const adapter: RefineDataTableLiveEventAdapter<Row> = {
  resource: "documents",
  getEventId: (event) =>
    event.payload.eventId as string,
  getRecordId: (event) =>
    event.payload.id as number | undefined,
  readRecord: (event) =>
    event.payload.record as Row | undefined,
};

describe("Refine DataTable live bridge", () => {
  it.each([
    "created",
    "updated",
    "deleted",
  ] as const)(
    "maps the standard Refine %s event type",
    (type) => {
      expect(
        mapDefaultRefineDataTableLiveEventType(
          createRefineEvent({ type }),
        ),
      ).toBe(type);
    },
  );

  it("ignores non-standard provider event names by default", () => {
    expect(
      mapDefaultRefineDataTableLiveEventType(
        createRefineEvent({
          type: "provider.custom",
        }),
      ),
    ).toBeUndefined();

    expect(
      adaptRefineDataTableLiveEvent({
        adapter,
        event: createRefineEvent({
          type: "provider.custom",
        }),
      }),
    ).toBeUndefined();
  });

  it("normalizes a Refine updated event into the generic contract", () => {
    expect(
      adaptRefineDataTableLiveEvent({
        adapter,
        event: createRefineEvent(),
      }),
    ).toEqual({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: "7",
      record: {
        id: 7,
        name: "Updated",
      },
      occurredAt: "2026-09-27T12:00:00.000Z",
    });
  });

  it("keeps identity-only updates valid when no row decoder is supplied", () => {
    const identityOnlyAdapter: RefineDataTableLiveEventAdapter<Row> = {
      resource: "documents",
      getEventId: (event) =>
        event.payload.eventId as string,
      getRecordId: (event) =>
        event.payload.id as number | undefined,
    };

    expect(
      adaptRefineDataTableLiveEvent({
        adapter: identityOnlyAdapter,
        event: createRefineEvent(),
      }),
    ).toEqual({
      type: "updated",
      eventId: "evt-1",
      resource: "documents",
      recordId: "7",
      occurredAt: "2026-09-27T12:00:00.000Z",
    });
  });

  it("supports provider-specific event names without redefining generic semantics", () => {
    const customAdapter: RefineDataTableLiveEventAdapter<Row> = {
      ...adapter,
      mapType: (event) =>
        event.type === "sync.invalidated"
          ? "invalidate"
          : undefined,
    };

    expect(
      adaptRefineDataTableLiveEvent({
        adapter: customAdapter,
        event: createRefineEvent({
          type: "sync.invalidated",
        }),
      }),
    ).toEqual({
      type: "invalidate",
      eventId: "evt-1",
      resource: "documents",
      recordId: "7",
      occurredAt: "2026-09-27T12:00:00.000Z",
    });
  });

  it("carries an explicit provider revision as a generic ordering hint", () => {
    const revisionAdapter: RefineDataTableLiveEventAdapter<Row> = {
      ...adapter,
      getRevision: (event) =>
        event.payload.version as number,
    };

    expect(
      adaptRefineDataTableLiveEvent({
        adapter: revisionAdapter,
        event: createRefineEvent({
          payload: {
            eventId: "evt-2",
            id: 7,
            version: 14,
            record: {
              id: 7,
              name: "Updated",
            },
          },
        }),
      }),
    ).toMatchObject({
      eventId: "evt-2",
      revision: 14,
    });
  });

  it("rejects recognized create/update/delete events when a provider fails to expose record identity", () => {
    const invalidAdapter: RefineDataTableLiveEventAdapter<Row> = {
      resource: "documents",
      getEventId: () => "evt-1",
      getRecordId: () => undefined,
    };

    expect(() =>
      adaptRefineDataTableLiveEvent({
        adapter: invalidAdapter,
        event: createRefineEvent({
          type: "deleted",
        }),
      }),
    ).toThrow(
      "DataTable live deleted event requires recordId.",
    );
  });
});
