"use client";

import {
  useEffect,
} from "react";
import type {
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnVisibilityState,
  RowData,
} from "@tanstack/table-core";

import type {
  MuiDataTableInstance,
} from "../../table";
import {
  DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,
} from "../types";
import type {
  DataTablePersistedVisualStateController,
} from "./types";

interface PersistedColumnState {
  readonly columnVisibility:
    ColumnVisibilityState;
  readonly columnOrder:
    ColumnOrderState;
  readonly columnSizing:
    ColumnSizingState;
  readonly columnPinning:
    ColumnPinningState;
}

interface DataTablePersistedVisualStateWriterProps {
  readonly controller:
    DataTablePersistedVisualStateController;

  readonly columnState:
    PersistedColumnState;
}

function DataTablePersistedVisualStateWriter(
  props:
    DataTablePersistedVisualStateWriterProps,
) {
  const {
    controller,
    columnState,
  } = props;

  useEffect(
    () => {
      const {
        store,
        enabled,
        hydrated,
      } =
        controller;

      if (
        !enabled ||
        !hydrated ||
        store ===
          undefined
      ) {
        return;
      }

      store.write({
        version:
          DATA_TABLE_PERSISTED_VISUAL_STATE_VERSION,

        ...(controller
          .persistDensity
          ? {
              density:
                controller.density,
            }
          : {}),

        ...(controller
          .persistDisplayMode
          ? {
              displayMode:
                controller.displayMode,
            }
          : {}),

        ...(controller
          .persistColumnVisibility
          ? {
              columnVisibility:
                columnState.columnVisibility,
            }
          : {}),

        ...(controller
          .persistColumnOrder
          ? {
              columnOrder:
                columnState.columnOrder,
            }
          : {}),

        ...(controller
          .persistColumnSizing
          ? {
              columnSizing:
                columnState.columnSizing,
            }
          : {}),

        ...(controller
          .persistColumnPinning
          ? {
              columnPinning:
                columnState.columnPinning,
            }
          : {}),
      });
    },
    [
      columnState,
      controller,
    ],
  );

  return null;
}

export interface DataTablePersistedVisualStateBridgeProps<
  TData extends RowData,
> {
  readonly table:
    MuiDataTableInstance<TData>;

  readonly controller:
    DataTablePersistedVisualStateController;
}

/**
 * Observe the existing TanStack visual-state atoms and persist a normalized
 * snapshot after hydration.
 *
 * The bridge is deliberately rendered beneath table.AppTable so it uses the
 * configured TanStack v9 subscription mechanism rather than a compatibility
 * getState() read.
 */
export function DataTablePersistedVisualStateBridge<
  TData extends RowData,
>(
  props:
    DataTablePersistedVisualStateBridgeProps<TData>,
) {
  const {
    table,
    controller,
  } = props;

  if (
    !controller.enabled
  ) {
    return null;
  }

  return (
    <table.Subscribe
      selector={(
        state,
      ) => ({
        columnVisibility:
          state.columnVisibility,
        columnOrder:
          state.columnOrder,
        columnSizing:
          state.columnSizing,
        columnPinning:
          state.columnPinning,
      })}
    >
      {(columnState) => (
        <DataTablePersistedVisualStateWriter
          controller={
            controller
          }
          columnState={
            columnState
          }
        />
      )}
    </table.Subscribe>
  );
}
