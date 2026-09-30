// src/components/DataTable/core/server-state/types.ts

import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
} from "@tanstack/table-core";

export type DataTableServerPaginationState =
  PaginationState;

export type DataTableServerSortingState =
  SortingState;

export type DataTableServerColumnFiltersState =
  ColumnFiltersState;

export interface DataTableServerQueryState {
  readonly pagination:
    DataTableServerPaginationState;
  readonly sorting:
    DataTableServerSortingState;
  readonly columnFilters:
    DataTableServerColumnFiltersState;
  readonly globalFilter:
    string;
}

export type DataTableServerQueryStateInput =
  Partial<DataTableServerQueryState>;

export type DataTableServerQueryStateChangeHandler =
  (
    state:
      DataTableServerQueryState,
  ) => void;

export interface DataTableServerStateController {
  readonly state:
    DataTableServerQueryState;

  readonly onPaginationChange: (
    updater:
      Updater<
        DataTableServerPaginationState
      >,
  ) => void;

  readonly onSortingChange: (
    updater:
      Updater<
        DataTableServerSortingState
      >,
  ) => void;

  readonly onColumnFiltersChange: (
    updater:
      Updater<
        DataTableServerColumnFiltersState
      >,
  ) => void;

  readonly onGlobalFilterChange: (
    updater:
      Updater<unknown>,
  ) => void;

  readonly setState: (
    state:
      DataTableServerQueryState,
  ) => void;

  readonly reset:
    () => void;
}

export interface UseDataTableServerStateOptions {
  readonly state?:
    DataTableServerQueryState;

  readonly defaultState?:
    DataTableServerQueryStateInput;

  readonly onStateChange?:
    DataTableServerQueryStateChangeHandler;

  readonly defaultPageSize?: number;

  readonly resetPageOnSortingChange?: boolean;
  readonly resetPageOnColumnFiltersChange?: boolean;
  readonly resetPageOnGlobalFilterChange?: boolean;
}
