import { EventBusImpl } from "./eventBus";
import type { EventBus } from "./types";

/**
 * Create a strongly typed EventBus.
 */ export function createEventBus<
  TEvents extends object,
>(): EventBus<TEvents> {
  return new EventBusImpl<TEvents>();
}
