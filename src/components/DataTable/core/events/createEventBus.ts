import { EventBusImpl } from "./eventBus";

import type { EventBus, EventMap } from "./types";

export function createEventBus<TEvents extends EventMap>(): EventBus<TEvents> {
  return new EventBusImpl<TEvents>();
}

type TableEvents = {
  rowSelected: {
    id: number;
  };

  sortingChanged: {
    columnId: string;
    direction: "asc" | "desc";
  };
};

const events = createEventBus<TableEvents>();
const unsubscribe = events.on("rowSelected", (event) => {
  event.id;
});

console.log("unsubscribe", unsubscribe);
