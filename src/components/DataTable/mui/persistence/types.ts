// src/components/DataTable/mui/persistence/types.ts

import type {
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  VisibilityState,
} from "@tanstack/table-core";

import type { MuiDataTableDensity } from "../density";
import type { DataTableDisplayMode } from "../presentation";

/**
 * Version of the persisted visual-state wire format.
 *
 * This is deliberately independent from TanStack's internal state version and
 * from the application's server-query URL format.
 */
export const DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION = 1 as const;

export type DataTablePersistedVisualStateVersion =
  typeof DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION;

/**
 * Safe, presentation-only state that may survive a browser session.
 *
 * Intentionally excluded:
 *
 * - pagination
 * - sorting
 * - column filters
 * - global search
 * - row selection
 * - row pinning
 * - expansion
 * - fullscreen/open-menu state
 *
 * Query synchronization and saved visual preferences remain separate concerns.
 */
export interface DataTablePersistedVisualState {
  readonly version: DataTablePersistedVisualStateVersion;
  readonly density?: MuiDataTableDensity;
  readonly displayMode?: DataTableDisplayMode;
  readonly columnVisibility?: VisibilityState;
  readonly columnOrder?: ColumnOrderState;
  readonly columnSizing?: ColumnSizingState;
  readonly columnPinning?: ColumnPinningState;
}

/**
 * Runtime column universe used to sanitize persisted state.
 *
 * IDs must be stable leaf-column IDs from the current table definition.
 */
export interface DataTablePersistedVisualStateContext {
  readonly columnIds: readonly string[];
}

/**
 * Result of attempting to decode one unknown persisted payload.
 *
 * Undefined means that the payload is not a supported persistence envelope and
 * should be ignored rather than partially guessed.
 */
export type DataTablePersistedVisualStateParseResult =
  | DataTablePersistedVisualState
  | undefined;
