import type {
  DataTablePersistenceStorage,
} from "./types";
import {
  createDataTablePersistedVisualStateStore,
} from "./createDataTablePersistedVisualStateStore";
import {
  createDataTablePersistedVisualStateStorageKey,
  DATA_TABLE_PERSISTED_VISUAL_STATE_STORAGE_NAMESPACE,
} from "./createDataTablePersistedVisualStateStorageKey";
import {
  DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
} from "../types";

const columnIds = [
  "select",
  "name",
  "status",
  "actions",
] as const;

interface MemoryStorage
  extends DataTablePersistenceStorage {
  readonly values: Map<string, string>;
}

function createMemoryStorage():
  MemoryStorage {
  const values =
    new Map<string, string>();

  return {
    values,

    getItem(
      key,
    ) {
      return (
        values.get(key) ??
        null
      );
    },

    setItem(
      key,
      value,
    ) {
      values.set(
        key,
        value,
      );
    },

    removeItem(
      key,
    ) {
      values.delete(
        key,
      );
    },
  };
}

describe(
  "DataTable persisted visual-state storage",
  () => {
    it(
      "owns a versioned and encoded storage key",
      () => {
        expect(
          createDataTablePersistedVisualStateStorageKey(
            " documents/admin ",
          ),
        ).toBe(
          `${DATA_TABLE_PERSISTED_VISUAL_STATE_STORAGE_NAMESPACE}:v${DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION}:documents%2Fadmin`,
        );

        expect(() =>
          createDataTablePersistedVisualStateStorageKey(
            "   ",
          ),
        ).toThrow(
          "storageId must be a non-empty string",
        );
      },
    );

    it(
      "round-trips normalized visual preferences through a replaceable storage adapter",
      () => {
        const storage =
          createMemoryStorage();

        const store =
          createDataTablePersistedVisualStateStore(
            {
              storage,
              storageId:
                "documents",
              columnIds,
            },
          );

        expect(
          store.write({
            version:
              DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
            density:
              "compact",
            displayMode:
              "card",
            columnVisibility: {
              status:
                false,
            },
            columnOrder: [
              "status",
              "name",
              "select",
              "actions",
            ],
            columnSizing: {
              name:
                240,
            },
            columnPinning: {
              start: [
                "select",
              ],
              end: [
                "actions",
              ],
            },
          }),
        ).toBe(
          true,
        );

        expect(
          store.read(),
        ).toEqual({
          version:
            DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
          density:
            "compact",
          displayMode:
            "card",
          columnVisibility: {
            status:
              false,
          },
          columnOrder: [
            "status",
            "name",
            "select",
            "actions",
          ],
          columnSizing: {
            name:
              240,
          },
          columnPinning: {
            start: [
              "select",
            ],
            end: [
              "actions",
            ],
          },
        });
      },
    );

    it(
      "sanitizes stale columns and strips semantic or transient state before writing",
      () => {
        const storage =
          createMemoryStorage();

        const store =
          createDataTablePersistedVisualStateStore(
            {
              storage,
              storageId:
                "translation-keys",
              columnIds,
            },
          );

        const runtimeState = {
          version:
            DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
          density:
            "comfortable" as const,
          columnVisibility: {
            name:
              false,
            removed:
              false,
          },
          columnOrder: [
            "removed",
            "status",
            "name",
          ],
          columnSizing: {
            removed:
              999,
            name:
              180,
          },

          pagination: {
            pageIndex:
              3,
          },
          sorting: [
            {
              id:
                "name",
              desc:
                true,
            },
          ],
          globalFilter:
            "secret",
          rowSelection: {
            "42":
              true,
          },
        };

        expect(
          store.write(
            runtimeState,
          ),
        ).toBe(
          true,
        );

        const serialized =
          storage.values.get(
            store.key,
          );

        expect(
          serialized,
        ).toBeDefined();

        const parsed =
          JSON.parse(
            serialized ?? "{}",
          );

        expect(parsed).toEqual({
          version:
            DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
          density:
            "comfortable",
          columnVisibility: {
            name:
              false,
          },
          columnOrder: [
            "status",
            "name",
            "select",
            "actions",
          ],
          columnSizing: {
            name:
              180,
          },
        });

        expect(
          parsed,
        ).not.toHaveProperty(
          "pagination",
        );

        expect(
          parsed,
        ).not.toHaveProperty(
          "sorting",
        );

        expect(
          parsed,
        ).not.toHaveProperty(
          "globalFilter",
        );

        expect(
          parsed,
        ).not.toHaveProperty(
          "rowSelection",
        );
      },
    );

    it(
      "returns no preference for malformed JSON or unsupported payloads",
      () => {
        const storage =
          createMemoryStorage();

        const store =
          createDataTablePersistedVisualStateStore(
            {
              storage,
              storageId:
                "documents",
              columnIds,
            },
          );

        storage.setItem(
          store.key,
          "{invalid-json",
        );

        expect(
          store.read(),
        ).toBeUndefined();

        storage.setItem(
          store.key,
          JSON.stringify({
            version:
              999,
            density:
              "compact",
          }),
        );

        expect(
          store.read(),
        ).toBeUndefined();
      },
    );

    it(
      "contains storage read, write, and remove failures",
      () => {
        const failingStorage:
          DataTablePersistenceStorage =
          {
            getItem() {
              throw new Error(
                "read denied",
              );
            },

            setItem() {
              throw new Error(
                "quota exceeded",
              );
            },

            removeItem() {
              throw new Error(
                "remove denied",
              );
            },
          };

        const store =
          createDataTablePersistedVisualStateStore(
            {
              storage:
                failingStorage,
              storageId:
                "documents",
              columnIds,
            },
          );

        expect(
          store.read(),
        ).toBeUndefined();

        expect(
          store.write({
            version:
              DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
            density:
              "spacious",
          }),
        ).toBe(
          false,
        );

        expect(
          store.remove(),
        ).toBe(
          false,
        );
      },
    );

    it(
      "is safe when storage is unavailable, including SSR-style construction",
      () => {
        const store =
          createDataTablePersistedVisualStateStore(
            {
              storage:
                undefined,
              storageId:
                "documents",
              columnIds,
            },
          );

        expect(
          store.read(),
        ).toBeUndefined();

        expect(
          store.write({
            version:
              DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
            density:
              "compact",
          }),
        ).toBe(
          false,
        );

        expect(
          store.remove(),
        ).toBe(
          false,
        );
      },
    );

    it(
      "removes a stored preference without affecting unrelated keys",
      () => {
        const storage =
          createMemoryStorage();

        const store =
          createDataTablePersistedVisualStateStore(
            {
              storage,
              storageId:
                "documents",
              columnIds,
            },
          );

        storage.setItem(
          store.key,
          JSON.stringify({
            version:
              DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
            density:
              "compact",
          }),
        );

        storage.setItem(
          "unrelated",
          "keep-me",
        );

        expect(
          store.remove(),
        ).toBe(
          true,
        );

        expect(
          storage.getItem(
            store.key,
          ),
        ).toBeNull();

        expect(
          storage.getItem(
            "unrelated",
          ),
        ).toBe(
          "keep-me",
        );
      },
    );
  },
);
