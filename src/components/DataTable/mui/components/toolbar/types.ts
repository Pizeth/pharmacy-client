// src/components/DataTable/mui/components/toolbar/types.ts

import type { ReactNode } from "react";
import type { RowData } from "@tanstack/table-core";
import type { MuiDataTableInstance } from "../../table";
import { DataTableColumnManagerConfig } from "../column-manager";

/**
 * Preferred desktop position for the global-search input.
 *
 * On narrow layouts, the search field is moved to its own full-width
 * toolbar row regardless of this setting.
 */
export type DataTableToolbarSearchPosition = "start" | "center" | "end";

/**
 * Controls whether global search is permanently visible or can be
 * collapsed behind a toolbar action.
 *
 * "always"
 *   Search is always rendered while `search !== false`.
 *
 * "collapsible"
 *   Search visibility is controlled independently from TanStack's
 *   globalFilter state.
 *
 * Hiding the search input does NOT clear globalFilter.
 */
export type DataTableToolbarSearchMode = "always" | "collapsible";

/**
 * Context supplied to dynamic toolbar content.
 */
export interface DataTableToolbarRenderContext<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
}

/**
 * Static or table-aware toolbar content.
 *
 * Keep this existing API because it is already working correctly in
 * our project.
 */
export type DataTableToolbarContent<TData extends RowData> =
  | ReactNode
  | ((context: DataTableToolbarRenderContext<TData>) => ReactNode);

/**
 * High-level DataTable toolbar configuration.
 */
export interface DataTableToolbarConfig<TData extends RowData> {
  /**
   * Whether the standard global-search UI is rendered.
   *
   * Default: true.
   */
  readonly search?: boolean;

  /**
   * Global-search presentation mode.
   *
   * Default: "always".
   */
  readonly searchMode?: DataTableToolbarSearchMode;

  /**
   * Preferred desktop search position.
   *
   * Default: "center".
   *
   * Responsive layouts may move the search field onto its own row.
   */
  readonly searchPosition?: DataTableToolbarSearchPosition;

  /**
   * Placeholder passed to DataTableGlobalFilter.
   */
  readonly searchPlaceholder?: string;

  /**
   * Debounce interval used by the standard global-search input.
   *
   * This controls presentation-to-TanStack commit timing only.
   *
   * It does NOT introduce another query state.
   *
   * Recommended for server-backed tables:
   *
   *   250–400ms
   *
   * Default:
   *
   *   0
   */
  readonly searchDebounceMs?: number;

  /**
   * Controlled visibility of the global-search field when
   * searchMode === "collapsible".
   *
   * Ignored by "always" mode.
   */
  readonly searchOpen?: boolean;

  /**
   * Initial search visibility when uncontrolled and
   * searchMode === "collapsible".
   *
   * Default: false.
   */
  readonly defaultSearchOpen?: boolean;

  /**
   * Called whenever collapsible search visibility changes.
   */
  readonly onSearchOpenChange?: (open: boolean) => void;

  /**
   * Application-defined content rendered in the toolbar's start region.
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
   * Application-defined content rendered before the built-in
   * internal actions on the toolbar's end side.
   */
  readonly endContent?:
    | ReactNode
    | ((context: DataTableToolbarRenderContext<TData>) => ReactNode);

  /**
   * Show the lightweight selected-row summary in the toolbar
   * when rows are selected.
   *
   * For tables using the Phase 1.6.5 selection bar, this will usually
   * be false.
   *
   * Default: true.
   */
  readonly showSelectionSummary?: boolean;

  /**
   * Render the standard show/hide column-filter-row visibility control.
   *
   * The control only renders while filter display mode is "subheader".
   *
   * Default: true.
   */
  readonly enableFilterToggle?: boolean;

  /**
   * Show a small status Chip while column filters are active.
   *
   * The Chip includes a clear-all action.
   *
   * Default: false.
   *
   * We deliberately default this to false because the filter-toggle
   * button already carries an active-filter badge.
   */
  readonly showFilterStatus?: boolean;

  /**
   * Enable the standard column-management surface.
   *
   * Includes visibility and pinning.
   *
   * Default: true.
   */
  readonly enableColumnManager?: boolean;

  readonly columnManager?: DataTableColumnManagerConfig;

  /**
   * Enable density control.
   *
   * Default: true.
   */
  readonly enableDensity?: boolean;

  /**
   * Enable fullscreen control.
   *
   * Default: true.
   */
  readonly enableFullscreen?: boolean;
}
