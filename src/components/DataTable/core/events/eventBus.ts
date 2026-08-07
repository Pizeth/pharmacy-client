import type { EventBus, EventMap } from "./types";

type Listener<TPayload extends object> = (payload: TPayload) => void;

type ListenerMap<TEvents extends EventMap> = {
  [K in keyof TEvents]?: Set<Listener<TEvents[K]>>;
};

export class EventBusImpl<
  TEvents extends EventMap,
> implements EventBus<TEvents> {
  private readonly listeners: ListenerMap<TEvents> = {};

  on<K extends keyof TEvents>(
    event: K,
    listener: Listener<TEvents[K]>,
  ): () => void {
    // let bucket = this.listeners[event];

    // if (!bucket) {
    //   bucket = new Set<Listener<TEvents[K]>>();

    //   this.listeners[event] = bucket;
    // }

    const bucket = this.getListeners(event);

    bucket.add(listener);

    return () => {
      bucket?.delete(listener);
    };
  }

  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const bucket = this.listeners[event];

    if (!bucket) {
      return;
    }

    for (const listener of bucket) {
      listener(payload);
    }
  }

  clear(): void {
    // this.listeners.clear();
    for (const key of Object.keys(this.listeners)) {
      delete this.listeners[key as keyof TEvents];
    }
  }

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
