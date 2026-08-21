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
   * Whether the clear button should be shown when a value exists.
   *
   * Default: true
   */
  readonly clearable?: boolean;
}
