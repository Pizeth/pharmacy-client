import type {
  DataTablePersistedVisualState,
  DataTablePersistedVisualStateContext,
} from "../types";

/**
 * Minimal synchronous string-storage boundary used by DataTable persistence.
 *
 * The interface intentionally mirrors the subset of Web Storage required by
 * the DataTable without depending on the browser Storage type itself.
 */
export interface DataTablePersistenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface CreateDataTablePersistedVisualStateStoreOptions
  extends DataTablePersistedVisualStateContext {
  /**
   * Stable application-owned identifier for one table preference scope.
   *
   * Examples:
   *
   * - "translation-keys"
   * - "documents"
   * - "documents:admin"
   *
   * User/tenant scoping may be included by the application when required.
   */
  readonly storageId: string;

  /**
   * Replaceable raw storage adapter.
   *
   * Undefined is a supported state and represents an unavailable storage
   * environment such as SSR.
   */
  readonly storage?: DataTablePersistenceStorage;
}

/**
 * Safe high-level store for one table's visual preferences.
 *
 * Boolean write/remove results report whether the storage operation completed.
 * Consumers should treat persistence as optional enhancement rather than a
 * prerequisite for table operation.
 */
export interface DataTablePersistedVisualStateStore {
  readonly key: string;

  read(): DataTablePersistedVisualState | undefined;

  write(state: DataTablePersistedVisualState): boolean;

  remove(): boolean;
}
