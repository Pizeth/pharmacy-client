import type { EventBus } from "./types";

/**
 * Listener associated with a single event payload type.
 */
type Listener<TPayload> = (payload: TPayload) => void;

// type ListenerMap<TEvents extends object> = {
//   [K in keyof TEvents]?: Set<Listener<TEvents[K]>>;
// };

/**
 * Strongly typed listener storage.
 *
 * For:
 *
 * type Events = {
 *   selected: SelectedEvent;
 *   sorted: SortedEvent;
 * }
 *
 * this becomes approximately:
 *
 * {
 *   selected?: Set<Listener<SelectedEvent>>;
 *   sorted?: Set<Listener<SortedEvent>>;
 * }
 *
 * This preserves the relationship:
 *
 *   event key -> listener payload
 */
type ListenerMap<TEvents extends object> = {
  [K in keyof TEvents]?: Set<Listener<TEvents[K]>>;
};

/**
 * Runtime implementation of the strongly typed EventBus.
 */
export class EventBusImpl<TEvents extends object> implements EventBus<TEvents> {
  /**
   * Listener storage.
   */
  private readonly listeners: ListenerMap<TEvents> = {};

  /**
   * Subscribe to an event.
   */
  on<K extends keyof TEvents>(
    event: K,
    listener: Listener<TEvents[K]>,
  ): () => void {
    const bucket = this.getListeners(event);

    bucket.add(listener);

    /**
     * Return an unsubscribe function.
     *
     * Capturing the bucket directly means we don't need
     * another lookup when unsubscribing.
     */
    return () => {
      bucket?.delete(listener);
    };
  }

  /**
   * Emit an event.
   */
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const bucket = this.listeners[event];

    if (!bucket) {
      return;
    }

    for (const listener of bucket) {
      listener(payload);
    }
  }

  /**
   * Remove every registered listener.
   */
  clear(): void {
    // this.listeners.clear();
    // for (const key of Object.keys(this.listeners)) {
    //   delete this.listeners[key as keyof TEvents];
    // }

    for (const key of Reflect.ownKeys(this.listeners) as Array<keyof TEvents>) {
      delete this.listeners[key];
    }
  }

  /**
   * Return the listener bucket for an event.
   *
   * The bucket is created lazily when the first listener
   * subscribes.
   */
  private getListeners<K extends keyof TEvents>(
    event: K,
  ): Set<Listener<TEvents[K]>> {
    let bucket = this.listeners[event];

    if (!bucket) {
      bucket = new Set<Listener<TEvents[K]>>();

      this.listeners[event] = bucket;
    }

    return bucket;
  }
}
