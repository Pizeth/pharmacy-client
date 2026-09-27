// src/features/documents/testing/documentFixtureLiveProvider.ts

import type {
  LiveEvent,
  LiveProvider,
} from "@refinedev/core";

type SubscriptionOptions =
  Parameters<LiveProvider["subscribe"]>[0];

/**
 * In-memory Refine LiveProvider used by the Document realtime acceptance proof.
 *
 * It models provider subscription/unsubscription and event replay without
 * pretending to be a production WebSocket/SSE transport.
 */
export interface DocumentFixtureLiveProviderController {
  readonly liveProvider: LiveProvider;
  readonly publish: (event: LiveEvent) => void;
  readonly activeSubscriptionCount: () => number;
  readonly subscribeCount: () => number;
}

export function createDocumentFixtureLiveProvider():
  DocumentFixtureLiveProviderController {
  let nextSubscriptionId = 1;
  let totalSubscriptions = 0;

  const subscriptions =
    new Map<number, SubscriptionOptions>();

  const publish = (event: LiveEvent): void => {
    for (
      const subscription of subscriptions.values()
    ) {
      const typeMatches =
        subscription.types.includes("*") ||
        subscription.types.includes(event.type);

      if (
        subscription.channel === event.channel &&
        typeMatches
      ) {
        subscription.callback(event);
      }
    }
  };

  const liveProvider: LiveProvider = {
    subscribe(options) {
      const id = nextSubscriptionId;
      nextSubscriptionId += 1;
      totalSubscriptions += 1;

      subscriptions.set(id, options);

      return id;
    },

    unsubscribe(subscription) {
      if (typeof subscription === "number") {
        subscriptions.delete(subscription);
      }
    },

    publish,
  };

  return {
    liveProvider,
    publish,
    activeSubscriptionCount: () =>
      subscriptions.size,
    subscribeCount: () =>
      totalSubscriptions,
  };
}
