import type { CSSProperties } from "react";

/**
 * ------------------------------------------------------------------
 * DataTable runtime CSS-value primitives
 * ------------------------------------------------------------------
 */

/**
 * CSS pixel value generated from a numeric TanStack/runtime
 * measurement.
 *
 * Examples:
 *
 *   "240px"
 *   "56px"
 *   "0px"
 *   "127.5px"
 */
export type DataTableCssPixelValue = `${number}px`;

/**
 * ------------------------------------------------------------------
 * Runtime DataTable column geometry
 * ------------------------------------------------------------------
 *
 * These values are deliberately represented as CSS custom properties
 * rather than static styled rules because they vary at runtime.
 *
 * Examples:
 *
 * - column resizing
 * - column pinning
 * - server/resource-specific column definitions
 *
 * Permanent presentation remains owned by styled MUI slots.
 */
export interface DataTableColumnGeometryStyle extends CSSProperties {
  /**
   * Current committed TanStack column width.
   *
   * Consumed by:
   *
   * - header cells
   * - filter cells
   * - body cells later
   */
  "--DataTable-column-size": DataTableCssPixelValue;

  /**
   * Logical sticky offset for a pinned column.
   *
   * The styled renderer decides whether this becomes:
   *
   *   inset-inline-start
   *
   * or:
   *
   *   inset-inline-end
   *
   * according to:
   *
   *   data-pinned="start"
   *   data-pinned="end"
   *
   * Because this value is logical rather than physical, RTL does not
   * require a separate measurement.
   */
  "--DataTable-column-pinned-offset"?: DataTableCssPixelValue;
}
