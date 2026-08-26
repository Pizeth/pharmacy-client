// src/components/DataTable/mui/components/selection/types.ts

import type { ReactNode } from "react";
import type { ButtonProps } from "@mui/material";
import type { Row, RowData } from "@tanstack/table-core";
import type { MuiDataTableFeatures } from "../../features";
import type { MuiDataTableInstance } from "../../table";

/**
 * Fully typed current-selection context.
 *
 * This is derived from TanStack's rowSelection state at render time.
 * It does not own any independent selection state.
 */
export interface DataTableSelectionContext<TData extends RowData> {
  /**
   * Current React-aware DataTable instance.
   */
  readonly table: MuiDataTableInstance<TData>;

  /**
   * IDs currently selected in TanStack rowSelection state.
   */
  readonly selectedRowIds: readonly string[];

  /**
   * Concrete TanStack rows resolved from selectedRowIds.
   */
  readonly selectedRows: readonly Row<MuiDataTableFeatures, TData>[];

  readonly selectedCount: number;
}

/**
 * One application-defined bulk action.
 *
 * Examples:
 *
 * - delete selected documents
 * - print selected documents
 * - archive selected users
 * - assign selected records
 *
 * DataTable only presents and invokes the action.
 * Application behavior remains outside the framework.
 */
export interface DataTableBulkAction<TData extends RowData> {
  /**
   * Stable application-defined ID.
   */
  readonly id: string;

  /**
   * Human-readable label.
   */
  readonly label: string;

  /**
   * Optional icon renderer.
   */
  readonly renderIcon?: (
    context: DataTableSelectionContext<TData>,
  ) => ReactNode;

  /**
   * MUI semantic color.
   *
   * Default: "primary".
   */
  readonly color?: ButtonProps["color"];

  /**
   * MUI presentation variant.
   *
   * Default: "text".
   */
  readonly variant?: ButtonProps["variant"];

  /**
   * Hide this action for the current selection.
   */
  readonly isHidden?: (context: DataTableSelectionContext<TData>) => boolean;

  /**
   * Disable this action for the current selection.
   */
  readonly isDisabled?: (context: DataTableSelectionContext<TData>) => boolean;

  /**
   * Application callback.
   */
  readonly onClick: (context: DataTableSelectionContext<TData>) => void;
}

/**
 * Configuration for the high-level selection status bar.
 */
export interface DataTableSelectionBarConfig<TData extends RowData> {
  /**
   * Application-defined bulk actions.
   */
  readonly actions?: readonly DataTableBulkAction<TData>[];

  /**
   * Whether the clear-selection button is rendered.
   *
   * Default: true.
   */
  readonly clearable?: boolean;

  /**
   * Optional static leading content.
   */
  readonly startContent?: ReactNode;

  /**
   * Optional dynamic leading content.
   *
   * Takes precedence over startContent.
   */
  readonly renderStartContent?: (
    context: DataTableSelectionContext<TData>,
  ) => ReactNode;

  /**
   * Optional static trailing content.
   *
   * This renders before bulk actions.
   */
  readonly endContent?: ReactNode;

  /**
   * Dynamic trailing content.
   */
  readonly renderEndContent?: (
    context: DataTableSelectionContext<TData>,
  ) => ReactNode;
}
