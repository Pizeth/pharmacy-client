// src/components/DataTable/mui/presentation/types.ts

/**
 * Requested DataTable presentation mode.
 *
 * This is deliberately NOT TanStack table state.
 *
 * "table"
 *   Render the semantic table presentation.
 *
 * "card"
 *   Render the card presentation introduced in Phase 1.9.2.
 *
 * "auto"
 *   Let a later responsive policy resolve the physical renderer.
 *   Resolution is intentionally deferred to Phase 1.9.4.
 */
export type DataTableDisplayMode = "table" | "card" | "auto";

/**
 * Public controlled/uncontrolled presentation-state contract.
 *
 * Switching this value must not mutate DataTableServerQueryState.
 */
export interface DataTableDisplayModeConfig {
  /**
   * Controlled requested mode.
   */
  readonly displayMode?: DataTableDisplayMode;

  /**
   * Initial requested mode for uncontrolled usage.
   *
   * Default: "table".
   */
  readonly defaultDisplayMode?: DataTableDisplayMode;

  /**
   * Fired whenever a display-mode change is requested.
   *
   * This fires in both controlled and uncontrolled modes.
   */
  readonly onDisplayModeChange?: (mode: DataTableDisplayMode) => void;
}
