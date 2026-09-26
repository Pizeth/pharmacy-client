/**
 * Row-pinning presentation modes supported by the MUI DataTable renderer.
 *
 * These intentionally mirror the established Material React Table concepts,
 * while TanStack remains the authority for rowPinning state and row APIs.
 */
export type DataTableRowPinningDisplayMode =
  | "sticky"
  | "top"
  | "bottom"
  | "top-and-bottom"
  | "select-sticky"
  | "select-top"
  | "select-bottom";

/**
 * Modes where explicit per-row pin controls are appropriate.
 *
 * Selection-driven modes deliberately reuse the selection checkbox as the
 * interaction surface and therefore do not need a pinning utility column.
 */
export type DataTableExplicitRowPinningDisplayMode = Exclude<
  DataTableRowPinningDisplayMode,
  "select-sticky" | "select-top" | "select-bottom"
>;

export interface DataTableRowPinningConfig {
  /**
   * Controls how rows already present in TanStack rowPinning state are
   * presented.
   *
   * Default: "sticky"
   */
  readonly displayMode?: DataTableRowPinningDisplayMode;
}

export const DATA_TABLE_DEFAULT_ROW_PINNING_DISPLAY_MODE =
  "sticky" as const satisfies DataTableRowPinningDisplayMode;

/**
 * Sticky modes preserve the row's normal body position and only make it
 * sticky once scrolling reaches it.
 */
export function isDataTableStickyRowPinningMode(
  displayMode: DataTableRowPinningDisplayMode,
): boolean {
  return displayMode.includes("sticky");
}

/**
 * Selection modes use row selection as the interaction surface.
 */
export function isDataTableSelectionRowPinningMode(
  displayMode: DataTableRowPinningDisplayMode,
): boolean {
  return displayMode.startsWith("select-");
}
