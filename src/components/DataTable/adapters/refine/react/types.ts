import type {
  BaseRecord,
  HttpError,
  UseListProps,
} from "@refinedev/core";
import type { RowData } from "@tanstack/table-core";

import type {
  DataTableServerResult,
  DataTableServerResultLifecycle,
} from "../../../mui/server-data";
import type {
  DataTableServerQueryState,
} from "../../../mui/server-state";
import type {
  RefineDataTableAdapter,
} from "../types";

/**
 * Primitive request state produced by Refine's useList() lifecycle.
 *
 * This intentionally mirrors the lower-level request contract already used by
 * resource-specific server loaders:
 *
 *   result
 *   loading
 *   fetching
 *   error
 *   refresh
 *
 * The generic DataTable lifecycle remains responsible for deciding whether a
 * request is an initial block, a background refresh, or a previous-result
 * replacement.
 */
export interface RefineDataTableRequestState<
  TData extends RowData & BaseRecord,
> {
  readonly result: DataTableServerResult<TData> | undefined;
  readonly loading: boolean;
  readonly fetching: boolean;
  readonly error: unknown;
  readonly refresh: () => void;
}

/**
 * Refine query options that remain safe to expose through the bridge.
 *
 * Query execution tuning belongs here; resource/query semantics continue to be
 * owned by the DataTable semantic adapter.
 *
 * LiveProvider options are deliberately not exposed in 1.8.3. Realtime has its
 * own later phase and should be introduced through a generic live-data
 * contract rather than accidentally becoming Refine-defined behavior.
 */
export type RefineDataTableUseListQueryOptions<
  TData extends RowData & BaseRecord,
  TError extends HttpError,
> = UseListProps<TData, TError, TData>["queryOptions"];

export interface UseRefineDataTableRequestOptions<
  TData extends RowData & BaseRecord,
  TError extends HttpError = HttpError,
> {
  readonly query: DataTableServerQueryState;
  readonly adapter: RefineDataTableAdapter<TData>;

  /**
   * Optional TanStack Query controls forwarded through Refine useList().
   *
   * IMPORTANT:
   *
   * Do not use placeholderData to preserve old table rows. DataTable already
   * has a transport-independent previous-result lifecycle for that purpose.
   * Placeholder results are ignored defensively by this bridge.
   */
  readonly queryOptions?: RefineDataTableUseListQueryOptions<TData, TError>;
}

export interface UseRefineDataTableServerResultOptions<
  TData extends RowData & BaseRecord,
  TError extends HttpError = HttpError,
> extends UseRefineDataTableRequestOptions<TData, TError> {
  /**
   * Preserve the previous successful normalized result while a replacement
   * Refine query is pending.
   *
   * Default: true.
   */
  readonly keepPreviousResult?: boolean;
}

export interface RefineDataTableServerLifecycle<
  TData extends RowData & BaseRecord,
> {
  readonly request: RefineDataTableRequestState<TData>;
  readonly server: DataTableServerResultLifecycle<TData>;
}
