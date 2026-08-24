// mui/components/column-manager/types.ts

import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";

/**
 * General rendering context supplied to column-manager extensions.
 */
export interface DataTableColumnManagerContext<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Column manager presentation configuration.
 */
export interface DataTableColumnManagerConfig {
  /**
   * Show ordering controls.
   *
   * Default: true.
   */
  readonly enableOrdering?: boolean;

  /**
   * Show visibility switches.
   *
   * Default: true
   */
  readonly enableVisibility?: boolean;

  /**
   * Show logical start/end pinning controls.
   *
   * Default: true
   */
  readonly enablePinning?: boolean;

  /**
   * Show reset controls.
   *
   * Default: true
   */
  readonly enableReset?: boolean;
}
