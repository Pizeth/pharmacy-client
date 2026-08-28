// src/components/DataTable/mui/server-state/useDataTableServerState.ts

"use client";

import { useCallback, useRef, useState } from "react";
import { normalizeDataTableGlobalFilter } from "../utils/globalFilter";
import { createDataTableServerQueryState } from "./createDataTableServerQueryState";
import { resolveDataTableUpdater } from "./resolveUpdater";

import type {
  DataTableServerColumnFiltersState,
  DataTableServerPaginationState,
  DataTableServerQueryState,
  DataTableServerSortingState,
  DataTableServerStateController,
  UseDataTableServerStateOptions,
} from "./types";

/**
 * Controlled/uncontrolled query-state controller for server-backed
 * MUI DataTables.
 *
 * This hook owns QUERY STATE only.
 *
 * It does not:
 *
 * - fetch data
 * - know about Refine
 * - know about React Query
 * - serialize URLs
 * - translate filters into backend syntax
 *
 * Those concerns belong to later adapter layers.
 */
export function useDataTableServerState(
  options: UseDataTableServerStateOptions = {},
): DataTableServerStateController {
  const {
    state: controlledState,
    defaultState,
    onStateChange,
    defaultPageSize = 25,
    resetPageOnSortingChange = true,
    resetPageOnColumnFiltersChange = true,
    resetPageOnGlobalFilterChange = true,
  } = options;

  /**
   * Capture the initial reset target exactly once.
   *
   * Changing defaultState later does not silently redefine what
   * "Reset table query" means.
   */
  const initialStateRef = useRef<DataTableServerQueryState>(
    createDataTableServerQueryState(defaultState, defaultPageSize),
  );

  const [uncontrolledState, setUncontrolledState] =
    useState<DataTableServerQueryState>(initialStateRef.current);

  const controlled = controlledState !== undefined;

  const state = controlledState ?? uncontrolledState;

  /**
   * Always expose the latest effective state to callbacks.
   *
   * We update this optimistically when a change is committed so
   * multiple state changes within one event do not operate on a stale
   * render snapshot.
   */
  const stateRef = useRef(state);

  stateRef.current = state;

  const commit = useCallback(
    (nextState: DataTableServerQueryState): void => {
      stateRef.current = nextState;

      if (!controlled) {
        setUncontrolledState(nextState);
      }

      onStateChange?.(nextState);
    },
    [controlled, onStateChange],
  );

  const setState = useCallback(
    (nextState: DataTableServerQueryState): void => {
      commit(nextState);
    },
    [commit],
  );

  const onPaginationChange = useCallback(
    (
      updater: DataTableServerStateController["onPaginationChange"] extends (
        updater: infer TUpdater,
      ) => void
        ? TUpdater
        : never,
    ): void => {
      const current = stateRef.current;

      const pagination =
        resolveDataTableUpdater<DataTableServerPaginationState>(
          updater,
          current.pagination,
        );

      commit({
        ...current,

        pagination,
      });
    },
    [commit],
  );

  const onSortingChange = useCallback(
    (
      updater: DataTableServerStateController["onSortingChange"] extends (
        updater: infer TUpdater,
      ) => void
        ? TUpdater
        : never,
    ): void => {
      const current = stateRef.current;

      const sorting = resolveDataTableUpdater<DataTableServerSortingState>(
        updater,
        current.sorting,
      );

      commit({
        ...current,

        sorting,

        pagination: resetPageOnSortingChange
          ? {
              ...current.pagination,

              pageIndex: 0,
            }
          : current.pagination,
      });
    },
    [commit, resetPageOnSortingChange],
  );

  const onColumnFiltersChange = useCallback(
    (
      updater: DataTableServerStateController["onColumnFiltersChange"] extends (
        updater: infer TUpdater,
      ) => void
        ? TUpdater
        : never,
    ): void => {
      const current = stateRef.current;

      const columnFilters =
        resolveDataTableUpdater<DataTableServerColumnFiltersState>(
          updater,
          current.columnFilters,
        );

      commit({
        ...current,

        columnFilters,

        pagination: resetPageOnColumnFiltersChange
          ? {
              ...current.pagination,

              pageIndex: 0,
            }
          : current.pagination,
      });
    },
    [commit, resetPageOnColumnFiltersChange],
  );

  const onGlobalFilterChange = useCallback(
    (
      updater: DataTableServerStateController["onGlobalFilterChange"] extends (
        updater: infer TUpdater,
      ) => void
        ? TUpdater
        : never,
    ): void => {
      const current = stateRef.current;

      /**
       * Upstream globalFilter is intentionally broad.
       *
       * Resolve it at the erased boundary, then immediately normalize
       * it back into DataTable's string contract.
       */
      const nextValue = resolveDataTableUpdater<unknown>(
        updater,
        current.globalFilter,
      );

      const globalFilter = normalizeDataTableGlobalFilter(nextValue);

      commit({
        ...current,

        globalFilter,

        pagination: resetPageOnGlobalFilterChange
          ? {
              ...current.pagination,

              pageIndex: 0,
            }
          : current.pagination,
      });
    },
    [commit, resetPageOnGlobalFilterChange],
  );

  const reset = useCallback((): void => {
    commit(
      createDataTableServerQueryState(initialStateRef.current, defaultPageSize),
    );
  }, [commit, defaultPageSize]);

  return {
    state,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    setState,
    reset,
  };
}
