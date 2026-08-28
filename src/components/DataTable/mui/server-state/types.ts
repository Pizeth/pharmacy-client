// src/components/DataTable/mui/server-state/types.ts

import type { Updater } from "@tanstack/table-core";
import type { MuiDataTableState } from "../features";

/**
 * Pagination state used by the MUI DataTable feature family.
 *
 * Deriving it from MuiDataTableState means we do not duplicate
 * TanStack's current pagination-state declaration.
 */
export type DataTableServerPaginationState = MuiDataTableState["pagination"];

/**
 * Sorting state used by the installed TanStack feature family.
 */
export type DataTableServerSortingState = MuiDataTableState["sorting"];

/**
 * Column-filter state used by the installed TanStack feature family.
 */
export type DataTableServerColumnFiltersState =
  MuiDataTableState["columnFilters"];

/**
 * Canonical server-query state understood by DataTable.
 *
 * Notice that globalFilter is deliberately normalized to string.
 *
 * TanStack currently exposes that upstream state slice very broadly,
 * but our public DataTable global-search UI has already established
 * a string contract.
 *
 * We do not leak upstream `any` into our server adapter.
 */
export interface DataTableServerQueryState {
  readonly pagination: DataTableServerPaginationState;
  readonly sorting: DataTableServerSortingState;
  readonly columnFilters: DataTableServerColumnFiltersState;
  readonly globalFilter: string;
}

/**
 * Partial state accepted when supplying initial/default values.
 */
export type DataTableServerQueryStateInput = Partial<DataTableServerQueryState>;

/**
 * Complete DataTable server-state change notification.
 */
export type DataTableServerQueryStateChangeHandler = (
  state: DataTableServerQueryState,
) => void;

/**
 * Controller returned by useDataTableServerState().
 *
 * The callbacks intentionally use TanStack Updater semantics so they
 * can be wired directly to the corresponding table options.
 */
export interface DataTableServerStateController {
  readonly state: DataTableServerQueryState;

  readonly onPaginationChange: (
    updater: Updater<DataTableServerPaginationState>,
  ) => void;

  readonly onSortingChange: (
    updater: Updater<DataTableServerSortingState>,
  ) => void;

  readonly onColumnFiltersChange: (
    updater: Updater<DataTableServerColumnFiltersState>,
  ) => void;

  /**
   * The upstream globalFilter type is intentionally erased at this
   * boundary.
   *
   * It is normalized immediately back to our canonical string state.
   */
  readonly onGlobalFilterChange: (updater: Updater<unknown>) => void;

  /**
   * Replace the entire query state.
   */
  readonly setState: (state: DataTableServerQueryState) => void;

  /**
   * Restore the configured default server-query state.
   */
  readonly reset: () => void;
}

/**
 * Configuration for the controlled/uncontrolled server state hook.
 */
export interface UseDataTableServerStateOptions {
  /**
   * Fully controlled server-query state.
   *
   * When supplied, useDataTableServerState will not own query state
   * internally.
   */
  readonly state?: DataTableServerQueryState;

  /**
   * Initial uncontrolled values.
   */
  readonly defaultState?: DataTableServerQueryStateInput;

  /**
   * Called whenever query state changes.
   */
  readonly onStateChange?: DataTableServerQueryStateChangeHandler;

  /**
   * Default page size when defaultState.pagination is omitted.
   *
   * Default: 25.
   */
  readonly defaultPageSize?: number;

  /**
   * Reset pageIndex to 0 when sorting changes.
   *
   * Default: true.
   */
  readonly resetPageOnSortingChange?: boolean;

  /**
   * Reset pageIndex to 0 when column filters change.
   *
   * Default: true.
   */
  readonly resetPageOnColumnFiltersChange?: boolean;

  /**
   * Reset pageIndex to 0 when global search changes.
   *
   * Default: true.
   */
  readonly resetPageOnGlobalFilterChange?: boolean;
}
