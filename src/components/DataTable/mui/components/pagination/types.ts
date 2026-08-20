export interface DataTablePaginationConfig {
  /**
   * Page-size choices presented to the user.
   */
  readonly pageSizeOptions?: readonly number[];

  /**
   * Whether first/last-page controls should be rendered.
   */
  readonly showFirstLastButtons?: boolean;

  /**
   * Whether the page-size selector should be shown.
   */
  readonly showPageSizeSelector?: boolean;
}
