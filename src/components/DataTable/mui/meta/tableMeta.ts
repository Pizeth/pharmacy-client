// src/components/DataTable/mui/meta/tableMeta.ts

import type { ReactNode } from "react";

/**
 * Density modes understood by the MUI DataTable renderer.
 *
 * This belongs to our rendering system rather than TanStack's
 * feature/state system.
 */
export type MuiDataTableDensity = "compact" | "standard" | "comfortable";

/**
 * MUI-specific table metadata.
 * Rendering-only metadata for the high-level MUI DataTable
 *
 * This is intentionally small during Phase 1.4.
 *
 * Do not put:
 *
 * - services
 * - commands
 * - plugins
 * - event bus
 *
 * in this object.
 * Those belong to our DataTable runtime infrastructure.
 */
export interface MuiDataTableMeta {
  /**
   * Rendering density.
   */
  readonly density?: MuiDataTableDensity;

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
   * Custom empty-state content.
   */
  readonly emptyContent?: ReactNode;

  /**
   * Custom loading-state content.
   */
  readonly loadingContent?: ReactNode;
}
