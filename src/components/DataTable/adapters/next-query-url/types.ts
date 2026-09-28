// src/components/DataTable/adapters/next-query-url/types.ts

import type {
  DataTableQueryUrlCodec,
  DataTableQueryUrlHistoryMode,
} from "../../mui/query-url";
import type {
  DataTableServerQueryStateChangeHandler,
} from "../../mui/server-state";

export interface UseDataTableServerQueryUrlStateOptions {
  readonly codec: DataTableQueryUrlCodec;

  /**
   * How DataTable interactions update browser history.
   *
   * "replace" is the default so debounced search/filter edits do not create a
   * history entry for every intermediate query.
   */
  readonly historyMode?: DataTableQueryUrlHistoryMode;

  /**
   * Enables URL synchronization.
   *
   * Default: true.
   */
  readonly enabled?: boolean;

  /**
   * Optional observer invoked after the canonical server-query state changes.
   */
  readonly onStateChange?:
    DataTableServerQueryStateChangeHandler;

  readonly resetPageOnSortingChange?: boolean;
  readonly resetPageOnColumnFiltersChange?: boolean;
  readonly resetPageOnGlobalFilterChange?: boolean;
}
