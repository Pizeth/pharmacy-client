import {
  normalizeDataTablePersistedVisualState,
} from "../normalizeDataTablePersistedVisualState";
import type {
  DataTablePersistedVisualState,
} from "../types";
import {
  createDataTablePersistedVisualStateStorageKey,
} from "./createDataTablePersistedVisualStateStorageKey";
import type {
  CreateDataTablePersistedVisualStateStoreOptions,
  DataTablePersistedVisualStateStore,
} from "./types";

/**
 * Create one safe storage boundary for one table's persisted visual state.
 *
 * The store owns serialization and schema validation so raw storage adapters do
 * not need to understand DataTable state.
 */
export function createDataTablePersistedVisualStateStore(
  options: CreateDataTablePersistedVisualStateStoreOptions,
): DataTablePersistedVisualStateStore {
  const {
    storage,
    storageId,
    columnIds,
  } = options;

  const key =
    createDataTablePersistedVisualStateStorageKey(
      storageId,
    );

  return {
    key,

    read() {
      if (storage === undefined) {
        return undefined;
      }

      let serialized: string | null;

      try {
        serialized =
          storage.getItem(key);
      } catch {
        return undefined;
      }

      if (serialized === null) {
        return undefined;
      }

      let parsed: unknown;

      try {
        parsed =
          JSON.parse(serialized);
      } catch {
        return undefined;
      }

      return normalizeDataTablePersistedVisualState(
        parsed,
        {
          columnIds,
        },
      );
    },

    write(
      state: DataTablePersistedVisualState,
    ) {
      if (storage === undefined) {
        return false;
      }

      /**
       * Normalize before serialization even though callers receive a strongly
       * typed state. Runtime values can still originate from external stores,
       * old code or structurally compatible objects with extra properties.
       *
       * This guarantees the visual-preference key cannot accidentally become a
       * sink for semantic query or transient row state.
       */
      const normalized =
        normalizeDataTablePersistedVisualState(
          state,
          {
            columnIds,
          },
        );

      if (normalized === undefined) {
        return false;
      }

      try {
        storage.setItem(
          key,
          JSON.stringify(
            normalized,
          ),
        );

        return true;
      } catch {
        return false;
      }
    },

    remove() {
      if (storage === undefined) {
        return false;
      }

      try {
        storage.removeItem(
          key,
        );

        return true;
      } catch {
        return false;
      }
    },
  };
}
