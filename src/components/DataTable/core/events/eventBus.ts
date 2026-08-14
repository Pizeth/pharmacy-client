import type { EventArguments, EventBus, EventListener } from "./types";

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
  [K in keyof TEvents]?: Set<EventListener<TEvents[K]>>;
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
    // listener: Listener<TEvents[K]>,
    listener: EventListener<TEvents[K]>,
  ): () => void {
    // const bucket = this.getListeners(event);

    // bucket.add(listener);

    // /**
    //  * Return an unsubscribe function.
    //  *
    //  * Capturing the bucket directly means we don't need
    //  * another lookup when unsubscribing.
    //  */
    // return () => {
    //   bucket?.delete(listener);
    // };

    // let eventListeners = this.listeners[event];
    //  if (!eventListeners) {
    //    eventListeners = new Set<EventListener<TEvents[K]>>();

    //    this.listeners[event] = eventListeners;
    //  }
    const eventListeners = this.getListeners(event);

    eventListeners.add(listener);

    /**
     * Return an unsubscribe function.
     *
     * Capturing the eventListeners directly means we don't need
     * another lookup when unsubscribing.
     */
    return () => {
      eventListeners.delete(listener);

      if (eventListeners.size === 0) {
        delete this.listeners[event];
      }
    };
  }

  /**
   * Emit an event.
   */
  // emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
  //   const bucket = this.listeners[event];

  //   if (!bucket) {
  //     return;
  //   }

  //   for (const listener of bucket) {
  //     listener(payload);
  //   }
  // }
  emit<K extends keyof TEvents>(
    event: K,
    ...args: EventArguments<TEvents[K]>
  ): void {
    // const bucket = this.listeners[event];

    // if (!bucket) {
    //   return;
    // }

    // /**
    //  * Runtime argument representation.
    //  *
    //  * For void events args[0] is undefined.
    //  */
    // const payload = args[0] as TEvents[K];

    // for (const listener of bucket) {
    //   listener(payload);
    // }

    const eventListeners = this.listeners[event];

    if (!eventListeners) {
      return;
    }

    /**
     * A void event arrives here as an empty tuple.
     *
     * Reading args[0] therefore yields undefined, which is the
     * runtime representation of void.
     *
     * For payload events args[0] is TEvents[K].
     *
     * Generic tuple correlation cannot be recovered by
     * TypeScript inside the implementation, so keep the
     * assertion at this runtime boundary.
     */
    const payload = args[0] as TEvents[K];

    /**
     * Copy before iteration so listeners may safely unsubscribe
     * themselves while an event is being emitted.
     */
    const snapshot = Array.from(eventListeners);

    for (const listener of snapshot) {
      listener(payload);
    }
  }

  /**
   * Remove every registered listener.
   */
  clear(): void {
    /**
     * Reflect.ownKeys preserves symbol event names.
     */
    const keys = Reflect.ownKeys(this.listeners) as Array<keyof TEvents>;

    for (const key of keys) {
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
  ): Set<EventListener<TEvents[K]>> {
    let bucket = this.listeners[event];

    if (!bucket) {
      bucket = new Set<EventListener<TEvents[K]>>();

      this.listeners[event] = bucket;
    }

    return bucket;
  }
}
