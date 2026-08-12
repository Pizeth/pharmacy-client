import { EventBusImpl } from "./eventBus";

import type { EventBus } from "./types";

export function createEventBus<TEvents extends object>(): EventBus<TEvents> {
  return new EventBusImpl<TEvents>();
}
