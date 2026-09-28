import type {
  DataTablePersistenceStorage,
} from "./types";

/**
 * Resolve the browser's localStorage as one optional persistence adapter.
 *
 * Important:
 *
 * - no browser global is touched at module evaluation time,
 * - SSR returns undefined,
 * - environments which deny access to localStorage return undefined,
 * - later get/set/remove exceptions are still contained by the high-level
 *   persisted visual-state store.
 */
export function getBrowserDataTablePersistenceStorage():
  | DataTablePersistenceStorage
  | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
