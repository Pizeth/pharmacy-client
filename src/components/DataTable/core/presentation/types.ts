// src/components/DataTable/core/presentation/types.ts

/**
 * MUI currently uses these breakpoint names as well, but core owns its own
 * structural contract so importing DataTable core never loads @mui/material.
 */
export type DataTableBreakpoint =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

export type DataTableDisplayMode =
  | "table"
  | "card"
  | "auto";

export interface DataTableDisplayModeConfig {
  readonly displayMode?: DataTableDisplayMode;
  readonly defaultDisplayMode?: DataTableDisplayMode;
  readonly autoCardBreakpoint?: DataTableBreakpoint;
  readonly onDisplayModeChange?: (
    mode: DataTableDisplayMode,
  ) => void;
}
