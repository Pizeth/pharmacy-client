/**
 * Event keys are restricted to
 * valid object keys.
 *
 * Valid event key.
 *
 * PropertyKey =
 *
 *   string | number | symbol
 */
export type EventKey = PropertyKey;

// /**
//  * Event map constraint.
//  *
//  * Every event key maps to a payload object.
//  */
// export type EventMap = Record<EventKey, object>;

/**
 * Strongly typed Event Bus contract.
 *
 * TEvents represents the relationship:
 *
 *   event key -> event payload
 *
 * Example:
 *
 * type TableEvents = {
 *   rowSelected: {
 *     id: number;
 *   };
 *
 *   sortingChanged: {
 *     columnId: string;
 *     direction: "asc" | "desc";
 *   };
 * };
 *
 * Then:
 *
 * events.on("rowSelected", payload => ...)
 *
 * receives:
 *
 * {
 *   id: number;
 * }
 */
export interface EventBus<TEvents extends object> {
  /**
   * Subscribe to an event.
   *
   * Returns an unsubscribe function.
   */
  on<K extends keyof TEvents>(
    event: K,
    listener: (payload: TEvents[K]) => void,
  ): () => void;

  /**
   * Emit an event.
   *
   * The event key determines the required payload type.
   */
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void;

  /**
   * Remove all listeners.
   */
  clear(): void;
}
