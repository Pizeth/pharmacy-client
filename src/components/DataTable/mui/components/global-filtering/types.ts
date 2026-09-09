// src/components/DataTable/mui/components/global-filtering/types.ts

/**
 * Public search semantics of the MUI DataTable.
 *
 * TanStack's global-filter state is intentionally broad at the core
 * feature boundary.
 *
 * Our standard DataTable search UI deliberately narrows its public
 * interaction to text.
 */
export type DataTableGlobalFilterValue = string;

/**
 * Configuration shared by global-search renderers.
 */
export interface DataTableGlobalFilterConfig {
  /**
   * Text displayed inside an empty search field.
   */
  readonly placeholder?: string;

  /**
   * Accessible/input label.
   */
  readonly label?: string;

  /**
   * Whether the clear button should be shown while a value exists.
   *
   * Default: true
   */
  readonly clearable?: boolean;

  /**
   * Delay before visible typing is committed to TanStack's
   * globalFilter state.
   *
   * This is particularly important for server-backed tables because
   * globalFilter participates in the server query/request key.
   *
   * 0:
   *   commit every edit immediately
   *
   * 250–400:
   *   recommended range for server-backed search
   *
   * Default:
   *
   *   0
   *
   * The generic DataTable does not assume that a table is remote.
   */
  readonly debounceMs?: number;
}
