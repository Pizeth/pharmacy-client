// src/components/DataTable/mui/meta/tableMeta.ts

import type { ReactNode } from "react";

/**
 * MUI-specific table metadata.
 * Rendering-only metadata for the high-level MUI DataTable
 *
 * This contains descriptive table rendering information only.
 *
 * Do not put:
 *
 * - services
 * - commands
 * - plugins
 * - event bus
 *
 * Mutable MUI view state such as density does NOT belong here.
 *
 * in this object.
 * Those belong to our DataTable runtime infrastructure.
 */
export interface MuiDataTableMeta {
  /**
   * Rendering density.
   */
  // readonly density?: MuiDataTableDensity;

  /**
   * Whether the table body is currently loading data.
   */
  readonly loading?: boolean;

  /**
   * Optional rendering-level error.
   *
   * The table does not interpret transport/domain errors.
   */
  readonly error?: ReactNode;

  /**
   * Content used when the source/current row model is empty without
   * an active filtering condition.
   */
  readonly emptyContent?: ReactNode;

  /**
   * Custom loading-state content.
   */
  readonly loadingContent?: ReactNode;

  /**
   * Content used when column/global filtering produces no matching
   * rows.
   */
  readonly noResultsContent?: ReactNode;
}
