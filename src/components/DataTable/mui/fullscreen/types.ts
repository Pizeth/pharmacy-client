/**
 * Public fullscreen configuration for the MUI DataTable.
 */
export interface DataTableFullscreenConfig {
  /**
   * Controlled fullscreen state.
   */
  readonly fullscreen?: boolean;

  /**
   * Initial state for uncontrolled usage.
   *
   * Default: false
   */
  readonly defaultFullscreen?: boolean;

  /**
   * Fired whenever a fullscreen state change is requested.
   */
  readonly onFullscreenChange?: (fullscreen: boolean) => void;
}
