// src/components/DataTable/core/live/createDataTableLiveEventDeduplicator.ts

import {
  getDataTableLiveEventDeduplicationKey,
} from "./createDataTableLiveEvent";
import type {
  CreateDataTableLiveEventDeduplicatorOptions,
  DataTableLiveEventDeduplicator,
} from "./liveServerResultTypes";

const DEFAULT_MAX_ENTRIES = 512;

/**
 * Bounded resource/event-ID duplicate protection.
 *
 * The deduplicator survives normal subscription disconnect/reconnect cycles
 * when kept by a mounted controller, preventing replayed events from executing
 * the same refetch/reconciliation twice.
 */
export function createDataTableLiveEventDeduplicator(
  options: CreateDataTableLiveEventDeduplicatorOptions = {},
): DataTableLiveEventDeduplicator {
  const maxEntries =
    options.maxEntries ?? DEFAULT_MAX_ENTRIES;

  if (
    !Number.isInteger(maxEntries) ||
    maxEntries <= 0
  ) {
    throw new Error(
      "DataTable live deduplication maxEntries must be a positive integer.",
    );
  }

  const keys = new Set<string>();
  const order: string[] = [];

  return {
    accept(event) {
      const key =
        getDataTableLiveEventDeduplicationKey(event);

      if (keys.has(key)) {
        return false;
      }

      keys.add(key);
      order.push(key);

      while (order.length > maxEntries) {
        const oldest = order.shift();

        if (oldest !== undefined) {
          keys.delete(oldest);
        }
      }

      return true;
    },

    clear() {
      keys.clear();
      order.length = 0;
    },

    size() {
      return keys.size;
    },
  };
}
