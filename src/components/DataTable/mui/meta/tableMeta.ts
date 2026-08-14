// src/components/DataTable/mui/meta/tableMeta.ts

/**
 * Density modes understood by the MUI DataTable renderer.
 *
 * This belongs to our rendering system rather than TanStack's
 * feature/state system.
 */
export type MuiDataTableDensity = "compact" | "standard" | "comfortable";

/**
 * MUI-specific table metadata.
 *
 * This is intentionally small during Phase 1.4.
 *
 * Do not put services, commands, EventBus, or plugin registries here.
 * Those belong to our DataTable runtime infrastructure.
 */
export interface MuiDataTableMeta {
  /**
   * Rendering density.
   */
  readonly density?: MuiDataTableDensity;
}
