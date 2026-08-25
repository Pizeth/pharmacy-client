// src/components/DataTable/mui/columns/actions/types.ts

import type { ReactNode } from "react";
import type { Row, RowData } from "@tanstack/table-core";
import type { IconButtonProps } from "@mui/material";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

/**
 * Stable internal ID used by the standard DataTable actions column.
 */
export const DATA_TABLE_ACTIONS_COLUMN_ID = "__dataTableActions";

/**
 * Context supplied to every application-defined row action.
 *
 * Row actions deliberately receive the full row instance rather than
 * only row.original so advanced applications can still access:
 *
 * - row.id
 * - selection state
 * - expansion state
 * - subRows
 * - other TanStack row APIs
 */
export interface DataTableRowActionContext<TData extends RowData> {
  readonly table: MuiDataTableInstance<TData>;
  readonly row: Row<MuiDataTableFeatures, TData>;
}

/**
 * Value which can either be static or derived from the current
 * action context.
 */
// export type DataTableRowActionValue<TData extends RowData, TValue> =
//   | TValue
//   | ((context: DataTableRowActionContext<TData>) => TValue);

/**
 * One application-defined row action.
 *
 * Row actions are presentation/application commands.
 *
 * They do not become TanStack table state.
 */
export interface DataTableRowAction<TData extends RowData> {
  /**
   * Stable action identifier.
   *
   * Examples:
   *
   *   "edit"
   *   "delete"
   *   "print"
   *   "duplicate"
   */
  readonly id: string;

  /**
   * Human-readable action name.
   *
   * Used by:
   *
   * - tooltips
   * - menu labels
   * - aria labels
   */
  //   readonly label: DataTableRowActionValue<TData, string>;
  readonly label: string;

  /**
   * Optional icon renderer.
   *
   * A renderer rather than static ReactNode lets applications vary
   * the icon by row when necessary without introducing ambiguous
   * callable ReactNode unions.
   */
  readonly renderIcon?: (
    context: DataTableRowActionContext<TData>,
  ) => ReactNode;

  /**
   * Optional icon.
   */
  //   readonly icon?: DataTableRowActionValue<TData, ReactNode>;

  /**
   * MUI semantic color.
   *
   * Default: "default".
   *
   * Particularly useful for destructive actions.
   */
  //   readonly color?: DataTableRowActionValue<TData, IconButtonProps["color"]>;
  readonly color?: IconButtonProps["color"];

  /**
   * Whether this action should be omitted entirely.
   *
   * Default: false.
   */
  //   readonly hidden?: DataTableRowActionValue<TData, boolean>;

  /**
   * Whether this action should be omitted for the current row.
   */
  readonly isHidden?: (context: DataTableRowActionContext<TData>) => boolean;

  /**
   * Whether this action is currently disabled.
   *
   * Default: false.
   */
  //   readonly disabled?: DataTableRowActionValue<TData, boolean>;

  /**
   * Whether this action should be disabled for the current row.
   */
  readonly isDisabled?: (context: DataTableRowActionContext<TData>) => boolean;

  /**
   * Whether the action should prefer direct inline presentation.
   *
   * Default: false.
   *
   * The actions-column configuration may still limit the number of
   * inline buttons and move excess actions into the overflow menu.
   */
  readonly inline?: boolean;

  /**
   * Application callback.
   *
   * The generic DataTable does not:
   *
   * - navigate
   * - mutate server data
   * - open application dialogs
   * - call Refine
   *
   * Those responsibilities remain with the consuming application.
   */
  readonly onClick: (context: DataTableRowActionContext<TData>) => void;
}

/**
 * Configuration for the standard row-actions display column.
 */
export interface CreateActionsColumnOptions<TData extends RowData> {
  /**
   * Actions available for each row.
   */
  readonly actions: readonly DataTableRowAction<TData>[];

  /**
   * Width of the utility column.
   *
   * Default: 120.
   */
  readonly size?: number;

  /**
   * Maximum number of inline buttons before remaining actions are
   * moved into the overflow menu.
   *
   * Default: 2.
   */
  readonly maxInlineActions?: number;

  /**
   * Whether this utility column can be pinned.
   *
   * Default: true.
   */
  readonly enablePinning?: boolean;
}
