import {
  DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
} from "../types";

export const DATA_TABLE_PERSISTED_VISUAL_STATE_STORAGE_NAMESPACE =
  "razeth:data-table:visual-state" as const;

/**
 * Build the canonical key for one table's visual preferences.
 *
 * The schema version is deliberately encoded into the key as well as the
 * payload. A future incompatible persisted format can therefore coexist with
 * the prior key without guessing at payload shape before decoding it.
 */
export function createDataTablePersistedVisualStateStorageKey(
  storageId: string,
): string {
  const normalizedStorageId =
    storageId.trim();

  if (normalizedStorageId.length === 0) {
    throw new TypeError(
      "DataTable persistence storageId must be a non-empty string.",
    );
  }

  return [
    DATA_TABLE_PERSISTED_VISUAL_STATE_STORAGE_NAMESPACE,
    `v${DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION}`,
    encodeURIComponent(normalizedStorageId),
  ].join(":");
}
