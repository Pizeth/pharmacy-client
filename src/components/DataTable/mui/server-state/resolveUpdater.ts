// src/components/DataTable/mui/server-state/resolveUpdater.ts

import type { Updater } from "@tanstack/table-core";

/**
 * Resolve TanStack's standard:
 *
 *   TValue
 *
 * or:
 *
 *   (previous: TValue) => TValue
 *
 * updater shape.
 */
export function resolveDataTableUpdater<TValue>(
  updater: Updater<TValue>,
  previous: TValue,
): TValue {
  if (typeof updater === "function") {
    /**
     * Updater<TValue> guarantees this function shape.
     *
     * The assertion is localized because TypeScript cannot generally
     * distinguish TValue itself being callable from the updater
     * callback union.
     */
    const update = updater as (previous: TValue) => TValue;

    return update(previous);
  }

  return updater;
}
