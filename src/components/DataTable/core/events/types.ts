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

/**
 * Listener associated with a single event payload type.
 */
export type EventListener<TPayload> = (payload: TPayload) => void;

/**
 * Convert an event payload into its emit argument tuple.
 *
 * Void events:
 *
 *   events.emit("refreshed")
 *
 * Payload events:
 *
 *   events.emit(
 *     "rowOpened",
 *     { rowId: "123" },
 *   )
 */
export type EventArguments<TPayload> = [TPayload] extends [void]
  ? []
  : [payload: TPayload];

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
    listener: EventListener<TEvents[K]>,
  ): () => void;

  /**
   * Emit an event.
   *
   * The event key determines the required payload type.
   */
  // emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void;
  emit<K extends keyof TEvents>(
    event: K,
    ...args: EventArguments<TEvents[K]>
  ): void;

  /**
   * Remove all listeners.
   */
  clear(): void;
}
