import type {
  DataProvider,
  LiveEvent,
  LiveProvider,
} from "@refinedev/core";
import {
  Refine,
} from "@refinedev/core";
import {
  act,
  renderHook,
} from "@testing-library/react";
import type { ReactNode } from "react";

import type {
  DataTableLiveEvent,
} from "../../../mui/live";
import {
  useRefineDataTableLiveSubscription,
} from "./useRefineDataTableLiveSubscription";

interface Row {
  readonly id: number;
  readonly name: string;
}

function createUnsupportedProvider(): DataProvider {
  const unsupported = async (): Promise<never> => {
    throw new Error(
      "Unexpected data-provider operation in live subscription test.",
    );
  };

  return {
    getList: unsupported as DataProvider["getList"],
    getOne: unsupported as DataProvider["getOne"],
    create: unsupported as DataProvider["create"],
    update: unsupported as DataProvider["update"],
    deleteOne: unsupported as DataProvider["deleteOne"],
    getApiUrl: () => "https://example.test",
  };
}

describe("useRefineDataTableLiveSubscription", () => {
  it("subscribes through Refine but emits only the normalized generic event", () => {
    let subscriptionCallback:
      | ((event: LiveEvent) => void)
      | undefined;

    const subscribe = jest.fn<
      ReturnType<LiveProvider["subscribe"]>,
      Parameters<LiveProvider["subscribe"]>
    >((options) => {
      subscriptionCallback = options.callback;

      return "subscription-id";
    });

    const unsubscribe = jest.fn();

    const liveProvider: LiveProvider = {
      subscribe,
      unsubscribe,
    };

    const onEvent = jest.fn<
      void,
      [DataTableLiveEvent<Row>, LiveEvent]
    >();

    function Wrapper(
      props: {
        readonly children: ReactNode;
      },
    ) {
      return (
        <Refine
          dataProvider={createUnsupportedProvider()}
          liveProvider={liveProvider}
          options={{
            disableTelemetry: true,
          }}
        >
          {props.children}
        </Refine>
      );
    }

    const { unmount } = renderHook(
      () =>
        useRefineDataTableLiveSubscription<Row>({
          adapter: {
            resource: "documents",
            getEventId: (event) =>
              event.payload.eventId as string,
            getRecordId: (event) =>
              event.payload.id as number,
            readRecord: (event) =>
              event.payload.record as Row,
          },
          onEvent,
        }),
      {
        wrapper: Wrapper,
      },
    );

    expect(subscribe).toHaveBeenCalledTimes(1);

    expect(subscribe).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: "resources/documents",
        types: ["*"],
        params: expect.objectContaining({
          resource: "documents",
          subscriptionType: "useList",
        }),
      }),
    );

    const rawEvent: LiveEvent = {
      channel: "resources/documents",
      type: "updated",
      payload: {
        eventId: "evt-9",
        id: 9,
        record: {
          id: 9,
          name: "Nine",
        },
      },
      date: new Date(
        "2026-09-27T12:30:00.000Z",
      ),
    };

    act(() => {
      subscriptionCallback?.(rawEvent);
    });

    expect(onEvent).toHaveBeenCalledWith(
      {
        type: "updated",
        eventId: "evt-9",
        resource: "documents",
        recordId: "9",
        record: {
          id: 9,
          name: "Nine",
        },
        occurredAt:
          "2026-09-27T12:30:00.000Z",
      },
      rawEvent,
    );

    unmount();

    expect(unsubscribe).toHaveBeenCalledWith(
      "subscription-id",
    );
  });

  it("does not subscribe when disabled", () => {
    const subscribe = jest.fn();
    const unsubscribe = jest.fn();

    const liveProvider: LiveProvider = {
      subscribe,
      unsubscribe,
    };

    function Wrapper(
      props: {
        readonly children: ReactNode;
      },
    ) {
      return (
        <Refine
          dataProvider={createUnsupportedProvider()}
          liveProvider={liveProvider}
          options={{
            disableTelemetry: true,
          }}
        >
          {props.children}
        </Refine>
      );
    }

    renderHook(
      () =>
        useRefineDataTableLiveSubscription<Row>({
          adapter: {
            resource: "documents",
            getEventId: () => "evt-1",
            getRecordId: () => 1,
          },
          enabled: false,
          onEvent: jest.fn(),
        }),
      {
        wrapper: Wrapper,
      },
    );

    expect(subscribe).not.toHaveBeenCalled();
  });
});
