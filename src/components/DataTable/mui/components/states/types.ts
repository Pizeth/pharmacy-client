import type { ReactNode } from "react";

export interface DataTableBodyStateProps {
  /**
   * Number of visible columns.
   *
   * The state occupies one native table row and must span
   * the complete rendered table width.
   */
  readonly colSpan: number;
  readonly children?: ReactNode;
}
