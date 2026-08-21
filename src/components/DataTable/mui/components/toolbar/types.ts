import type { ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";

export type DataTableToolbarSearchPosition = "start" | "center" | "end";

export interface DataTableToolbarRenderContext<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

export interface DataTableToolbarConfig<TData extends RowData> {
  /**
   * Whether the standard global-filter field is rendered.
   *
   * Default: true.
   */
  readonly search?: boolean;

  /**
   * Preferred desktop search position.
   *
   * Default: "center".
   *
   * Responsive layouts may move the search field onto its own row.
   */
  readonly searchPosition?: DataTableToolbarSearchPosition;

  /**
   * Search placeholder.
   */
  readonly searchPlaceholder?: string;

  /**
   * Content rendered in the application-action area.
   *
   * Example:
   *
   *   Add document
   *   Export
   *   custom workflow actions
   */
  readonly startContent?:
    | ReactNode
    | ((context: DataTableToolbarRenderContext<TData>) => ReactNode);

  /**
   * Extra content before the built-in internal actions.
   */
  readonly endContent?:
    | ReactNode
    | ((context: DataTableToolbarRenderContext<TData>) => ReactNode);

  /**
   * Built-in table action switches.
   */
  readonly enableColumnVisibility?: boolean;

  readonly enableDensity?: boolean;

  readonly enableFullscreen?: boolean;

  /**
   * Show current selection information when rows are selected.
   */
  readonly showSelectionSummary?: boolean;
}
