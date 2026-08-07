/**
 * Event keys are restricted to
 * valid object keys.
 */
export type EventKey = PropertyKey;

/**
 * Event map constraint.
 *
 * Every event key maps to a payload object.
 */
export type EventMap = Record<EventKey, object>;

/**
 * Strongly typed Event Bus contract.
 */
export interface EventBus<TEvents extends EventMap> {
  /**
   * Subscribe to an event.
   */
  on<K extends keyof TEvents>(
    event: K,
    listener: (payload: TEvents[K]) => void,
  ): () => void;

  /**
   * Emit an event.
   */
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void;

  /**
   * Remove all listeners.
   */
  clear(): void;
}
