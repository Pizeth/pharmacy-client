"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  RowData,
} from "@tanstack/table-core";

import type {
  MuiDataTableDensity,
} from "../../density";
import type {
  DataTableDisplayMode,
} from "../../presentation";
import {
  createDataTablePersistedVisualStateStore,
  getBrowserDataTablePersistenceStorage,
} from "../storage";
import type {
  DataTablePersistedVisualStateStore,
} from "../storage";
import type {
  DataTablePersistedVisualStateController,
  UseDataTablePersistedVisualStateControllerOptions,
} from "./types";

function canUsePersistedDisplayMode(
  mode: DataTableDisplayMode,
  cardAvailable: boolean,
): boolean {
  return (
    mode === "table" ||
    cardAvailable
  );
}

/**
 * Connect persisted visual preferences to the existing DataTable state owners.
 *
 * This hook does not create another TanStack state store.
 *
 * - persisted uncontrolled column state is applied through TanStack setters,
 * - controlled TanStack slices are left untouched,
 * - density/display-mode controlled props remain authoritative,
 * - uncontrolled density/display mode are owned here only while persistence is
 *   enabled so persisted values can hydrate after mount without SSR mismatch.
 */
export function useDataTablePersistedVisualStateController<
  TData extends RowData,
>(
  options:
    UseDataTablePersistedVisualStateControllerOptions<TData>,
): DataTablePersistedVisualStateController {
  const {
    table,
    persistence,

    density:
      controlledDensity,
    defaultDensity,
    onDensityChange,

    displayMode:
      controlledDisplayMode,
    defaultDisplayMode,
    onDisplayModeChange,

    cardAvailable,
  } = options;

  const persistenceStorageId =
    persistence === false
      ? undefined
      : persistence.storageId;

  const persistenceStorage =
    persistence === false
      ? undefined
      : persistence.storage;

  const enabled =
    persistence !== false &&
    persistence.enabled !== false;

  const densityControlled =
    controlledDensity !== undefined;

  const displayModeControlled =
    controlledDisplayMode !== undefined;

  const columnVisibilityControlled =
    table.options.state?.columnVisibility !==
    undefined;

  const columnOrderControlled =
    table.options.state?.columnOrder !==
    undefined;

  const columnSizingControlled =
    table.options.state?.columnSizing !==
    undefined;

  const columnPinningControlled =
    table.options.state?.columnPinning !==
    undefined;

  const [
    uncontrolledDensity,
    setUncontrolledDensity,
  ] =
    useState<MuiDataTableDensity>(
      defaultDensity,
    );

  const [
    uncontrolledDisplayMode,
    setUncontrolledDisplayMode,
  ] =
    useState<DataTableDisplayMode>(
      defaultDisplayMode,
    );

  const [
    store,
    setStore,
  ] =
    useState<
      DataTablePersistedVisualStateStore
      | undefined
    >();

  const [
    hydrated,
    setHydrated,
  ] =
    useState(
      !enabled,
    );

  const columnIds =
    table
      .getAllLeafColumns()
      .map(
        (column) =>
          column.id,
      );

  const columnIdsSignature =
    JSON.stringify(
      columnIds,
    );

  /**
   * Preserve the exact current leaf-column universe while avoiding effect
   * churn merely because getAllLeafColumns() returns a fresh array.
   */
  const persistenceColumnIds =
    useMemo(
      () =>
        columnIds,
      // The serialized stable IDs are the dependency by design.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        columnIdsSignature,
      ],
    );

  useEffect(
    () => {
      if (
        !enabled ||
        persistence ===
          false
      ) {
        setStore(
          undefined,
        );

        setHydrated(
          true,
        );

        return;
      }

      setHydrated(
        false,
      );

      const storage =
        persistenceStorage ??
        getBrowserDataTablePersistenceStorage();

      if (
        persistenceStorageId ===
        undefined
      ) {
        setStore(
          undefined,
        );

        setHydrated(
          true,
        );

        return;
      }

      const nextStore =
        createDataTablePersistedVisualStateStore(
          {
            storage,
            storageId:
              persistenceStorageId,
            columnIds:
              persistenceColumnIds,
          },
        );

      const persisted =
        nextStore.read();

      /**
       * Explicit controlled state always wins.
       *
       * The persistence layer must never use hydration as an indirect request
       * to mutate a controlled table slice.
       */
      if (
        persisted
          ?.columnVisibility !==
          undefined &&
        !columnVisibilityControlled
      ) {
        table.setColumnVisibility(
          persisted.columnVisibility,
        );
      }

      if (
        persisted
          ?.columnOrder !==
          undefined &&
        !columnOrderControlled
      ) {
        table.setColumnOrder(
          persisted.columnOrder,
        );
      }

      if (
        persisted
          ?.columnSizing !==
          undefined &&
        !columnSizingControlled
      ) {
        table.setColumnSizing(
          persisted.columnSizing,
        );
      }

      if (
        persisted
          ?.columnPinning !==
          undefined &&
        !columnPinningControlled
      ) {
        table.setColumnPinning(
          persisted.columnPinning,
        );
      }

      if (
        persisted?.density !==
          undefined &&
        !densityControlled
      ) {
        setUncontrolledDensity(
          persisted.density,
        );
      }

      if (
        persisted
          ?.displayMode !==
          undefined &&
        !displayModeControlled &&
        canUsePersistedDisplayMode(
          persisted.displayMode,
          cardAvailable,
        )
      ) {
        setUncontrolledDisplayMode(
          persisted.displayMode,
        );
      }

      setStore(
        nextStore,
      );

      setHydrated(
        true,
      );
    },
    [
      cardAvailable,
      columnOrderControlled,
      columnPinningControlled,
      columnSizingControlled,
      columnVisibilityControlled,
      densityControlled,
      displayModeControlled,
      enabled,
      persistenceColumnIds,
      persistenceStorage,
      persistenceStorageId,
      table,
    ],
  );

  const density =
    controlledDensity ??
    uncontrolledDensity;

  const displayMode =
    controlledDisplayMode ??
    uncontrolledDisplayMode;

  const setDensity =
    useCallback(
      (
        nextDensity:
          MuiDataTableDensity,
      ): void => {
        if (
          !densityControlled
        ) {
          setUncontrolledDensity(
            nextDensity,
          );
        }

        onDensityChange?.(
          nextDensity,
        );
      },
      [
        densityControlled,
        onDensityChange,
      ],
    );

  const setDisplayMode =
    useCallback(
      (
        nextMode:
          DataTableDisplayMode,
      ): void => {
        if (
          !displayModeControlled
        ) {
          setUncontrolledDisplayMode(
            nextMode,
          );
        }

        onDisplayModeChange?.(
          nextMode,
        );
      },
      [
        displayModeControlled,
        onDisplayModeChange,
      ],
    );

  return {
    enabled,
    hydrated,
    store,

    density,
    displayMode,

    setDensity,
    setDisplayMode,

    persistDensity:
      enabled &&
      !densityControlled,

    persistDisplayMode:
      enabled &&
      !displayModeControlled,

    persistColumnVisibility:
      enabled &&
      !columnVisibilityControlled,

    persistColumnOrder:
      enabled &&
      !columnOrderControlled,

    persistColumnSizing:
      enabled &&
      !columnSizingControlled,

    persistColumnPinning:
      enabled &&
      !columnPinningControlled,
  };
}
