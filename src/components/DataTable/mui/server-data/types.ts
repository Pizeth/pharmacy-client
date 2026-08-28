// src/components/DataTable/mui/server-data/types.ts

import type { RowData } from "@tanstack/table-core";
import type {
  DataTableServerQueryState,
  DataTableServerStateController,
} from "../server-state";

/**
 * Pagination metadata normalized for DataTable.
 *
 * IMPORTANT:
 *
 * pageIndex is always zero-based because that is the state model used
 * by TanStack Table.
 *
 * The backend may use any representation it wants:
 *
 *   page = 1
 *   currentPage = 1
 *   cursor
 *   offset
 *
 * A transport adapter is responsible for translating that representation
 * into this normalized form such as:
 *
 *
 *   page = 1
 *
 * into:
 *
 *   pageIndex = 0
 */
export interface DataTableServerPaginationResult {
  /**
   * Zero-based current page.
   */
  readonly pageIndex: number;

  /**
   * Number of rows requested/displayed per page.
   */
  readonly pageSize: number;

  /**
   * Total number of records matching the current server query.
   *
   * This is NOT merely the number of rows returned on the current page.
   */
  readonly rowCount: number;

  /**
   * Total number of pages.
   *
   * A lifecycle state may temporarily expose -1 while the server has
   * not returned pagination metadata yet.
   *
   * Our pagination renderer already supports -1 as an unknown page
   * count.
   */
  readonly pageCount: number;

  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

/**
 * Backend-independent result consumed by a server-backed DataTable.
 *
 * DataTable never needs to know the original HTTP response shape after
 * this boundary.
 */
export interface DataTableServerResult<TData extends RowData> {
  /**
   * Rows belonging to the current server page.
   */
  readonly rows: TData[];

  /**
   * Normalized server pagination metadata.
   */
  readonly pagination: DataTableServerPaginationResult;
}

/**
 * Converts DataTable's normalized query state into an arbitrary
 * transport/API request representation.
 *
 * Examples:
 *
 * DataTableServerQueryState
 *      ↓
 * REST query parameters
 *
 * DataTableServerQueryState
 *      ↓
 * Refine filters/sorters/pagination
 *
 * DataTableServerQueryState
 *      ↓
 * GraphQL variables
 *
 * DataTable does not prescribe the target request type.
 */
export interface DataTableServerQueryAdapter<TRequest> {
  readonly createRequest: (query: DataTableServerQueryState) => TRequest;
}

/**
 * Converts one transport-specific server response into the normalized
 * result expected by DataTable.
 */
export interface DataTableServerResponseAdapter<
  TResponse,
  TData extends RowData,
> {
  readonly readResponse: (response: TResponse) => DataTableServerResult<TData>;
}

/**
 * Complete bidirectional server adapter.
 *
 * This is deliberately transport-agnostic.
 *
 * It contains:
 *
 *   DataTable query -> request
 *
 * and:
 *
 *   server response -> DataTable result
 */
export interface DataTableServerAdapter<
  TRequest,
  TResponse,
  TData extends RowData,
>
  extends
    DataTableServerQueryAdapter<TRequest>,
    DataTableServerResponseAdapter<TResponse, TData> {}

/**
 * ------------------------------------------------------------------
 * Server-result lifecycle
 * ------------------------------------------------------------------
 *
 * This is the normalized view of server data after accounting for:
 *
 * - initial loading
 * - background fetching
 * - previous-result preservation
 * - initial/blocking errors
 * - refresh errors
 */
export interface DataTableServerResultLifecycle<TData extends RowData> {
  /**
   * Rows that should currently be given to TanStack.
   *
   * During background fetching these may be rows from the previous
   * successful result.
   */
  readonly rows: TData[];

  /**
   * Pagination metadata corresponding to the currently displayed
   * rows.
   */
  readonly pagination: DataTableServerPaginationResult;

  /**
   * True once some server result is available for presentation.
   *
   * This includes a preserved previous result.
   */
  readonly hasResult: boolean;

  /**
   * Whether currently displayed rows came from a preserved previous
   * successful result because the current request has not produced a
   * result yet.
   */
  readonly isPreviousResult: boolean;

