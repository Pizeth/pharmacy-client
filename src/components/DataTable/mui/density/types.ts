// src/components/DataTable/mui/density/types.ts

/**
 * Visual density modes of the MUI DataTable.
 *
 * Density is intentionally a MUI presentation concept rather than a
 * TanStack's feature/state system.
 *
 * Naming follows the three-level convention:
 *
 * compact
 *   Highest information density.
 *
 * comfortable
 *   Balanced default density.
 *
 * spacious
 *   Largest spacing and easiest scanning.
 */
// export type MuiDataTableDensity = "compact" | "standard" | "comfortable";
export type MuiDataTableDensity = "compact" | "comfortable" | "spacious";

/**
 * Public density configuration accepted by DataTable.
 */
export interface DataTableDensityConfig {
  /**
   * Controlled density.
   *
   * When supplied, the consumer owns the current density value.
   */
  readonly density?: MuiDataTableDensity;

  /**
   * Initial density used in uncontrolled mode.
   *
   * Default: "standard"
   */
  readonly defaultDensity?: MuiDataTableDensity;

  /**
   * Called whenever a density change is requested.
   *
   * This fires in both controlled and uncontrolled modes.
   */
  readonly onDensityChange?: (density: MuiDataTableDensity) => void;
}
