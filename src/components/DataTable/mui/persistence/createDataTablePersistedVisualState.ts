// src/components/DataTable/mui/persistence/createDataTablePersistedVisualState.ts

import type {
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  VisibilityState,
} from "@tanstack/table-core";

import type { MuiDataTableDensity } from "../density";
import type { DataTableDisplayMode } from "../presentation";
import {
  normalizeDataTablePersistedVisualState,
} from "./normalizeDataTablePersistedVisualState";
import {
  DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
  type DataTablePersistedVisualState,
  type DataTablePersistedVisualStateContext,
} from "./types";

export interface CreateDataTablePersistedVisualStateOptions
  extends DataTablePersistedVisualStateContext {
  readonly density?: MuiDataTableDensity;
  readonly displayMode?: DataTableDisplayMode;
  readonly columnVisibility?: VisibilityState;
  readonly columnOrder?: ColumnOrderState;
  readonly columnSizing?: ColumnSizingState;
  readonly columnPinning?: ColumnPinningState;
}

/**
 * Build a canonical v1 persisted visual-state envelope.
 *
 * Calling through the normalizer keeps creation and hydration under the exact
 * same compatibility rules.
 */
export function createDataTablePersistedVisualState(
  options: CreateDataTablePersistedVisualStateOptions,
): DataTablePersistedVisualState {
  const {
    columnIds,
    density,
    displayMode,
    columnVisibility,
    columnOrder,
    columnSizing,
    columnPinning,
  } = options;

  return (
    normalizeDataTablePersistedVisualState(
      {
        version:
          DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
        density,
        displayMode,
        columnVisibility,
        columnOrder,
        columnSizing,
        columnPinning,
      },
      { columnIds },
    ) ?? {
      version:
        DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
    }
  );
}