  /**
   * Whether the currently displayed result contains rows.
   */
  readonly hasRows: boolean;

  /**
   * A successful server result exists, but it contains zero rows.
   */
  readonly isEmpty: boolean;

  /**
   * The table has no usable result yet and the first/current request
   * is loading.
   *
   * This should normally drive the full DataTable loading state.
   */
  readonly isInitialLoading: boolean;

  /**
   * Some request is currently in flight.
   *
   * This is broader than isRefreshing.
   */
  readonly isFetching: boolean;

  /**
   * A request is running while usable rows/result metadata remain
   * visible.
   *
   * This is the correct state for a subtle progress indicator rather
   * than replacing the whole table with a loading state.
   */
  readonly isRefreshing: boolean;

  /**
   * Original error supplied by the query/fetch layer.
   */
  readonly error: unknown;

  /**
   * Error occurring while there is no usable server result.
   *
   * This is normally appropriate for the DataTable's full error
   * state.
   */
  readonly blockingError: unknown;

  /**
   * Error occurring while previous/current rows can still remain
   * visible.
   *
   * The application may show this as a toast/banner while preserving
   * the existing table.
   */
  readonly refreshError: unknown;
}

/**
 * Inputs used to derive the result lifecycle.
 *
 * This interface intentionally uses generic transport-independent
 * flags rather than React Query/Refine-specific terminology.
 */
export interface UseDataTableServerResultOptions<TData extends RowData> {
  /**
   * Current DataTable query.
   *
   * Used to provide meaningful pagination metadata before the server
   * returns its first result.
   */
  readonly query: DataTableServerQueryState;

  /**
   * Latest successfully normalized server result.
   *
   * undefined means that no current result is available yet.
   */
  readonly result?: DataTableServerResult<TData>;

  /**
   * Whether the current request is in a loading state.
   *
   * Default: false.
   */
  readonly loading?: boolean;

  /**
   * Whether a network/query operation is currently running.
   *
   * If omitted, this defaults to the value of `loading`.
   *
   * Separating `fetching` from `loading` lets query libraries express:
   *
   *   loading = false
   *   fetching = true
   *
   * for background refetches.
   */
  readonly fetching?: boolean;

  /**
   * Current request/query error.
   *
   * `undefined` and `null` are treated as no error.
   */
  readonly error?: unknown;

  /**
   * Preserve the previous successful result while a replacement result
   * is temporarily unavailable.
   *
   * Default: true.
   */
  readonly keepPreviousResult?: boolean;
}

/**
 * ------------------------------------------------------------------
 * TanStack table binding
 * ------------------------------------------------------------------
 *
 * This is the set of server-controlled options that can be spread
 * directly into useMuiDataTable().
 *
 * Columns and resource-specific options remain the consuming
 * application's responsibility.
 */
export interface DataTableServerTableBinding<TData extends RowData> {
  readonly data: TData[];

  /**
   * Only the query-owned TanStack slices.
   *
   * Other state such as:
   *
   * - rowSelection
   * - columnVisibility
   * - columnPinning
   * - columnSizing
   * - expanded
   *
   * continues to be owned by the table normally.
   */
  readonly state: DataTableServerQueryState;

  readonly onPaginationChange: DataTableServerStateController["onPaginationChange"];
  readonly onSortingChange: DataTableServerStateController["onSortingChange"];
  readonly onColumnFiltersChange: DataTableServerStateController["onColumnFiltersChange"];
  readonly onGlobalFilterChange: DataTableServerStateController["onGlobalFilterChange"];

  readonly manualPagination: true;
  readonly manualSorting: true;
  readonly manualFiltering: true;

  /**
   * May temporarily be -1 before the server returns its first
   * pagination result.
   */
  readonly pageCount: number;
}

/**
 * Configuration accepted by createDataTableServerTableBinding().
 */
export interface CreateDataTableServerTableBindingOptions<
  TData extends RowData,
> {
  readonly query: DataTableServerStateController;
  readonly result: DataTableServerResultLifecycle<TData>;
}
